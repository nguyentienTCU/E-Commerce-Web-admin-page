"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/custom ui/Loader";
import { useRouter } from "next/router";
import ProductForm from "@/components/products/ProductForm";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  const getProductDetails = async () => {
    try {
      const { productId } = await params;
      console.log(productId);
      const response = await fetch(`/api/products/${productId}`, {
        method: "GET",
      });
      console.log(response);
      const data = await response.json();
      setProductDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("[productId_GET]", error);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
};

export default ProductDetails;
