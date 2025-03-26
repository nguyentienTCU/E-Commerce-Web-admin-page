import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash } from "lucide-react";

import { Button } from "../ui/button";
import Image from "next/image";

interface CollectionsImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const CollectionsImageUpload: React.FC<CollectionsImageUploadProps> = ({
  onChange,
  value,
}) => {
  const handleSuccess = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value && (
          <div key={value} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                onClick={() => onChange("")}
                size="sm"
                className="bg-red-1 text-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={value}
              alt="collection"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        )}
      </div>

      <CldUploadWidget
        uploadPreset="upload_ecommerce"
        onSuccess={handleSuccess}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              onClick={() => open()}
              className="bg-grey-1 text-white"
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

export default CollectionsImageUpload;
