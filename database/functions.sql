
-- Database functions for TaskTide

-- Function to create a new team and automatically add the creator as the owner
CREATE OR REPLACE FUNCTION create_team_with_owner(
  team_name TEXT,
  team_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_team_id UUID;
BEGIN
  -- Insert the new team
  INSERT INTO teams (name, description, owner_id)
  VALUES (team_name, team_description, auth.user_id())
  RETURNING id INTO new_team_id;
  
  -- Add the creator as an admin team member
  INSERT INTO team_members (team_id, user_id, role, status)
  VALUES (new_team_id, auth.user_id(), 'admin', 'active');
  
  RETURN new_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to invite a user to a team
CREATE OR REPLACE FUNCTION invite_user_to_team(
  team_id UUID,
  user_email TEXT,
  member_role TEXT DEFAULT 'member'
) RETURNS BOOLEAN AS $$
DECLARE
  invited_user_id UUID;
  notification_content JSONB;
BEGIN
  -- Check if the current user is an admin of the team
  IF NOT EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = team_id
    AND team_members.user_id = auth.user_id()
    AND team_members.role IN ('admin')
  ) THEN
    RAISE EXCEPTION 'Only team admins can invite users';
  END IF;
  
  -- Find the user by email
  SELECT id INTO invited_user_id
  FROM users
  WHERE email = user_email;
  
  IF invited_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = team_id
    AND team_members.user_id = invited_user_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this team';
  END IF;
  
  -- Add the user as a team member with 'invited' status
  INSERT INTO team_members (team_id, user_id, role, status)
  VALUES (team_id, invited_user_id, member_role, 'invited');
  
  -- Create a team invitation notification
  SELECT jsonb_build_object(
    'team_id', team_id,
    'team_name', (SELECT name FROM teams WHERE id = team_id),
    'inviter_id', auth.user_id(),
    'inviter_name', (SELECT username FROM users WHERE id = auth.user_id())
  ) INTO notification_content;
  
  INSERT INTO notifications (user_id, type, content)
  VALUES (invited_user_id, 'team_invite', notification_content);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept a team invitation
CREATE OR REPLACE FUNCTION accept_team_invitation(
  team_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the invitation exists
  IF NOT EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = team_id
    AND team_members.user_id = auth.user_id()
    AND team_members.status = 'invited'
  ) THEN
    RAISE EXCEPTION 'No invitation found for this team';
  END IF;
  
  -- Update the status to 'active'
  UPDATE team_members
  SET status = 'active'
  WHERE team_id = team_id
  AND user_id = auth.user_id();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign a task to a user
CREATE OR REPLACE FUNCTION assign_task(
  task_id UUID,
  assignee_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  task_team_id UUID;
  notification_content JSONB;
BEGIN
  -- Get the team ID for the task
  SELECT team_id INTO task_team_id
  FROM tasks
  WHERE id = task_id;
  
  -- Check if the current user has permission to assign tasks
  IF NOT EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = task_team_id
    AND team_members.user_id = auth.user_id()
    AND team_members.role IN ('admin', 'member')
  ) THEN
    RAISE EXCEPTION 'You do not have permission to assign tasks in this team';
  END IF;
  
  -- Check if the assignee is a member of the team
  IF NOT EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = task_team_id
    AND team_members.user_id = assignee_user_id
    AND team_members.status = 'active'
  ) THEN
    RAISE EXCEPTION 'The assignee must be an active member of the team';
  END IF;
  
  -- Update the task
  UPDATE tasks
  SET assignee_id = assignee_user_id
  WHERE id = task_id;
  
  -- Create a notification for the assignee
  SELECT jsonb_build_object(
    'task_id', task_id,
    'task_title', (SELECT title FROM tasks WHERE id = task_id),
    'team_id', task_team_id,
    'assigner_id', auth.user_id(),
    'assigner_name', (SELECT username FROM users WHERE id = auth.user_id())
  ) INTO notification_content;
  
  INSERT INTO notifications (user_id, type, content)
  VALUES (assignee_user_id, 'task_assigned', notification_content);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a direct message conversation between two users
CREATE OR REPLACE FUNCTION create_direct_message_conversation(
  recipient_user_id UUID
) RETURNS UUID AS $$
DECLARE
  new_conversation_id UUID;
  current_user_id UUID := auth.user_id();
