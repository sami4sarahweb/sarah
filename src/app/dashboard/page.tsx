import { logout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // user is guaranteed to exist due to middleware
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <form action={logout}>
          <Button variant="outline" type="submit">Sign out</Button>
        </form>
      </header>

      <main>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>You are successfully logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground break-all">
              <strong>User Email:</strong> {user?.email}
            </p>
            <p className="text-sm text-muted-foreground break-all mt-2">
              <strong>User ID:</strong> {user?.id}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
