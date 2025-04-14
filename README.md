# TaskTide

A modern task management application built with React, TypeScript, and Supabase.

## 🌐 Live Preview

Visit the live application: [https://tasktide.vercel.app](https://tasktide-flow-sync-devdotdebugers-projects.vercel.app/))

## 🚀 Features

- User authentication and authorization
- Team collaboration
- Task management
- Real-time updates
- File attachments
- Team messaging

## 🛠️ Tech Stack

- **Frontend Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend/Database:** Supabase
- **Real-time:** Supabase Realtime
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tasktide.git
cd tasktide
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the development server:
```bash
npm run dev
```

## 🗄️ Database Structure

The application uses the following main tables in Supabase:

- `users` - User accounts and profiles
- `teams` - Teams that users can create and join
- `team_members` - Mapping between users and teams
- `tasks` - Task information
- `comments` - Comments on tasks
- `conversations` - Messaging conversations
- `messages` - Individual messages
- `attachments` - Files attached to messages or tasks

## 🔐 Authentication

TaskTide uses Supabase Auth for user authentication. The Row Level Security (RLS) policies ensure:

- Users can only view and modify their own data
- Team members can view team data
- Team admins can manage team data and members
- Task creators and assignees have special permissions

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## 🧪 Running Tests

```bash
npm run test
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Frontend Build Tool
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

