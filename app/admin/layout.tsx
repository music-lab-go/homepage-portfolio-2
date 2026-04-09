// Admin pages have their own nav (AdminNav), so no public Navigation here
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
