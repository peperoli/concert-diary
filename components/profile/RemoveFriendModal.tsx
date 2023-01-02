import supabase from '../../utils/supabase'
import { Button } from '../Button'
import Modal from '../Modal'
import React, { FC, useEffect, useState } from 'react'
import { Profile } from '../../models/types'

interface IRemoveFriendModal {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  friend: Profile
  setFriend: React.Dispatch<React.SetStateAction<Profile | null>>
}

export const RemoveFriendModal: FC<IRemoveFriendModal> = ({ isOpen, setIsOpen, friend, setFriend }) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: userData },
      } = await supabase.auth.getUser()
      if (userData) {
        setUser(userData)
      }
    }

    getUser()
  }, [])
  
  async function removeFriend() {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`sender_id.eq.${user.id}, receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${friend.id}, receiver_id.eq.${friend.id}`)

      if (error) {
        throw error
      }
      
      setFriend(null)
      setIsOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log('Unexpected error', error)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Freund entfernen</h2>
      <p>
        Willst du <span className="italic">{friend.username}</span> als Freund entfernen?
      </p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button label="Entfernen" onClick={removeFriend} style="primary" loading={loading} danger />
      </div>
    </Modal>
  )
}
