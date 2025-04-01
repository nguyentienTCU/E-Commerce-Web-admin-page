import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import Collection from "@/lib/models/Collection";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    console.log(userId);

    if (!userId) {
      console.log("Unauthorized");
      return NextResponse.json(
        { error: "Unauthorized. Please login or register" },
        { status: 403 }
      );
    }

    await connectToDB();

    const { title, description, image } = await req.json();

    const existingCollection = await Collection.findOne({ title });

    if (existingCollection) {
      return NextResponse.json(
        { message: "Collection already exists" },
        { status: 400 }
      );
    }

    if (!title || !image) {
      return NextResponse.json(
        { message: "Title and image are required" },
        { status: 400 }
      );
    }

    const newCollection = await Collection.create({
      title,
      description,
      image,
    });

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.log("[collections_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const collections = await Collection.find().sort({ createdAt: "desc" });

    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    console.log("[collections_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
