import { logout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // user is guaranteed to exist due to middleware
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">نظرة عامة</h1>
        <p className="text-muted-foreground mt-2">مرحباً بك في لوحة التحكم الإدارية.</p>
      </header>

      <main>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>مرحباً بعودتك!</CardTitle>
            <CardDescription>لقد تم تسجيل الدخول بنجاح.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground break-all">
              <strong>البريد الإلكتروني:</strong> {user?.email}
            </p>
            <p className="text-sm text-muted-foreground break-all mt-2">
              <strong>معرف المستخدم:</strong> {user?.id}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
