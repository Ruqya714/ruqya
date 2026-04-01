import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "مركز الرقية بكلام الرحمن لرد كيد الشيطان",
    template: "%s | مركز الرقية بكلام الرحمن",
  },
  description:
    "مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم في إسطنبول. نقدم استشارات أونلاين، تشخيص روحاني، وعلاج بإشراف خاص.",
  keywords: [
    "رقية شرعية",
    "علاج بالقرآن",
    "رقية",
    "علاج روحاني",
    "اسطنبول",
    "استشارة أونلاين",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "مركز الرقية بكلام الرحمن",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.className}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
