export default async function MilestoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Chi tiết mốc đào tạo (Mã: {id})</h1>
      <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">Chưa có dữ liệu chi tiết của mốc đào tạo.</p>
    </div>
  );
}
