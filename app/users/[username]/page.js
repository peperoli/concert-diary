import ProfilePage from '../../../components/profile/ProfilePage'
import supabase from '../../../utils/supabase'

async function fetchData(params) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  const { data: bandsSeen } = await supabase
    .from('j_bands_seen')
    .select('*, concert:concerts(is_festival), band:bands(*, genres(*))')
    .eq('user_id', profile.id)

  return { profile, bandsSeen }
}

export default async function Page({ params }) {
  const { profile, bandsSeen } = await fetchData(params)
  return <ProfilePage profile={profile} bandsSeen={bandsSeen} />
}
