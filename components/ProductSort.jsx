
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changeSort = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    router.replace(`/products?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <select
      className="filter-select"
      value={searchParams.get("sort") ?? ""}
      onChange={(e) => changeSort(e.target.value)}
    >
      <option value="">Δημοφιλή</option>
      <option value="asc">Τιμή: Αύξουσα</option>
      <option value="desc">Τιμή: Φθίνουσα</option>
    </select>
  );
}
