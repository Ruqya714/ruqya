import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';

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

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'tr' ? 'ltr' : 'rtl'} className={ibmPlexArabic.className}>
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-bg">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
