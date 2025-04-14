
# TaskTide Database Setup

This directory contains SQL files for setting up the TaskTide database in Supabase.

## Setup Order

1. Run `schema.sql` to create the database tables and relationships
2. Run `rls_policies.sql` to set up Row Level Security policies
3. Run `functions.sql` to create database functions and triggers

## Database Structure

The TaskTide database consists of the following main tables:

- `users` - User accounts and profiles
- `teams` - Teams that users can create and join
- `team_members` - Mapping between users and teams
- `tasks` - Task information
- `comments` - Comments on tasks
- `conversations` - Messaging conversations
- `messages` - Individual messages
- `attachments` - Files attached to messages or tasks

## Authentication

TaskTide uses Supabase Auth for user authentication. The RLS policies are designed to work with Supabase Auth, using the `auth.user_id()` function to get the current user's ID.

## Row Level Security

All tables have RLS policies that restrict access based on user permissions:

- Users can only view and modify their own data
- Team members can view team data
- Team admins can manage team data and members
- Task creators and assignees have special permissions for their tasks

## Database Functions

Several helper functions are provided to simplify common operations:

- `create_team_with_owner` - Creates a new team and automatically adds the creator as admin
- `invite_user_to_team` - Sends a team invitation to a user
- `accept_team_invitation` - Accepts a team invitation
- `assign_task` - Assigns a task to a team member
- `create_direct_message_conversation` - Creates or finds a direct message conversation
- `send_message` - Sends a message and updates conversation metadata
- `mark_conversation_as_read` - Marks all messages in a conversation as read

## Triggers

Automatic triggers handle:

- Updating timestamps when records are modified
- Checking for achievements when tasks are completed
- Sending notifications for various events
