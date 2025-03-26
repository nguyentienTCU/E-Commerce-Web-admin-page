import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();
    const { productId } = await params;
    const product = await Product.findById(productId).populate({
      path: "collections",
      model: Collection,
    });
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[productId_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    const { productId } = await params;

    const product = await Product.findById(productId);

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

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

    if (!title || !media || !description || !category || !price || !expense) {
      return new NextResponse("Not enough data", { status: 400 });
    }

    //inside initial collections, outside new collections => new added collections
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );

    console.log("initial collection: " + product.collections);
    console.log("new collection: " + collections);
    console.log("added collection: " + addedCollections);

    const initialCollection: string[] = product.collections;
    const newCollection: string[] = collections;

    const removedCollections: string[] = initialCollection.filter(
      (collectionId: string) => !newCollection.includes(collectionId)
    );

    console.log("initial collection: " + initialCollection);
    console.log("new collection: " + newCollection);
    console.log("removed collection: " + removedCollections);

    await Promise.all([
      // Update added collections with this product
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),

      // Update removed collections without this product
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
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
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log("[productId_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();
    const { productId } = await params;

    const product = await Product.findById(productId);

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    if (product.collections.length > 0) {
      await Promise.all(
        product.collections.map((collectionId: string) =>
          Collection.updateMany(
            { _id: collectionId },
            { $pull: { products: productId } }
          )
        )
      );
    }

    await Product.findByIdAndDelete(productId);

    return new NextResponse("Product deleted", { status: 200 });
  } catch (error) {
    console.log("[productId_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
