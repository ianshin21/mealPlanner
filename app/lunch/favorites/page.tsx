import { Suspense } from "react";
import type { Metadata } from "next";
import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = {
  title: "즐겨찾기 — 자동 식단 생성기",
  description: "즐겨찾기한 점심·회식 식당 목록",
};

export default function FavoritesPage() {
  return (
    <Suspense>
      <FavoritesClient />
    </Suspense>
  );
}
