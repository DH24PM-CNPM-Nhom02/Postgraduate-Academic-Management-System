export default async function VotingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Bỏ phiếu luận án (Mã: {id})</h1>
      {/* TODO: VotingPanel, ConfirmDialog */}
      {/* UC-PHD-10 */}
    </div>
  );
}
