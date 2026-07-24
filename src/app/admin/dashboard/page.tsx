import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminDashboardClient from "./DashboardClient";
import prisma from "@/lib/prisma";

async function getDashboardData() {
  try {
    const [productCount, enquiryCount, categoryCount, recentEnquiries, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.enquiry.count(),
      prisma.category.count(),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

    const pendingEnquiries = await prisma.enquiry.count({
      where: { status: "PENDING" },
    });

    return {
      productCount,
      enquiryCount,
      categoryCount,
      pendingEnquiries,
      recentEnquiries: recentEnquiries.map(e => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
      recentProducts: recentProducts.map(p => ({
        ...p,
        price: Number(p.price) || 0,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
          ...p.category,
          createdAt: p.category.createdAt.toISOString(),
        } : null,
      })),
    };
  } catch {
    return {
      productCount: 0,
      enquiryCount: 0,
      categoryCount: 0,
      pendingEnquiries: 0,
      recentEnquiries: [],
      recentProducts: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const data = await getDashboardData();

  return <AdminDashboardClient data={data} user={session.user} />;
}
