import { Header } from "./_components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main
        className="h-full w-full relative border border-transparent"
        id="content"
      >
        <div className="fr-container mx-auto my-10">{children}</div>
      </main>
    </>
  );
}
