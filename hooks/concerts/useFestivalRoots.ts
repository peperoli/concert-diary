import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase'

async function fetchLocations(): Promise<Tables<'festival_roots'>[]> {
  const { data, error } = await supabase
    .from('festival_roots')
    .select('*')

  if (error) {
    throw error
  }

  return data
}

export const useFestivalRoots = (enabled?: boolean) => {
  return useQuery(['festivalRoots'], () => fetchLocations(), {
    enabled: enabled === undefined ? true : enabled,
  })
}
