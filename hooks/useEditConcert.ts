import { useMutation } from '@tanstack/react-query'
import { EditConcert, Band } from '../types/types'
import supabase from '../utils/supabase'

const editConcert = async (concertId: string, concert: EditConcert, addBandIds: number[], deleteBands: Band[]) => {
  const { error: editConcertError } = await supabase
    .from('concerts')
    .update(concert)
    .eq('id', concertId)

  if (editConcertError) {
    throw editConcertError
  }

  const { error: addBandsError } = await supabase
    .from('j_concert_bands')
    .insert(addBandIds.map(item => ({ concert_id: concertId, band_id: item })))

  if (addBandsError) {
    throw addBandsError
  }

  const { error: deleteBandsError } = await supabase
    .from('j_concert_bands')
    .delete()
    .eq('concert_id', concertId)
    .in(
      'band_id',
      deleteBands.map(item => item.id)
    )

  if (deleteBandsError) {
    throw deleteBandsError
  }
}

export const useEditConcert = (concertId: string, concert: EditConcert, addBandIds: number[], deleteBands: Band[]) => {
  return useMutation(() => editConcert(concertId, concert, addBandIds, deleteBands))
}
