"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Phone, MessageCircle, Mail, FileText, Share2, Plus } from "lucide-react";

type ContactMethod = Database['public']['Tables']['contact_methods']['Row'];
type PlatformType = 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter';

export default function ContactDashboard() {
  const [contacts, setContacts] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_methods")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("contact_methods").delete().eq("id", id);
    fetchContacts();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">بيانات التواصل</h1>
          <p className="text-muted-foreground mt-2">إدارة أرقام الهواتف، البريد الإلكتروني، وحسابات التواصل الاجتماعي.</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">بيانات التواصل</h1>
        <p className="text-muted-foreground mt-2">إدارة أرقام الهواتف، البريد الإلكتروني، وحسابات التواصل الاجتماعي.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactSection
          title="أرقام الواتساب"
          description="أضف أرقام الواتساب للتواصل المباشر."
          icon={<MessageCircle className="h-5 w-5 text-green-500" />}
          type="whatsapp"
          contacts={contacts.filter((c) => c.type === "whatsapp")}
          onDelete={handleDelete}
          onRefresh={fetchContacts}
        />

        <ContactSection
          title="أرقام الاتصال"
          description="أضف أرقام الهواتف الأرضية والمحمولة."
          icon={<Phone className="h-5 w-5 text-blue-500" />}
          type="call"
          contacts={contacts.filter((c) => c.type === "call")}
          onDelete={handleDelete}
          onRefresh={fetchContacts}
        />

        <ContactSection
          title="البريد الإلكتروني"
          description="عناوين البريد الإلكتروني الرسمية."
          icon={<Mail className="h-5 w-5 text-rose-500" />}
          type="mail"
          contacts={contacts.filter((c) => c.type === "mail")}
          onDelete={handleDelete}
          onRefresh={fetchContacts}
        />

        <ContactSection
          title="الملف التعريفي (PDF)"
          description="روابط تحميل أو عرض الملف التعريفي."
          icon={<FileText className="h-5 w-5 text-purple-500" />}
          type="pdf"
          contacts={contacts.filter((c) => c.type === "pdf")}
          onDelete={handleDelete}
          onRefresh={fetchContacts}
        />

        <SocialSection
          contacts={contacts.filter((c) => c.type === "social")}
          onDelete={handleDelete}
          onRefresh={fetchContacts}
        />
      </div>
    </div>
  );
}

function ContactSection({
  title,
  description,
  icon,
  type,
  contacts,
  onDelete,
  onRefresh,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: string;
  contacts: ContactMethod[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [value, setValue] = useState("");
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    setSubmitting(true);
    await supabase.from("contact_methods").insert({ type, value });
    setValue("");
    setSubmitting(false);
    onRefresh();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`إضافة ${title}...`}
            disabled={submitting}
            className="flex-1"
          />
          <Button type="submit" disabled={submitting || !value}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-col gap-2 mt-4">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">لا توجد بيانات مضافة بعد.</p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high/50 border border-border/10"
              >
                <span className="text-sm text-foreground truncate" dir="ltr">{contact.value}</span>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => onDelete(contact.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SocialSection({
  contacts,
  onDelete,
  onRefresh,
}: {
  contacts: ContactMethod[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [value, setValue] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("instagram");
  const [followerCount, setFollowerCount] = useState<string>("");
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    setSubmitting(true);
    await supabase.from("contact_methods").insert({
      type: "social",
      platform,
      value,
      follower_count: followerCount ? parseInt(followerCount) : null,
    });
    setValue("");
    setFollowerCount("");
    setSubmitting(false);
    onRefresh();
  };

  const platforms = [
    { id: "instagram", name: "إنستجرام" },
    { id: "tiktok", name: "تيك توك" },
    { id: "youtube", name: "يوتيوب" },
    { id: "facebook", name: "فيسبوك" },
    { id: "twitter", name: "إكس (تويتر)" },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-orange-500" />
          <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
        </div>
        <CardDescription>إدارة الروابط وأعداد المتابعين (تُدخل يدوياً).</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as PlatformType)}
            className="h-10 rounded-md border-b-2 border-border bg-surface-container-high px-3 text-sm outline-none focus-visible:border-primary w-full md:w-auto"
          >
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="الرابط (URL)"
            disabled={submitting}
            className="flex-1"
          />
          <Input
            type="number"
            value={followerCount}
            onChange={(e) => setFollowerCount(e.target.value)}
            placeholder="عدد المتابعين"
            disabled={submitting}
            className="flex-1 md:w-32"
          />
          <Button type="submit" disabled={submitting || !value}>
            <Plus className="h-4 w-4 ml-1" /> إضافة
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 col-span-full">لا توجد حسابات مضافة بعد.</p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col p-3 rounded-lg bg-surface-container-high/50 border border-border/10 justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase text-primary tracking-wider">{contact.platform}</span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onDelete(contact.id)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-sm text-foreground truncate" dir="ltr">{contact.value}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    المتابعون: <strong className="text-foreground">{contact.follower_count?.toLocaleString() || "غير محدد"}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
