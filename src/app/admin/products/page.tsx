import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ProductManager from "./ProductManager";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <ProductManager
      user={session.user}
      categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      products={products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price ? Number(product.price) : null,
        dimensions: product.dimensions,
        material: product.material,
        images: product.images,
        categoryId: product.categoryId,
        categoryName: product.category.name,
        updatedAt: product.updatedAt.toISOString(),
      }))}
    />
  );
}
