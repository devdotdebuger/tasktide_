import { useSupabase } from '@/contexts/SupabaseContext';

function Profile() {
  const { user } = useSupabase();

  return (
    <div className="text-white p-4">
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default Profile;
