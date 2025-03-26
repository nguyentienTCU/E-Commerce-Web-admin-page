"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import CollectionsImageUpload from "../custom ui/CollectionsImageUpload";

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(50).trim(),
    image: z.string(),
  });

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.image === "") {
      toast.error("Please upload an image");
    } else {
      try {
        setLoading(true);
        const url = initialData
          ? `/api/collections/${initialData._id}`
          : "/api/collections";
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setLoading(false);
          toast.success(`Collection ${initialData ? "updated" : "created"}`);
          window.location.href = "/collections";
          router.push("/collections");
        }
      } catch (error) {
        console.log("[collections_POST]", error);
        toast.error("Something went wrong! Please try again!");
      }
    }
  }

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Collection</p>
          <Delete item="collections" id={initialData._id} />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Collection</p>
      )}

      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="min-h-[120px] max-h-[300px] overflow-auto"
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <CollectionsImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Submit
            </Button>
            <Button
              type="button"
              className="bg-blue-1 text-white"
              onClick={() => router.push("/collections")}
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
