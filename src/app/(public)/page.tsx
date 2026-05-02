import { getHomePageData } from "@/lib/queries/home-data";
import { HomeClient } from "./home-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مؤسسة سارة السهلي | تأجير لوازم المناسبات والحفلات بالرياض",
  description: "الوجهة الأولى لتأجير أفخم التجهيزات الحدثية في الرياض. خيام أوروبية، كنب VIP، جلسات خارجية، كوش أفراح، إضاءة، وأكثر من 16 خدمة متخصصة.",
  openGraph: {
    title: "مؤسسة سارة السهلي | تأجير لوازم المناسبات والحفلات بالرياض",
    description: "الوجهة الأولى لتأجير أفخم التجهيزات الحدثية في الرياض.",
    type: "website",
    locale: "ar_SA",
  },
};

export default async function PublicHomePage() {
  const data = await getHomePageData();

  return <HomeClient data={data} />;
}
