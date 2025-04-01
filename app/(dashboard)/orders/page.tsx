import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orders/OrderColumns";
import { Separator } from "@/components/ui/separator";

const Orders = async () => {
  const res = await fetch("http://localhost:3000/api/orders");
  const data = await res.json();

  return (
    <div className="px-10 py-5">
      <p className="text-heading2-bold">Orders</p>
      <Separator className="bg-grey-1 my-5" />
      <DataTable columns={columns} data={data} searchKey="_id" />
    </div>
  );
};

export default Orders;
