import { Suspense } from "react";
import SearchContent from "./SearchContent";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-text-muted">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
