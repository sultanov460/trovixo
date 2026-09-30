import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/data";
import { CollectionView } from "@/components/collection/CollectionView";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description || `Shop ${collection.title} at Trovixo.`,
    alternates: { canonical: `/collections/${collection.handle}` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) notFound();

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl">{collection.title}</h1>
      {collection.description && <p className="mt-2 max-w-2xl text-sm text-ink-soft">{collection.description}</p>}
      <CollectionView products={collection.products} />
    </div>
  );
}
