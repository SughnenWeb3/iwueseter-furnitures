import { PrismaClient } from "../src/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env file manually if not loaded
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#\s=]+)\s*=\s*(.*)$/);
    if (match) {
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[match[1]]) {
        process.env[match[1]] = value;
      }
    }
  }
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@iwueseter.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: "Admin Terhemba",
      passwordHash: hashedPassword,
    },
  });
  console.log("Seeded admin:", admin.email);

  // 2. Seed Categories
  const categoriesData = [
    { name: "Living Room", slug: "living-room" },
    { name: "Bedroom", slug: "bedroom" },
    { name: "Dining Room", slug: "dining-room" },
    { name: "Office", slug: "office" },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
    console.log(`Seeded category: ${category.name}`);
  }

  // 3. Seed Products (15 detailed carpentry products)
  const productsData = [
    // --- LIVING ROOM ---
    {
      title: "Royal Chesterfield Sofa",
      description: "Luxurious 3-seater Chesterfield sofa in premium velvet upholstery with tufted details and sturdy mahogany legs.",
      price: 450000.00,
      dimensions: "220cm x 95cm x 80cm",
      material: "Velvet and Mahogany Wood",
      categorySlug: "living-room",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Monarch Armchair",
      description: "A commanding accent chair featuring hand-carved mahogany scrollwork on the armrests and plush premium linen cushioning.",
      price: 195000.00,
      dimensions: "85cm x 90cm x 105cm",
      material: "Solid Mahogany and Linen",
      categorySlug: "living-room",
      images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Teak Nesting Coffee Tables",
      description: "Trio of nesting coffee tables crafted from premium teak with distinct matching grain patterns. Interlocks seamlessly.",
      price: 135000.00,
      dimensions: "90cm x 90cm x 45cm",
      material: "Premium Teak Wood",
      categorySlug: "living-room",
      images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Floating Iroko Media Console",
      description: "Minimalist wall-mounted media unit featuring custom cable management slits and soft-close drop-down cabinets.",
      price: 240000.00,
      dimensions: "180cm x 40cm x 35cm",
      material: "Nigerian Iroko Wood",
      categorySlug: "living-room",
      images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"],
    },

    // --- BEDROOM ---
    {
      title: "Emperor Solid Oak Bed Frame",
      description: "Sturdy king-size bed frame crafted from solid oak with a high headboard and warm natural lacquer finish.",
      price: 600000.00,
      dimensions: "210cm x 190cm x 110cm",
      material: "Solid Oak Wood",
      categorySlug: "bedroom",
      images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Bespoke Walnut Wardrobe",
      description: "Generous 4-door wardrobe featuring custom floor-to-ceiling brass handles, soft-close hinges, and modular internal cedar drawers.",
      price: 780000.00,
      dimensions: "240cm x 60cm x 220cm",
      material: "Solid Walnut and Cedar",
      categorySlug: "bedroom",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Tall Standing Mirror Frame",
      description: "Magnificent full-length dressing mirror framed in thick hand-polished mahogany detailing. Stands securely on a solid rear easel.",
      price: 110000.00,
      dimensions: "70cm x 5cm x 190cm",
      material: "Mahogany Wood and Premium Glass",
      categorySlug: "bedroom",
      images: ["/images/standing-mirror.jpg"],
    },
    {
      title: "Symmetry Nightstands Pair",
      description: "Matching pair of bedside nightstands featuring clean mitered edges and a single felt-lined jewelry drawer on brass slides.",
      price: 125000.00,
      dimensions: "50cm x 40cm x 60cm",
      material: "Solid Teak Wood",
      categorySlug: "bedroom",
      images: ["https://images.unsplash.com/photo-1532372320978-9b4d7a92b24d?auto=format&fit=crop&q=80&w=800"],
    },

    // --- DINING ROOM ---
    {
      title: "6-Seater Mahogany Dining Table",
      description: "Elegant dining table crafted from rich mahogany, featuring a smooth polished surface and modern tapered legs. Chairs sold separately.",
      price: 350000.00,
      dimensions: "180cm x 90cm x 75cm",
      material: "Mahogany Wood",
      categorySlug: "dining-room",
      images: ["https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Heritage Dining Chair",
      description: "Comfortable high-back dining chair featuring custom mortise and tenon joinery and durable woven fabric seat lining.",
      price: 650000.00,
      dimensions: "45cm x 50cm x 100cm",
      material: "Teak Wood and Fabric",
      categorySlug: "dining-room",
      images: ["https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Artisanal Credenza Sideboard",
      description: "Spacious dining room credenza featuring detailed sliding louvers and interior shelving designed for dinnerware.",
      price: 380000.00,
      dimensions: "160cm x 45cm x 85cm",
      material: "Iroko and Brass Details",
      categorySlug: "dining-room",
      images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Industrial Live-Edge Dining Table",
      description: "Showstopping dining table featuring a raw live-edge slab of African Teak on powder-coated steel legs. Seats 8 comfortable.",
      price: 590000.00,
      dimensions: "220cm x 100cm x 75cm",
      material: "Live-Edge Teak and Steel",
      categorySlug: "dining-room",
      images: ["https://images.unsplash.com/photo-1544207240-8b1025eb7aeb?auto=format&fit=crop&q=80&w=800"],
    },

    // --- OFFICE ---
    {
      title: "Executive Mahogany Writing Desk",
      description: "A spacious and functional writing desk featuring multiple drawers for storage, high-quality brass handles, and leather inlay.",
      price: 280000.00,
      dimensions: "150cm x 70cm x 76cm",
      material: "Mahogany and Brass",
      categorySlug: "office",
      images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Director's High-Back Office Chair",
      description: "Ergonomic executive desk chair framed in hand-polished bentwood and upholstered in rich tufted top-grain leather.",
      price: 220000.00,
      dimensions: "65cm x 65cm x 120cm",
      material: "Bentwood and Top-Grain Leather",
      categorySlug: "office",
      images: ["https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800"],
    },
    {
      title: "Modular Office Bookshelf",
      description: "Grand bookshelf system featuring thick adjustable shelves and a lower cabinet storage compartment.",
      price: 320000.00,
      dimensions: "120cm x 35cm x 200cm",
      material: "Teak and Oak veneers",
      categorySlug: "office",
      images: ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800"],
    },
  ];

  // Clean old seeded products to prevent duplicates on multiple runs
  await prisma.product.deleteMany({});
  console.log("Cleared existing products.");

  for (const prod of productsData) {
    const category = categories.find((c) => c.slug === prod.categorySlug);
    if (!category) continue;

    await prisma.product.create({
      data: {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        dimensions: prod.dimensions,
        material: prod.material,
        images: prod.images,
        categoryId: category.id,
      },
    });
    console.log(`Seeded product: ${prod.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
