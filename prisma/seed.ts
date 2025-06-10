import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar categorias
  const categories = [
    {
      name: 'Cafés',
      slug: 'cafes',
      description: 'Nossos deliciosos cafés especiais',
    },
    {
      name: 'Doces',
      slug: 'doces',
      description: 'Doces e sobremesas caseiras',
    },
    {
      name: 'Salgados',
      slug: 'salgados',
      description: 'Salgados e lanches',
    },
    {
      name: 'Bebidas',
      slug: 'bebidas',
      description: 'Bebidas e sucos naturais',
    },
    {
      name: 'Combos',
      slug: 'combos',
      description: 'Combos e promoções especiais',
    },
    {
      name: 'Promoções',
      slug: 'promocoes',
      description: 'Ofertas e descontos especiais',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Categorias criadas com sucesso!');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@tiafabi.com" },
    update: {},
    create: {
      email: "admin@tiafabi.com",
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Criar produtos
  const acai = await prisma.product.create({
    data: {
      name: "Açaí 300ml",
      price: 12.0,
      description: "Açaí com leite condensado e granola",
      category: {
        connect: {
          slug: 'bebidas'
        }
      }
    },
  });

  const pastel = await prisma.product.create({
    data: {
      name: "Pastel de Queijo",
      price: 8.0,
      description: "Pastel de queijo com queijo e presunto",
      category: {
        connect: {
          slug: 'salgados'
        }
      }
    },
  });

  const coxinha = await prisma.product.create({
    data: {
      name: "Coxinha de queijo",
      price: 3.0,
      description: "Coxinha bem frita",
      category: {
        connect: {
          slug: 'salgados'
        }
      }
    },
  });

  // Criar extras
  const leiteCondensado = await prisma.extra.create({
    data: {
      name: "Leite Condensado",
      price: 2.5,
    },
  });

  const granola = await prisma.extra.create({
    data: {
      name: "Granola",
      price: 1.5,
    },
  });

  const pacoca = await prisma.extra.create({
    data: {
      name: "Paçoca",
      price: 1.5,
    },
  });

  // Relacionar extras ao produto (se necessário)
  await prisma.product.update({
    where: { id: acai.id },
    data: {
      extras: {
        connect: [{ id: leiteCondensado.id }, { id: granola.id }, {id: pacoca.id}],
      },
    },
  });

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
