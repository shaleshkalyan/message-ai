import Footer from "@/components/custom/footer";
import Navbar from "@/components/custom/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
