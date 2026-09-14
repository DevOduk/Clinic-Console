import CategoryPageView from "@/app/components/Pages/CategoryPageView";
import SimpleBreadCrumb from "@/app/components/SimpleBreadCrumb";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    Category: string;
  }>;
}): Promise<Metadata> {
  const { Category } = await params;

  const category = Category.replaceAll("-", " ").replace(/\b\w/g, (char) =>
    char.toUpperCase(),
  );

  return {
    title: `${category ? category + " - " : ""}Categories | Clinic - Inventory Management Solution`,
    description:
      "Manage your clinic stock inventory with ease. Update prices and stock count with one click!",
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{
    Category: string;
  }>;
}) {
  const { Category } = await params;

  const category = Category.replaceAll("-", " ").replace(/\b\w/g, (char) =>
    char.toUpperCase(),
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14">
      <header className="mb-8 flex items-end flex-col md:flex-row gap-3 justify-between">
        <div className="w-full">
          <SimpleBreadCrumb
            items={[{ label: "Categories", url: "/categories" }]}
            title={Category}
          />
          <h1 className="mb-2.5 font-serif text-[clamp(32px,3.2vw,46px)] font-normal leading-[1.05] tracking-[-0.035em] text-[#20302d]">
            {category}
          </h1>
          <p className="m-0 text-sm text-(--muted)">
            Manage the supplies and equipment your clinic relies on.
          </p>
        </div>
      </header>

      <CategoryPageView category={Category} />
    </div>
  );
}
