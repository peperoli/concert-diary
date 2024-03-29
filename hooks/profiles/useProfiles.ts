import { useQuery } from '@tanstack/react-query'
import { Profile } from "@/types/types"
import supabase from "@/utils/supabase/client"

const fetchProfiles = async (options?: {ids?: string[]}): Promise<Profile[]> => {
  let query = supabase.from('profiles').select('*')

  if (options?.ids) {
    query = query.in('id', options.ids)
  }
  
  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useProfiles = (options?: {ids?: string[]}) => {
  return useQuery(['profiles', JSON.stringify(options)], () => fetchProfiles(options))
}