import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '../../../utils/supabase/server'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()

  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (!token_hash || !type) {
    console.error('Error: Missing token_hash or type')
    return NextResponse.redirect('/signup')
  }

  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    console.error(error.message)
    return NextResponse.redirect('/signup')
  }
  
  redirectTo.searchParams.delete('next')
  return NextResponse.redirect(redirectTo)
}
