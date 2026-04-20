import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Alert, AlertDescription } from '@/components/ui/alert'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form action={signup}>
          <CardHeader>
            <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
            <CardDescription>
              قم بإنشاء حساب للبدء.
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
            <Button className="w-full" type="submit">إنشاء حساب</Button>
            <div className="text-sm text-center text-muted-foreground w-full">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
