import { notFound } from 'next/navigation';
import { getProductForEdit, getFormOptions } from '../actions';
import { ProductForm } from '../ProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductForEdit(Number(id));

  if (!product) {
    notFound();
  }

  const { brandOptions, familyOptions, noteOptions, seasonOptions } = await getFormOptions();

  return (
    <div>
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Editar Producto</h1>
      <ProductForm
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          brandId: product.brandId,
          gender: product.gender,
          concentration: product.concentration,
          perfumeType: product.perfumeType,
          dupeOf: product.dupeOf ?? '',
          description: product.description ?? '',
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          images: product.images.map((img) => ({ imageUrl: img.imageUrl, isMain: img.isMain })),
          variants: product.variants.map((v) => ({
            sizeMl: v.sizeMl,
            price: v.price,
            stock: v.stock,
            availability: v.availability,
            sku: v.sku,
          })),
          familyIds: product.familyIds,
          noteIds: product.noteIds,
          seasonIds: product.seasonIds,
        }}
        brandOptions={brandOptions}
        familyOptions={familyOptions}
        noteOptions={noteOptions}
        seasonOptions={seasonOptions}
      />
    </div>
  );
}