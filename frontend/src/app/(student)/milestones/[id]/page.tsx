export default async function MilestoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Chi tiết mốc đào tạo (Mã: {id})</h1>
      {/* TODO: PdfUploader, UploadProgress, MilestoneStatusPanel */}
      {/* UC-PHD-02: Nộp minh chứng mốc */}
    </div>
  );
}
