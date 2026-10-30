export default async function ReviewFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Phiếu đánh giá &amp; chấm điểm (Mã: {id})</h1>
      {/* TODO: CommitteeReviewForm, PdfViewer, VotingPanel */}
      {/* UC-PHD-04,10 */}
    </div>
  );
}
