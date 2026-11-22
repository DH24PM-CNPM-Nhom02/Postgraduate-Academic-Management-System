import { PublicDocumentCatalog, type DocumentCatalogNavigation } from "./PublicDocumentCatalog";

export function RegulationsView(props: DocumentCatalogNavigation) {
  return (
    <PublicDocumentCatalog
      {...props}
      documentType="QUY_DINH"
      title="Quy định & Quy chế"
      description="Tra cứu văn bản quy định và quy chế đào tạo sau đại học."
      emptyMessage="Chưa có văn bản quy định hoặc quy chế."
    />
  );
}

export default RegulationsView;
