import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <h1 className="text-5xl font-bold tracking-tight mb-4 text-foreground">مرحباً بك في تطبيقنا</h1>
      <p className="text-lg text-muted-foreground max-w-xl mb-8">
        هذه صفحة عامة. يجب تسجيل الدخول للوصول إلى لوحة التحكم.
      </p>
      
      <div className="flex gap-4">
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
          الانتقال إلى لوحة التحكم
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          تسجيل الدخول
        </Link>
      </div>
    </div>
  )
}
