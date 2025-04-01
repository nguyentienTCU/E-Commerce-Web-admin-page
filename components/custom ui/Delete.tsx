"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteProps {
  id: string;
  item: string;
}

const Delete: React.FC<DeleteProps> = ({ id, item }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const renderItem = item === "products" ? "product" : "collection";

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/${item}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setLoading(false);
        console.log(item);
        window.location.href = `/${item}`;
        toast.success(`${renderItem} deleted`);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-1 text-white">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-grey-1">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-1">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            {renderItem}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
