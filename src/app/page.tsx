import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <h1 className="text-5xl font-bold tracking-tight mb-4 text-foreground">Welcome to Our App</h1>
      <p className="text-lg text-muted-foreground max-w-xl mb-8">
        This is a public landing page. Authentication is required to access the dashboard.
      </p>
      
      <div className="flex gap-4">
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
          Go to Dashboard
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          Login
        </Link>
      </div>
    </div>
  )
}
