export default async function AcademicStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Hồ sơ NCS đầy đủ (Mã: {id})</h1>
      {/* TODO: StudentProfile, MilestoneTimeline, PublicationList */}
    </div>
  );
}
