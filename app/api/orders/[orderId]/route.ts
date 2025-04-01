import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    await connectToDB();

    const { orderId } = await params;

    const orderDetails = await Order.findById(orderId).populate({
      path: "products.productId",
      model: Product,
    });

    if (!orderDetails) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const customer = await Customer.findOne({
      clerkId: orderDetails.customerClerkId,
    });

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (error) {
    console.log("[orderId_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
