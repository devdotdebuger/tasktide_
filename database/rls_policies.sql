
-- Row Level Security Policies for TaskTide Application

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create an authentication helper function
CREATE OR REPLACE FUNCTION auth.user_id() RETURNS UUID AS $$
  SELECT auth.uid()
$$ LANGUAGE SQL STABLE;

-- Users policies
-- Users can read public information about all users
CREATE POLICY users_read_public ON users
  FOR SELECT USING (true);

-- Users can only update their own records
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (id = auth.user_id());

-- Teams policies
-- Users can read teams they are members of
CREATE POLICY teams_read_member ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.user_id()
    )
  );

-- Only team owners can update teams
CREATE POLICY teams_update_owner ON teams
  FOR UPDATE USING (owner_id = auth.user_id());

-- Users can create teams
CREATE POLICY teams_insert ON teams
  FOR INSERT WITH CHECK (owner_id = auth.user_id());

-- Only team owners can delete teams
CREATE POLICY teams_delete_owner ON teams
  FOR DELETE USING (owner_id = auth.user_id());

-- Team members policies
-- Team members are visible to all team members
CREATE POLICY team_members_read ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.user_id()
    )
  );

-- Team admins and owners can manage team members
CREATE POLICY team_members_insert ON team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      JOIN teams ON tm.team_id = teams.id
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.user_id()
      AND (tm.role = 'admin' OR teams.owner_id = auth.user_id())
    )
  );

-- Team admins and owners can update members
CREATE POLICY team_members_update ON team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      JOIN teams ON tm.team_id = teams.id
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.user_id()
      AND (tm.role = 'admin' OR teams.owner_id = auth.user_id())
    )
  );

-- Members can leave teams (delete their own membership)
CREATE POLICY team_members_delete_own ON team_members
  FOR DELETE USING (
    user_id = auth.user_id() OR
    EXISTS (
      SELECT 1 FROM team_members AS tm
      JOIN teams ON tm.team_id = teams.id
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.user_id()
      AND (tm.role = 'admin' OR teams.owner_id = auth.user_id())
    )
  );

-- Tasks policies
-- Team members can read team tasks
CREATE POLICY tasks_read ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = tasks.team_id
      AND team_members.user_id = auth.user_id()
    )
  );

-- Team members can create tasks
CREATE POLICY tasks_insert ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = tasks.team_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role IN ('admin', 'member')
    )
  );

-- Task creators, assignees, and team admins can update tasks
CREATE POLICY tasks_update ON tasks
  FOR UPDATE USING (
    created_by = auth.user_id() OR
    assignee_id = auth.user_id() OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = tasks.team_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role IN ('admin')
    )
  );

-- Task creators and team admins can delete tasks
CREATE POLICY tasks_delete ON tasks
  FOR DELETE USING (
    created_by = auth.user_id() OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = tasks.team_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role IN ('admin')
    )
  );

-- Comments policies
-- Comments are visible to all team members
CREATE POLICY comments_read ON comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN team_members ON tasks.team_id = team_members.team_id
      WHERE tasks.id = comments.task_id
      AND team_members.user_id = auth.user_id()
    )
  );

-- Team members can create comments
CREATE POLICY comments_insert ON comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN team_members ON tasks.team_id = team_members.team_id
      WHERE tasks.id = comments.task_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role IN ('admin', 'member')
    )
  );

-- Users can update their own comments
CREATE POLICY comments_update_own ON comments
  FOR UPDATE USING (author_id = auth.user_id());

-- Users can delete their own comments, and admins can delete any comments
CREATE POLICY comments_delete ON comments
  FOR DELETE USING (
    author_id = auth.user_id() OR
    EXISTS (
      SELECT 1 FROM tasks
      JOIN team_members ON tasks.team_id = team_members.team_id
      WHERE tasks.id = comments.task_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role = 'admin'
    )
  );

-- Task templates policies
-- Team members can read team templates
CREATE POLICY templates_read ON task_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = task_templates.team_id
      AND team_members.user_id = auth.user_id()
    )
  );

-- Team admins can manage templates
CREATE POLICY templates_insert ON task_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = task_templates.team_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role = 'admin'
    )
  );

CREATE POLICY templates_update ON task_templates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = task_templates.team_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role = 'admin'
    )
  );

CREATE POLICY templates_delete ON task_templates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = task_templates.team_id
      AND team_members.user_id = auth.user_id()
      AND team_members.role = 'admin'
    )
  );

-- Conversation policies
-- Users can read conversations they are participants in
CREATE POLICY conversations_read ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
      AND conversation_participants.user_id = auth.user_id()
    )
  );

-- All users can create conversations
CREATE POLICY conversations_insert ON conversations
  FOR INSERT WITH CHECK (true);

-- Conversation participants policies
-- Users can read participant info for conversations they are in
CREATE POLICY conv_participants_read ON conversation_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants AS cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.user_id()
    )
  );

-- Users can add participants to conversations they are in
CREATE POLICY conv_participants_insert ON conversation_participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants AS cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.user_id()
    ) OR
    -- Allow adding yourself to a new conversation
    conversation_participants.user_id = auth.user_id()
  );

-- Messages policies
-- Users can read messages from conversations they are participants in
CREATE POLICY messages_read ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.user_id()
    )
  );

-- Users can send messages to conversations they are participants in
CREATE POLICY messages_insert ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.user_id()
    ) AND
    sender_id = auth.user_id()
  );

-- Users can only update their own messages
CREATE POLICY messages_update_own ON messages
  FOR UPDATE USING (sender_id = auth.user_id());

-- Attachments policies
-- Users can view attachments for messages they can read or tasks they have access to
CREATE POLICY attachments_read ON attachments
  FOR SELECT USING (
    (
      message_id IS NOT NULL AND
      EXISTS (
        SELECT 1 FROM messages
        JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id
        WHERE messages.id = attachments.message_id
        AND conversation_participants.user_id = auth.user_id()
      )
    ) OR (
      task_id IS NOT NULL AND
      EXISTS (
        SELECT 1 FROM tasks
        JOIN team_members ON tasks.team_id = team_members.team_id
        WHERE tasks.id = attachments.task_id
        AND team_members.user_id = auth.user_id()
      )
    )
  );

-- Users can upload attachments
CREATE POLICY attachments_insert ON attachments
  FOR INSERT WITH CHECK (
    uploaded_by = auth.user_id() AND
    (
      (
        message_id IS NOT NULL AND
        EXISTS (
          SELECT 1 FROM messages
          JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id
          WHERE messages.id = attachments.message_id
          AND conversation_participants.user_id = auth.user_id()
        )
      ) OR (
        task_id IS NOT NULL AND
        EXISTS (
          SELECT 1 FROM tasks
          JOIN team_members ON tasks.team_id = team_members.team_id
          WHERE tasks.id = attachments.task_id
          AND team_members.user_id = auth.user_id()
          AND team_members.role IN ('admin', 'member')
        )
      )
    )
  );

-- Users can only delete their own attachments
CREATE POLICY attachments_delete_own ON attachments
  FOR DELETE USING (uploaded_by = auth.user_id());

-- Notifications policies
-- Users can only read their own notifications
CREATE POLICY notifications_read_own ON notifications
  FOR SELECT USING (user_id = auth.user_id());

-- Users can only update their own notifications (e.g. marking as read)
CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (user_id = auth.user_id());

-- System can create notifications for any user
CREATE POLICY notifications_insert ON notifications
  FOR INSERT WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY notifications_delete_own ON notifications
  FOR DELETE USING (user_id = auth.user_id());
