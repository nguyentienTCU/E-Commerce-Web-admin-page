import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login or register" },
        { status: 401 }
      );
    }

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    console.log(typeof price);

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    const priceDecimal = mongoose.Types.Decimal128.fromString(price.toString());
    const expenseDecimal = mongoose.Types.Decimal128.fromString(
      expense.toString()
    );

    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price: priceDecimal,
      expense: expenseDecimal,
    });

    if (collections) {
      for (const collectionId of collections) {
        await Collection.findByIdAndUpdate(
          collectionId,
          { $addToSet: { products: newProduct._id } }, // Avoid duplicates
          { new: true }
        );
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    console.log("[products_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[product_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
