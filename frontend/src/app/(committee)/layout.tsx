export default function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-white">
        <nav className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Hội đồng / Phản biện</h2>
          {/* TODO: Navigation links */}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
