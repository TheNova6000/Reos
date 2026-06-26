import { ReosHeader } from "@/components/reos/reos-header";
import { ReosFooter } from "@/components/reos/reos-footer";

export default function ReosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ReosHeader />
      <main className="flex-1">{children}</main>
      <ReosFooter />
    </div>
  );
}
