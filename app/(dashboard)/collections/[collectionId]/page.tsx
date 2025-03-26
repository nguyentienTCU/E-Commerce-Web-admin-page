"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/custom ui/Loader";
import CollectionForm from "@/components/collections/CollectionForm";

const CollectionDetails = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);

  const getCollectionDetails = async () => {
    try {
      const { collectionId } = await params;
      console.log(collectionId);
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: "GET",
      });
      console.log(response);
      const data = await response.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("[collectionId_GET]", error);
    }
  };

  useEffect(() => {
    getCollectionDetails();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <CollectionForm initialData={collectionDetails} />
  );
};

export default CollectionDetails;
