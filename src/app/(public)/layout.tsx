import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { getPublicSiteData } from "@/lib/queries/public-data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getPublicSiteData();

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader siteData={siteData} />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter siteData={siteData} />
      <CookieConsent />
    </div>
  );
}
