import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <Header />
      <main className="flex-1 min-h-[70vh] flex flex-col">{children}</main>
      <Footer />
    </ToastProvider>
  );
}
