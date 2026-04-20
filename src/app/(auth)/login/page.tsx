import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Alert, AlertDescription } from '@/components/ui/alert'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form action={login}>
          <CardHeader>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>
              أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {params.error && (
              <Alert variant="destructive">
                <AlertDescription>{params.error}</AlertDescription>
              </Alert>
            )}
            {params.message && (
              <Alert>
                <AlertDescription>{params.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required dir="ltr" className="text-left" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" name="password" type="password" required dir="ltr" className="text-left" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit">تسجيل الدخول</Button>
            <div className="text-sm text-center text-muted-foreground w-full">
              ليس لديك حساب؟{' '}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                إنشاء حساب
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
