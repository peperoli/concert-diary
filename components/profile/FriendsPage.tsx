'use client'

import { Friend, Profile } from '../../types/types'
import { PageWrapper } from '../layout/PageWrapper'
import { FriendInvites } from './FriendInvites'
import { FriendItem } from './FriendItem'
import { useUser } from '../../hooks/useUser'
import { useFriends } from '../../hooks/useFriends'

export interface FriendsPageProps {
  profile: Profile
  initialFriends: Friend[]
}

export const FriendsPage = ({ profile, initialFriends }: FriendsPageProps) => {
  const { data: user } = useUser()
  const { data: friends } = useFriends(profile.id, initialFriends)
  const acceptedFriends = friends?.filter(item => !item.pending)
  return (
    <PageWrapper>
      <main className="p-4 md:p-8 w-full max-w-2xl">
        <h1>{profile.username}&apos;s Freunde</h1>
        <div className="grid grid-cols-2 gap-4">
          {friends && <FriendInvites profile={profile} friends={friends} />}
          {acceptedFriends && acceptedFriends.length > 0 ? (
            acceptedFriends.map(item => (
              <FriendItem
                key={item.sender.id + item.receiver.id}
                friendData={item.sender.id === profile.id ? item.receiver : item.sender}
                profile={profile}
              />
            ))
          ) : (
            <p className="col-span-full text-slate-300">
              {user?.id === profile.id ? 'Du hast' : `${profile.username} hat`} noch keine
              Konzertfreunde :/
            </p>
          )}
        </div>
      </main>
    </PageWrapper>
  )
}
