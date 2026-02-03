import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col min-h-screen md:border-x md:border-zinc-900/50 bg-zinc-950 md:shadow-2xl md:shadow-black relative">
      <Navbar />
      <main className="flex-1 w-full bg-zinc-950/30">
        {children}
      </main>
    </div>
  );
}
