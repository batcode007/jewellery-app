import { Suspense } from "react";
import CatalogueContent from "./CatalogueContent";

export const dynamic = "force-dynamic";

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
