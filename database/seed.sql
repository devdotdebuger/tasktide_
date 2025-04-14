
-- Seed data for TaskTide

-- Insert some users
INSERT INTO auth.users (id, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@tasktide.com'),
  ('00000000-0000-0000-0000-000000000002', 'john@example.com'),
  ('00000000-0000-0000-0000-000000000003', 'jane@example.com'),
  ('00000000-0000-0000-0000-000000000004', 'bob@example.com'),
  ('00000000-0000-0000-0000-000000000005', 'alice@example.com');

-- Insert user profiles
INSERT INTO public.users (id, email, username, password_hash, avatar) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@tasktide.com', 'Admin User', '$2a$10$xJwRFt3hj/IWNLf5u.eSz.xQRF.tYkTNQx/ugQBDz2m.eFrxYBBFS', '/lovable-uploads/avatars/marvel-ironman.png'),
  ('00000000-0000-0000-0000-000000000002', 'john@example.com', 'John Doe', '$2a$10$xJwRFt3hj/IWNLf5u.eSz.xQRF.tYkTNQx/ugQBDz2m.eFrxYBBFS', '/lovable-uploads/avatars/marvel-thor.png'),
  ('00000000-0000-0000-0000-000000000003', 'jane@example.com', 'Jane Smith', '$2a$10$xJwRFt3hj/IWNLf5u.eSz.xQRF.tYkTNQx/ugQBDz2m.eFrxYBBFS', '/lovable-uploads/avatars/dc-wonderwoman.png'),
  ('00000000-0000-0000-0000-000000000004', 'bob@example.com', 'Bob Johnson', '$2a$10$xJwRFt3hj/IWNLf5u.eSz.xQRF.tYkTNQx/ugQBDz2m.eFrxYBBFS', '/lovable-uploads/avatars/marvel-captain.png'),
  ('00000000-0000-0000-0000-000000000005', 'alice@example.com', 'Alice Green', '$2a$10$xJwRFt3hj/IWNLf5u.eSz.xQRF.tYkTNQx/ugQBDz2m.eFrxYBBFS', '/lovable-uploads/avatars/dc-batman.png');

-- Insert teams
INSERT INTO teams (id, name, description, owner_id) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Development Team', 'Main product development team', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000011', 'Marketing Team', 'Product marketing and promotion', '00000000-0000-0000-0000-000000000003');

-- Insert team members
INSERT INTO team_members (team_id, user_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'admin', 'active'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'member', 'active'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', 'member', 'active'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', 'viewer', 'active'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'admin', 'active'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000005', 'member', 'active');

-- Insert tasks
INSERT INTO tasks (id, title, description, status, assignee_id, team_id, priority, deadline, created_by) VALUES
  ('00000000-0000-0000-0000-000000000020', 'Implement login page', 'Create the login page with email and password authentication', 'todo', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'high', now() + interval '3 days', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000021', 'Design dashboard UI', 'Create mockups for the main dashboard interface', 'in-progress', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', 'medium', now() + interval '5 days', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000022', 'Fix navigation bug', 'The sidebar navigation collapses unexpectedly on mobile', 'done', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'high', now() - interval '1 day', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000023', 'Write documentation', 'Create user documentation for the app', 'todo', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', 'low', now() + interval '7 days', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000024', 'Create marketing plan', 'Develop a marketing strategy for Q3', 'in-progress', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011', 'high', now() + interval '10 days', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000025', 'Design social media graphics', 'Create banner images for Twitter and Facebook', 'todo', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000011', 'medium', now() + interval '4 days', '00000000-0000-0000-0000-000000000003');

-- Insert task labels
INSERT INTO task_labels (task_id, label) VALUES
  ('00000000-0000-0000-0000-000000000020', 'feature'),
  ('00000000-0000-0000-0000-000000000021', 'design'),
  ('00000000-0000-0000-0000-000000000022', 'bug'),
  ('00000000-0000-0000-0000-000000000023', 'documentation'),
  ('00000000-0000-0000-0000-000000000024', 'improvement'),
  ('00000000-0000-0000-0000-000000000025', 'design');

-- Insert task dependencies
INSERT INTO task_dependencies (task_id, dependency_id) VALUES
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000020'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000022'),
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000024');

-- Insert comments
INSERT INTO comments (task_id, author_id, content) VALUES
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'Make sure to include forgot password functionality'),
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 'I''ll add that to my implementation'),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000004', 'This should be fixed in the latest commit'),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', 'Confirmed fixed, great work!'),
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000003', 'Let''s focus on social media for this quarter'),
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000005', 'I agree, that seems like the best approach');

-- Insert achievement types
INSERT INTO achievement_types (id, name, description, icon, criteria) VALUES
  ('00000000-0000-0000-0000-000000000030', 'Task Master', 'Complete 10 tasks', 'trophy', '{"completed_tasks": 10}'),
  ('00000000-0000-0000-0000-000000000031', 'Early Bird', 'Complete a task before the deadline', 'clock', '{"early_completion": true}'),
  ('00000000-0000-0000-0000-000000000032', 'Team Player', 'Join 3 different teams', 'users', '{"team_count": 3}'),
  ('00000000-0000-0000-0000-000000000033', 'Bug Hunter', 'Fix 5 bugs', 'bug', '{"bug_fixes": 5}');

-- Insert user achievements
INSERT INTO user_achievements (user_id, achievement_id) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000030'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000031'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000032');

-- Insert conversations
INSERT INTO conversations (id) VALUES
  ('00000000-0000-0000-0000-000000000040'),
  ('00000000-0000-0000-0000-000000000041');

-- Insert conversation participants
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000003');

-- Insert messages
INSERT INTO messages (conversation_id, sender_id, content, read_by) VALUES
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000001', 'Hi John, how is the login page coming along?', '["00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000002"]'::jsonb),
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000002', 'It''s going well! I should have it ready by tomorrow.', '["00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000002"]'::jsonb),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000001', 'Jane, can we discuss the marketing plan?', '["00000000-0000-0000-0000-000000000001"]'::jsonb),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000003', 'Sure, I''m available tomorrow at 2pm', '["00000000-0000-0000-0000-000000000003"]'::jsonb);

-- Insert notifications
INSERT INTO notifications (user_id, type, content) VALUES
  ('00000000-0000-0000-0000-000000000002', 'task_assigned', '{"task_id": "00000000-0000-0000-0000-000000000020", "task_title": "Implement login page", "assigner_name": "Admin User"}'::jsonb),
  ('00000000-0000-0000-0000-000000000004', 'task_assigned', '{"task_id": "00000000-0000-0000-0000-000000000021", "task_title": "Design dashboard UI", "assigner_name": "Admin User"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'task_completed', '{"task_id": "00000000-0000-0000-0000-000000000022", "task_title": "Fix navigation bug", "completer_name": "John Doe"}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'achievement_earned', '{"achievement_id": "00000000-0000-0000-0000-000000000031", "achievement_name": "Early Bird", "achievement_description": "Complete a task before the deadline"}'::jsonb);
