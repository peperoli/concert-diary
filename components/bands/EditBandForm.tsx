import { Dispatch, SetStateAction, useEffect } from 'react'
import Modal from '../Modal'
import { Band, EditBand } from '../../types/types'
import { useEditBand } from '../../hooks/bands/useEditBand'
import { useQueryClient } from '@tanstack/react-query'
import { Form } from './Form'
import { SubmitHandler } from 'react-hook-form'

interface EditBandFormProps {
  band: Band
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const EditBandForm = ({ band, isOpen, setIsOpen }: EditBandFormProps) => {
  const { mutate, status,  } = useEditBand()
  const queryClient = useQueryClient()  

  const onSubmit: SubmitHandler<EditBand> = async function (formData) {
    mutate(formData)
  }

  const close = () => setIsOpen(false)

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries(['band', band.id])
      close()
    }
  }, [status])
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Band bearbeiten</h2>
      <Form
        defaultValues={band}
        onSubmit={onSubmit}
        status={status}
        close={close}
      />
    </Modal>
  )
}
