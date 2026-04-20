import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex w-full flex-col p-4 md:p-8">
        <div className="mb-6 flex items-center gap-4">
          <SidebarTrigger />
        </div>
        <div className="flex-1 w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
