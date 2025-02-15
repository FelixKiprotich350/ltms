import { NextResponse } from "next/server";
import prisma from "lib/prisma";

// GET: Fetch top 10 selling products
export async function GET() {
  try {
    const allCaegories = await prisma.category.findMany();
    const allUnits = await prisma.packagingUnit.findMany();
    // Group sales by productUuid and calculate total quantity sold
    const topSellingProducts = await prisma.productSale.groupBy({
      by: ["productUuid"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 10, // Get top 10 products
    });
    // Fetch details for the top 10 products
    const productDetails = await Promise.all(
      topSellingProducts.map(async (product) => {
        const details = await prisma.product.findUnique({
          where: { uuid: product.productUuid },
          select: {
            id: true,
            uuid: true,
            name: true,
            basicUnitUuid: true,
            categoryUuid: true,
          },
        });

        // Format the response to include totals
        return {
          id: details?.id || null,
          productUuid: details?.uuid || null,
          name: details?.name || null,
          basicUnitUuid:
            allUnits.find((unit) => unit.uuid == details?.basicUnitUuid)
              ?.name ?? null,
          categoryUuid:
            allCaegories.find(
              (category) => category.uuid == details?.categoryUuid
            )?.name ?? null,
          totalSold: product._sum.quantity || 0,
        };
      })
    );

    //get total sales
    const allSales = await prisma.productSale.findMany({
      select: {
        price: true,
        quantity: true,
      },
    });
    const totalSales = allSales.reduce(
      (sum, sale) => sum + Number(sale.price) * Number(sale.quantity),
      0
    );

    //get total transactions
    const alltransactions = await prisma.salesMaster.count();

    //get users count
    const allusers = await prisma.trtUser.count();

    //get products count
    const allproducts = await prisma.product.count();

    return NextResponse.json(
      {
        topSellingProducts: productDetails,
        totalSales: totalSales,
        totalProducts: allproducts,
        totalUsers: allusers,
        totalTransactions: alltransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