BEGIN
  -- Check if a conversation already exists between these users
  SELECT cp1.conversation_id INTO new_conversation_id
  FROM conversation_participants cp1
  JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  JOIN conversations c ON c.id = cp1.conversation_id
  WHERE cp1.user_id = current_user_id
  AND cp2.user_id = recipient_user_id
  -- Only return direct message conversations (with exactly 2 participants)
  AND (
    SELECT COUNT(*) FROM conversation_participants
    WHERE conversation_id = cp1.conversation_id
  ) = 2
  LIMIT 1;
  
  -- If no conversation exists, create a new one
  IF new_conversation_id IS NULL THEN
    -- Create the conversation
    INSERT INTO conversations DEFAULT VALUES
    RETURNING id INTO new_conversation_id;
    
    -- Add current user as participant
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (new_conversation_id, current_user_id);
    
    -- Add recipient as participant
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (new_conversation_id, recipient_user_id);
  END IF;
  
  RETURN new_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send a message and update conversation metadata
CREATE OR REPLACE FUNCTION send_message(
  conversation_id UUID,
  message_content TEXT
) RETURNS UUID AS $$
DECLARE
  new_message_id UUID;
  current_user_id UUID := auth.user_id();
BEGIN
  -- Check if user is a participant in the conversation
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = send_message.conversation_id
    AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You are not a participant in this conversation';
  END IF;
  
  -- Create the message
  INSERT INTO messages (conversation_id, sender_id, content)
  VALUES (conversation_id, current_user_id, message_content)
  RETURNING id INTO new_message_id;
  
  -- Update last_message_at and increase unread_count for other participants
  UPDATE conversations
  SET last_message_at = now(), updated_at = now()
  WHERE id = conversation_id;
  
  UPDATE conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = send_message.conversation_id
  AND user_id != current_user_id;
  
  -- Create notifications for other participants
  INSERT INTO notifications (user_id, type, content)
  SELECT 
    cp.user_id, 
    'message_received'::notification_type, 
    jsonb_build_object(
      'conversation_id', conversation_id,
      'message_id', new_message_id,
      'sender_id', current_user_id,
      'sender_name', (SELECT username FROM users WHERE id = current_user_id),
      'message_preview', LEFT(message_content, 50)
    )
  FROM conversation_participants cp
  WHERE cp.conversation_id = send_message.conversation_id
  AND cp.user_id != current_user_id;
  
  RETURN new_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_as_read(
  conversation_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID := auth.user_id();
BEGIN
  -- Check if user is a participant
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = mark_conversation_as_read.conversation_id
    AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You are not a participant in this conversation';
  END IF;
  
  -- Update read status for all messages
  UPDATE messages
  SET read_by = read_by || jsonb_build_array(current_user_id)
  WHERE conversation_id = mark_conversation_as_read.conversation_id
  AND NOT read_by @> jsonb_build_array(current_user_id);
  
  -- Reset unread count
  UPDATE conversation_participants
  SET unread_count = 0
  WHERE conversation_id = mark_conversation_as_read.conversation_id
  AND user_id = current_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update task updated_at timestamp
CREATE OR REPLACE FUNCTION update_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_timestamp_trigger
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_task_timestamp();

-- Trigger to automatically check for achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
DECLARE
  achievement achievement_types;
  user_stats RECORD;
BEGIN
  -- Get user stats
  SELECT 
    COUNT(*) FILTER (WHERE status = 'done') AS completed_tasks,
    COUNT(*) AS total_tasks,
    MAX(updated_at) - MIN(created_at) AS account_age
  INTO user_stats
  FROM tasks
  WHERE created_by = NEW.created_by OR assignee_id = NEW.created_by;
  
  -- Check each achievement type
  FOR achievement IN 
    SELECT * FROM achievement_types
  LOOP
    -- Check if user already has this achievement
    IF NOT EXISTS (
      SELECT 1 FROM user_achievements
      WHERE user_id = NEW.created_by
      AND achievement_id = achievement.id
    ) THEN
      -- Check if criteria is met
      IF 
        (achievement.criteria->>'completed_tasks')::int <= user_stats.completed_tasks OR
        (achievement.criteria->>'total_tasks')::int <= user_stats.total_tasks
      THEN
        -- Grant achievement
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (NEW.created_by, achievement.id);
        
        -- Create notification
        INSERT INTO notifications (user_id, type, content)
        VALUES (
          NEW.created_by, 
          'achievement_earned', 
          jsonb_build_object(
            'achievement_id', achievement.id,
            'achievement_name', achievement.name,
            'achievement_description', achievement.description,
            'achievement_icon', achievement.icon
          )
        );
      END IF;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_achievement_check
AFTER INSERT OR UPDATE OF status ON tasks
FOR EACH ROW
EXECUTE FUNCTION check_achievements();
