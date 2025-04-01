"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "productId",
    header: "Product",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original.productId._id}`}
        className="hover:text-red-600"
      >
        {row.original.productTitle}
      </Link>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];
