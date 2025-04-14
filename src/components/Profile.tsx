// src/components/Profile.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

function Profile() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const session = supabase.auth.getSession()
    session.then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  return (
    <div className="text-white p-4">
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  )
}

export default Profile
