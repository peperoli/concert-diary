import { useMutation } from '@tanstack/react-query'
import supabase from '../utils/supabase'

const editUser = async (newUser: { email?: string; password?: string }) => {
  const { error } = await supabase.auth.updateUser({
    email: newUser.email,
    password: newUser.password,
  })

  if (error) {
    throw error
  }
}

export const useEditUser = () => {
  return useMutation(editUser, { onError: error => console.log(error) })
}
