import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/data";

export default async function ProductLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  return children;
}
