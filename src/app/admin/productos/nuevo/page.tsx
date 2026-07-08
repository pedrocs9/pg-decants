import { getFormOptions } from '../actions';
import { ProductForm } from '../ProductForm';

export default async function NewProductPage() {
  const { brandOptions, familyOptions, noteOptions, seasonOptions } = await getFormOptions();

  return (
    <div>
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Nuevo Producto</h1>
      <ProductForm
        initialData={null}
        brandOptions={brandOptions}
        familyOptions={familyOptions}
        noteOptions={noteOptions}
        seasonOptions={seasonOptions}
      />
    </div>
  );
}