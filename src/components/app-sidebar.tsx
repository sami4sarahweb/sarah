"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User2, LogOut, Briefcase, Image as ImageIcon, Contact, FileText, Star, FolderOpen, ClipboardList } from "lucide-react";
import { logout } from "@/app/auth/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items
const navItems = [
  { title: "الخدمات", url: "/dashboard/services", icon: Briefcase },
  { title: "المعرض", url: "/dashboard/gallery", icon: ImageIcon },
  { title: "المشاريع", url: "/dashboard/projects", icon: FolderOpen },
  { title: "طلبات العروض", url: "/dashboard/quotes", icon: ClipboardList },
  { title: "شهادات العملاء", url: "/dashboard/testimonials", icon: Star },
  { title: "المدونة", url: "/dashboard/blog", icon: FileText },
  { title: "بيانات التواصل", url: "/dashboard/contact", icon: Contact },
];

export function AppSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <Sidebar side="right">
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold text-primary">لوحة التحكم</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>إدارة المحتوى</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    render={
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <User2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="truncate text-sm font-medium">{user?.email?.split('@')[0] || "المسؤول"}</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
        <form action={logout}>
          <button 
            type="submit" 
            className="flex w-full items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
