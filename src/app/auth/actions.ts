'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { sanitizeRedirectUrl } from '@/lib/auth/redirect'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const returnUrlRaw = formData.get('returnUrl') as string | null
  const returnUrl = sanitizeRedirectUrl(returnUrlRaw, '/dashboard')
  const returnUrlParam = returnUrlRaw ? `&returnUrl=${encodeURIComponent(returnUrlRaw)}` : ''

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent('البريد الإلكتروني وكلمة المرور مطلوبان')}${returnUrlParam}`)
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent('بيانات الدخول غير صحيحة')}${returnUrlParam}`)
  }

  revalidatePath('/dashboard', 'layout')
  redirect(returnUrl)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const returnUrlRaw = formData.get('returnUrl') as string | null
  const returnUrlParam = returnUrlRaw ? `&returnUrl=${encodeURIComponent(returnUrlRaw)}` : ''

  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent('البريد الإلكتروني وكلمة المرور مطلوبان')}${returnUrlParam}`)
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const callbackNext = returnUrlRaw ? `?next=${encodeURIComponent(returnUrlRaw)}` : ''

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback${callbackNext}`,
    },
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}${returnUrlParam}`)
  }

  redirect(`/signup?message=${encodeURIComponent('يرجى التحقق من بريدك الإلكتروني لإكمال عملية التسجيل')}${returnUrlParam}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
