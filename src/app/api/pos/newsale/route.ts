import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
interface paymentItem {
  paymentMode: string;
  amount: number;
  reference: string;
}
interface SellingItem extends Product {
  quantity: number;
  tax: number;
  total: number;
}

// export async function PUT(req: Request) {
//   try {
//     // Parse request body
//     const body = await req.json();
//     const { uuid, name, description, basicUnitUuid, categoryUuid,sellingPrice } = body;

//     // Validate required fields
//     if (!uuid || !name || !categoryUuid) {
//       return NextResponse.json(
//         { error: "Missing required fields: uuid, name, or categoryUuid" },
//         { status: 400 }
//       );
//     }

//     // Update the product
//     const updatedProduct = await prisma.product.update({
//       where: { uuid }, // Ensure uuid is unique in the database schema
//       data: {
//         name,
//         description,
//         basicUnitUuid,
//         categoryUuid,
//         sellingPrice: parseFloat(sellingPrice),
//       },
//       include: {
//         Category: true, // Include related category
//         PackagingUnit: true, // Include related unit
//       },
//     });

//     return NextResponse.json(updatedProduct, { status: 200 });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
//   finally{
//       prisma.$disconnect();
//     }
// }

// export async function DELETE() {
//   try {
//     // await prisma.product.delete({ where: { id: Number(id) } });
//     return NextResponse.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
//   finally{
//       prisma.$disconnect();
//     }
// }

// export async function POST(req: Request) {
//   try {
//     // Parse the request body
//     const body = await req.json();
//     const { products, payments } = body;
//     const allProducts = products as unknown as Array<Product>;
//     const allPayments = payments as unknown as Array<paymentItem>;
//     // Validate required fields
//     if (allPayments.length <= 0 || allProducts.length <= 0) {
//       return NextResponse.json(
//         { error: "Missing required fields: Payments and Items required!" },
//         { status: 400 }
//       );
//     }

//     // Create a new sale
//     const newsale = await prisma.productSale.create({
//       data: {
//         name,
//         description: description || null, // Optional field
//         sellingPrice: Number(sellingPrice) || 1,
//         Category: {
//           connect: {
//             uuid: categoryUuid, // Match your `categoryUuid` field with the unique identifier
//           },
//         },
//         PackagingUnit: {
//           connect: {
//             uuid: basicUnitUuid, // Match your `basicUnitUuid` field with the unique identifier
//           },
//         },
//       },
//     });

//     // Return the created product
//     return NextResponse.json({}, { status: 201 });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   } finally {
//     prisma.$disconnect();
//   }
// }
function generateSaleNumber(): string {
  const timestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp in seconds
  return `S-${timestamp}`;
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { products, payments, isfullypaid } = body;

    const allProducts = products as Array<SellingItem>;
    const allPayments = payments as Array<paymentItem>;
    const isFullyPaid = isfullypaid as boolean;
    // Validate required fields
    if (!allProducts?.length || !allPayments?.length) {
      return NextResponse.json(
        {
          error: "Missing required fields: Products and Payments are required!",
        },
        { status: 400 }
      );
    }

    // Generate UUID for the sale
    const saleUuid = uuidv4();
    const mastercode = generateSaleNumber();

    // Start a transaction to save data into three models
    const master = await prisma.$transaction(async (transaction) => {
      // Save data to SalesMaster
      const salesMaster = await transaction.salesMaster.create({
        data: {
          salesCode: mastercode,
        },
      });

      // Save products to SalesItems
      await Promise.all(
        allProducts.map((product) =>
          transaction.productSale.create({
            data: {
              masterCode: salesMaster.salesCode, // Use the salesCode from the created SalesMaster
              productUuid: product.uuid,
              quantity: product.quantity,
              price: product.sellingPrice,
              taxPercentage: product.tax,
              paymentStatus: isFullyPaid ? "PAID" : "PENDING",
              userUuid: "Felix",
              packingUnitUuid: product.basicUnitUuid,
            },
          })
        )
      );

      // Save payments to Payments
      await Promise.all(
        allPayments.map((payment) =>
          transaction.salesPayments.create({
            data: {
              salesMasterCode: salesMaster.salesCode, // Use the salesCode from the created SalesMaster
              paymentMode: payment.paymentMode,
              amountPaid: Number(payment.amount),
              refference: payment.reference,
              createdAt: new Date(),
            },
          })
        )
      );

      return salesMaster; // Return the master sale record
    });

    // Return the created sale
    return NextResponse.json(master, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
