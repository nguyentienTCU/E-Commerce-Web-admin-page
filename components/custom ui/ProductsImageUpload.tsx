"use client";
import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import Image from "next/image";
import { Plus, Trash } from "lucide-react";

interface ProductsImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const ProductsImageUpload: React.FC<ProductsImageUploadProps> = ({
  value,
  onChange,
}) => {
  const [images, setImages] = useState<string[]>(value);

  const handleSuccess = (result: any) => {
    const url = result.info.secure_url;
    setImages((currentImages) => {
      const newImages = [...currentImages, url];
      onChange(newImages);
      return newImages;
    });
  };

  const onRemove = (url: string) => {
    setImages((currentImages) => {
      const newImages = currentImages.filter((image) => image !== url);
      onChange(newImages);
      return newImages;
    });
  };

  useEffect(() => {
    setImages(value);
  }, [value]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {images.map((url) => (
          <div key={url} className="relative">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                size="sm"
                className="bg-red-1 text-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              width={200}
              height={200}
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="upload_ecommerce"
        onSuccess={handleSuccess}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              className="bg-grey-1 text-white"
              onClick={() => open()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ProductsImageUpload;
