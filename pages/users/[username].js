import PageWrapper from "../../components/PageWrapper";
import { useState, useEffect } from "react"
import supabase from "../../utils/supabase";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import EditPasswordForm from "../../components/EditPasswordForm";
import EditUsernameForm from "../../components/EditUsernameForm";

export default function Profile({ initProfile, profiles }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(initProfile)
  const [username, setUsername] = useState(initProfile.username)
  const [editPassIsOpen, setEditPassIsOpen] = useState(false)
  const [editUsernameIsOpen, setEditUsernameIsOpen] = useState(false)

  const session = supabase.auth.session()

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      const user = supabase.auth.user()

      if (user) {
        const { data: profile, error: profileError, status } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        if (profile && status !== 406) {
          setProfile(profile)
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <PageWrapper>
      <>
      <main className="p-8">
        {profile ? (
          <div>
            {username && <h1>{username}</h1>}
            <div className="flex gap-3">
              <Button label="Benutzername ändern" onClick={() => setEditUsernameIsOpen(true)} />
              <Button label="Passwort ändern" onClick={() => setEditPassIsOpen(true)} />
            </div>
          </div>
        ) : (
          <div>Bitte melde dich an.</div>
        )}
      </main>
      <Modal isOpen={editUsernameIsOpen} setIsOpen={setEditUsernameIsOpen}>
        <EditUsernameForm
          username={username}
          setUsername={setUsername}
          usernames={profiles.map(item => item.username)}
          setIsOpen={setEditUsernameIsOpen}
        />
      </Modal>
      <Modal isOpen={editPassIsOpen} setIsOpen={setEditPassIsOpen}>
        <EditPasswordForm
          setIsOpen={setEditPassIsOpen}
        />
      </Modal>
      </>
    </PageWrapper>
  )
}

export async function getServerSideProps({params}) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username')

  if (error) {
    console.error(error);
  }

  return {
    props: {
      initProfile: profile,
      profiles
    }
  }
}