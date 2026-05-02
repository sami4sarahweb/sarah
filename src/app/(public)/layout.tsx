import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { getPublicSiteData } from "@/lib/queries/public-data";
import { GsapProvider } from "@/components/animations/gsap-provider";
import { PageTransition } from "@/components/animations/page-transition";
import "@/lib/fontawesome"; 

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getPublicSiteData();

  return (
    <div className="flex flex-col min-h-screen">
      <GsapProvider>
        <PublicHeader siteData={siteData} />
        <main className="flex-1">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <PublicFooter siteData={siteData} />
        <CookieConsent />
      </GsapProvider>
    </div>
  );
}
