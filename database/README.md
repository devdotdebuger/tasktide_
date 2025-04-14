
# TaskTide Database Setup

This directory contains SQL files for setting up the TaskTide database in Supabase.

## 📁 Files Structure

- `schema.sql` - Database tables and relationships
- `rls_policies.sql` - Row Level Security policies
- `functions.sql` - Database functions and triggers
- `seed.sql` - Sample data for development

## 🚀 Setup Instructions

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Navigate to the SQL editor in your Supabase dashboard
3. Execute the SQL files in the following order:
   ```bash
   1. schema.sql     # Creates tables and relationships
   2. rls_policies.sql   # Sets up security policies
   3. functions.sql  # Creates helper functions
   4. seed.sql      # (Optional) Adds sample data
   ```

## 📊 Database Structure

### Core Tables

#### `users`
- User accounts and profiles
- Contains: id, email, username, password_hash, avatar
- Protected by RLS for user-specific access

#### `teams`
- Teams that users can create and join
- Contains: id, name, description, owner_id
- RLS ensures team member access only

#### `team_members`
- Maps users to teams with roles
- Contains: team_id, user_id, role
- Controls team access permissions

#### `tasks`
- Task information and metadata
- Contains: id, title, description, status, assignee_id
- RLS based on team membership and assignment

#### `comments`
- Comments on tasks
- Contains: id, task_id, user_id, content
- Access controlled by task visibility

#### `conversations`
- Messaging conversations
- Contains: id, type (direct/group)
- RLS based on conversation participation

#### `messages`
- Individual messages within conversations
- Contains: id, conversation_id, sender_id, content
- Protected by conversation membership

#### `attachments`
- Files attached to messages or tasks
- Contains: id, file_url, content_type
- Access follows parent resource permissions

## 🔐 Security Model

### Row Level Security (RLS)

All tables have RLS policies that restrict access based on:
- User authentication status
- Team membership
- Resource ownership
- Role-based permissions

### Authentication

- Uses Supabase Auth
- JWT tokens for session management
- `auth.user_id()` for user context

### Key Policies

1. **Users**
   - Public read for basic profiles
   - Self-only update access

2. **Teams**
   - Read access for team members
   - Update access for team admins
   - Delete access for team owners

3. **Tasks**
   - Read access for team members
   - Create/Update for assignees and creators
   - Delete for task creators and team admins

4. **Messages**
   - Read/Write access for conversation participants only

## 🛠️ Database Functions

### Helper Functions

1. `create_team_with_owner(team_name, owner_id)`
   - Creates team and adds owner as admin

2. `invite_user_to_team(team_id, user_email)`
   - Sends team invitation

3. `accept_team_invitation(invitation_id)`
   - Processes team join acceptance

4. `assign_task(task_id, assignee_id)`
   - Updates task assignment with checks

5. `create_direct_message_conversation(user1_id, user2_id)`
   - Creates or finds DM conversation

### Triggers

1. **Timestamp Updates**
   - Automatically updates `updated_at`
   - Applies to all relevant tables

2. **Notification Triggers**
   - Task assignments
   - Comment additions
   - Message notifications

3. **Achievement Tracking**
   - Task completion milestones
   - Team contribution tracking

## 📝 Development Guidelines

1. Always test RLS policies thoroughly
2. Use prepared statements for dynamic SQL
3. Include appropriate indexes
4. Document any schema changes
5. Follow naming conventions:
   - Tables: plural, lowercase, underscore
   - Functions: verb_noun format
   - Triggers: table_action_trigger

## 🔄 Migration Process

1. Create new migration file:
   ```sql
   -- migrations/YYYYMMDD_description.sql
   ```
2. Test locally using Supabase CLI
3. Apply to development environment
4. Review and test thoroughly
5. Apply to production

## 🐛 Troubleshooting

Common issues and solutions:
1. RLS Policy Issues
   - Check `auth.uid()` availability
   - Verify policy conditions
2. Performance Problems
   - Review query plans
   - Check index usage
3. Function Errors
   - Validate parameter types
   - Check return values

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgREST Documentation](https://postgrest.org/en/stable/)
