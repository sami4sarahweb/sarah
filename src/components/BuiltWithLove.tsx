"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Copy, Check, ExternalLink, Mail, Phone, MessageCircle } from "lucide-react";

interface BuiltWithLoveProps {
    lang?: "en" | "ar";
}

export const BuiltWithLove = ({ lang = "en" }: BuiltWithLoveProps) => {
    // --- Configuration Variables ---
    const companyDetails = {
        name: {
            en: "Future Vision",
            ar: "فيوتشر فيجن",
        },
        website: "https://futurevisionye.com",
        websiteDisplay: "www.futurevisionye.com",
        email: "info@futurevisionye.com",
        phone: "+967777841140",
        whatsapp: "+967777841140", // Format for API
        whatsappMessage: {
            en: "Hello Future Vision, I would like to inquire about your services.",
            ar: "مرحبا فيوتشر فيجن، أود الاستفسار عن خدماتكم.",
        },
    };

    // Visibility Toggles
    const showConfig = {
        website: true,
        email: true,
        phone: true,
        whatsapp: true,
    };

    // Text Resources (Inline Translations)
    const text = {
        builtWith: { en: "Built with love by", ar: "صنع بكل فخر بواسطة" },
        copySuccess: { en: "Copied!", ar: "تم النسخ!" },
        websiteLabel: { en: "Website", ar: "الموقع" },
        emailLabel: { en: "Email", ar: "البريد" },
        phoneLabel: { en: "Phone", ar: "الهاتف" },
        whatsappLabel: { en: "WhatsApp", ar: "واتساب" },
    };

    // --- State & Refs ---
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const vShapeRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const isOpenRef = useRef(false); // Track open state for click toggling

    const t = (key: keyof typeof text) => text[key][lang];
    const isRtl = lang === "ar";

    // --- Animations ---
    const { contextSafe } = useGSAP({ scope: containerRef });

    const animateOpen = contextSafe(() => {
        if (isOpenRef.current) return;
        isOpenRef.current = true;

        // Reveal Card
        gsap.to(cardRef.current, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
        });

        // Expand V-Shape Background
        gsap.fromTo(vShapeRef.current,
            { clipPath: "polygon(50% 100%, 50% 100%, 50% 100%)" }, // Start closed
            {
                clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)", // Open V
                duration: 0.5,
                ease: "power3.inOut"
            }
        );

        // Fade in Content
        gsap.fromTo(contentRef.current,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.4, delay: 0.2 }
        );
    });

    const animateClose = contextSafe(() => {
        if (!isOpenRef.current) return;
        isOpenRef.current = false;

        // Hide Card
        gsap.to(cardRef.current, {
            autoAlpha: 0,
            y: 20,
            scale: 0.9,
            duration: 0.3,
            ease: "power2.in",
        });
    });

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        // For click events (mobile tap or desktop click), toggle state
        if (e.type === 'click') {
            if (isOpenRef.current) animateClose();
            else animateOpen();
        }
    };

    // --- Helpers ---
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const getWhatsappLink = () => {
        const msg = encodeURIComponent(companyDetails.whatsappMessage[lang]);
        return `https://wa.me/${companyDetails.whatsapp}?text=${msg}`;
    };

    return (
        <div
            ref={containerRef}
            className="relative inline-flex items-center gap-2 font-sans"
            onMouseEnter={animateOpen}
            onMouseLeave={animateClose}
        >
            {/* Trigger Text */}
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-[#64C1CA] transition-colors duration-300">
                {t("builtWith")}
            </span>

            {/* Logo Trigger */}
            <div
                className="relative group cursor-pointer z-20"
                onClick={handleInteraction}
            >
                {/* Glow Effect - behind the logo directly */}
                <div className="absolute inset-0 bg-[#64C1CA] rounded-full opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300" />

                <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                    <img src="/dev_logo.svg" alt="Future Vision Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            {/* --- V-Card Expansion --- */}
            <div
                ref={cardRef}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[280px] invisible opacity-0 z-50 perspective-1000"
            >
                <div className="relative bg-white dark:bg-[#0f1214] rounded-2xl shadow-2xl shadow-[#64C1CA]/20 border border-[#64C1CA]/20 overflow-hidden">

                    {/* V-Shape Decorative Header Background */}
                    <div
                        ref={vShapeRef}
                        className="absolute top-0 left-0 w-full h-[180px] bg-gradient-to-b from-[#64C1CA] to-[#245D5D] opacity-10 pointer-events-none"
                    />

                    <div className="relative p-5" ref={contentRef}>
                        {/* Header */}
                        <div className="flex flex-col items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
                            <div className="w-12 h-12 mb-2">
                                <img src="/dev_logo.svg" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {companyDetails.name[lang]}
                            </h3>
                        </div>

                        {/* Details List */}
                        <div className="space-y-3">

                            {/* Website */}
                            {showConfig.website && (
                                <a
                                    href={`${companyDetails.website}/${lang}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-[#64C1CA]/10 border border-transparent hover:border-[#64C1CA]/30 transition-all group/item"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-1.5 rounded-md bg-[#64C1CA]/10 text-[#64C1CA]">
                                            <ExternalLink size={14} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{t("websiteLabel")}</span>
                                            <span className={`text-xs font-medium text-gray-700 dark:text-gray-300 truncate ${isRtl ? "text-right" : "text-left"}`}>
                                                {companyDetails.websiteDisplay}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            )}

                            {/* Email */}
                            {showConfig.email && (
                                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-[#64C1CA]/10 border border-transparent hover:border-[#64C1CA]/30 transition-all group/item">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-1.5 rounded-md bg-[#64C1CA]/10 text-[#64C1CA]">
                                            <Mail size={14} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{t("emailLabel")}</span>
                                            {/* Mailto Link */}
                                            <a
                                                href={`mailto:${companyDetails.email}`}
                                                className={`text-xs font-medium text-gray-700 dark:text-gray-300 truncate select-all hover:text-[#64C1CA] transition-colors ${isRtl ? "text-right" : "text-left"}`}
                                            >
                                                {companyDetails.email}
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(companyDetails.email, "email")}
                                        className="p-1.5 text-gray-400 hover:text-[#64C1CA] transition-colors"
                                        title={t("copySuccess")}
                                    >
                                        {copiedField === "email" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            )}

                            {/* Phone */}
                            {showConfig.phone && (
                                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-[#64C1CA]/10 border border-transparent hover:border-[#64C1CA]/30 transition-all group/item">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-1.5 rounded-md bg-[#64C1CA]/10 text-[#64C1CA]">
                                            <Phone size={14} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{t("phoneLabel")}</span>
                                            <a href={`tel:${companyDetails.phone}`} className={`text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#64C1CA] truncate ${isRtl ? "text-right" : "text-left"}`}>
                                                {companyDetails.phone}
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(companyDetails.phone, "phone")}
                                        className="p-1.5 text-gray-400 hover:text-[#64C1CA] transition-colors"
                                        title={t("copySuccess")}
                                    >
                                        {copiedField === "phone" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            )}

                            {/* WhatsApp Button */}
                            {showConfig.whatsapp && (
                                <a
                                    href={getWhatsappLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#64C1CA] to-[#245D5D] hover:shadow-lg hover:shadow-[#64C1CA]/30 text-white text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <MessageCircle size={16} />
                                    <span>{t("whatsappLabel")}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
