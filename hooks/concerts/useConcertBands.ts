import { useQuery } from '@tanstack/react-query'
import { Concert } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchConcertBands = async (): Promise<
  Partial<Concert & { bands_count: { count: number } | { count: number }[] | null }>[]
> => {
  const { data, error } = await supabase
    .from('concerts')
    .select('id, bands_count:j_concert_bands(count)')
    
    if (error) {
      throw error
    }
    
  // @ts-expect-error
  return data
}

export const useConcertBands = () => {
  return useQuery(['concertYears'], () => fetchConcertBands())
}
