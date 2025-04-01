import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    const { customerId } = await params;
    await connectToDB();

    const orders = await Order.find({ customerClerkId: customerId }).populate({
      path: "products.productId",
      model: Product,
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log("[customerId_GET]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
