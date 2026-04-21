import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { CookieConsent } from "@/components/layout/cookie-consent";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <CookieConsent />
    </div>
  );
}
