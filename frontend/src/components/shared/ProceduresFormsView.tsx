import { PublicDocumentCatalog, type DocumentCatalogNavigation } from "./PublicDocumentCatalog";

export function ProceduresFormsView(props: DocumentCatalogNavigation) {
  return (
    <PublicDocumentCatalog
      {...props}
      documentType="BIEU_MAU"
      title="Biểu mẫu học vụ"
      description="Tra cứu và tải các biểu mẫu đào tạo sau đại học."
      emptyMessage="Chưa có biểu mẫu học vụ."
    />
  );
}

export default ProceduresFormsView;
