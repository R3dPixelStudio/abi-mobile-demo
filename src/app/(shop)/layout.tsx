import { Header, Footer, MobileDock } from "@/components/shell";
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileDock />
    </>
  );
}
