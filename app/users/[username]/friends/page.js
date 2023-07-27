import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { FriendsPage } from '../../../../components/profile/FriendsPage'
import { cookies } from 'next/headers'

async function fetchData(username) {
  const supabase = createServerComponentClient({ cookies })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  const { data: friends, error } = await supabase
    .from('friends')
    .select('*, sender:sender_id(*), receiver:receiver_id(*)')
    .or(`sender_id.eq.${profile.id}, receiver_id.eq.${profile.id}`)

  if (error) {
    console.error(error)
  }

  return { profile, friends }
}

export default async function Page({ params }) {
  const { profile, friends } = await fetchData(params.username)
  return <FriendsPage profile={profile} friends={friends || []} />
}
