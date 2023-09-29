import { useQuery } from '@tanstack/react-query'
import { Band, FetchOptions, ExtendedRes } from '../types/types'
import { getPagination } from '../lib/getPagination'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const fetchBands = async (options?: FetchOptions): Promise<ExtendedRes<Band[]>> => {
  const supabase = createClientComponentClient()

  let filterQuery = supabase
    .from('bands')
    .select('id, genres(id)', { count: 'estimated' })

  if (options?.filter?.search) {
    filterQuery = supabase.rpc(
      'search_bands',
      { search_string: options.filter.search },
      { count: 'estimated' }
    )
  }
  if (options?.filter?.countries && options.filter.countries.length > 0) {
    filterQuery = filterQuery.in('country_id', options.filter.countries)
  }

  const { data: initialFilteredBands, count: initialCount, error: countError } = await filterQuery

  if (countError) {
    throw countError
  }

  const [from, to] = getPagination(options?.page ?? 0, options?.size ?? 24, initialCount ?? 0)

  let filteredBands = initialFilteredBands

  if (options?.filter?.genres && options.filter.genres.length > 0) {
    filteredBands = filteredBands?.filter(band =>
      band.genres.some(genre => options.filter?.genres?.includes(genre.id))
    )
  }

  let query = supabase
    .from('bands')
    .select('*, country:countries(id, iso2), genres(*)', { count: 'estimated' })
    .in('id', filteredBands?.map(item => item.id) as number[])

  if (options?.page || options?.size) {
    query = query.range(from, to)
  }

  const { data, count, error } = await query.order('name')

  if (error) {
    throw error
  }

  return { data, count }
}

export const useBands = (initialBands?: ExtendedRes<Band[]>, options?: FetchOptions) => {
  return useQuery(['bands', JSON.stringify(options)], () => fetchBands(options), {
    initialData: initialBands,
    keepPreviousData: true,
  })
}
