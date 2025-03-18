import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import Image from "next/image";
import { Plus, Trash } from "lucide-react";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const onSuccess = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative">
            <div className="absolute top-0 right-0 z-10">
              <Button
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
        options={{ multiple: true }}
        uploadPreset="upload_ecommerce"
        onSuccess={onSuccess}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              className="bg-grey-1 text-white"
              onClick={() => open()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
