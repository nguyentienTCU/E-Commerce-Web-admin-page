import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();
    const { productId } = await params;
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      $or: [
        { category: product.category },
        { collections: { $in: product.collections } },
      ],
    }).limit(4);

    if (!relatedProducts || relatedProducts.length === 0) {
      return NextResponse.json(
        { message: "No related products found" },
        { status: 404 }
      );
    }
    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error here" },
      { status: 500 }
    );
  }
};
