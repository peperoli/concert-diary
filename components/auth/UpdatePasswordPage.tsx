'use client'

import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PageWrapper } from '../layout/PageWrapper'
import { TextField } from '../forms/TextField'
import { Button } from '../Button'
import { StatusBanner } from '../forms/StatusBanner'
import { AuthError } from '@supabase/supabase-js'
import { errorMessages } from '../../lib/errorMessages'
import { useEditUser } from '../../hooks/useEditUser'
import { useRouter } from 'next/navigation'

export function UpdatePasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ mode: 'onChange' })
  const { mutate, status, error } = useEditUser()
  const { push } = useRouter()

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
    mutate(formData)
  }

  useEffect(() => {
    if (status === 'success') {
      push('/')
    }
  }, [status])
  return (
    <PageWrapper>
      <main className="container-sm">
        <h1>Neues Passwort setzen</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <TextField
            {...register('password', {
              required: true,
              minLength: {
                value: 10,
                message: 'Das Passwort muss mindestens 10 Zeichen enthalten.',
              },
            })}
            error={errors.password}
            type="password"
            label="Passwort"
            autoComplete="off"
          />
          <div className="flex items-center gap-4">
            <Button type="submit" label="Speichern" style="primary" loading={status === 'loading'} />
          </div>
          {status === 'error' && (
            <StatusBanner
              statusType="error"
              message={error instanceof AuthError ? errorMessages[error.message] : undefined}
            />
          )}
          {status === 'success' && (
            <StatusBanner
              statusType="success"
              message="Password erfolgreich zurückgesetzt."
            />
          )}
        </form>
      </main>
    </PageWrapper>
  )
}
