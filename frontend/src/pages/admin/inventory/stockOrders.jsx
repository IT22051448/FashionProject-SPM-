import React, { useEffect } from 'react'
import { fetchStockOrders } from "@/redux/supplierToken/supplierTokenSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function stockOrders() {

  const dispatch = useDispatch();

  const { stockOrders } = useSelector((state) => state.token);

  useEffect(() => {
    dispatch(fetchStockOrders());
  }, [dispatch]);

  if(stockOrders) {
    console.log(" ok");
    
  }
  else{
    console.log("stock order error");
    
  }




  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockOrders.length > 0 ? (
            stockOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order?.itemId}</TableCell>
                <TableCell>{order?.quantity}</TableCell>
                <TableCell>{order?.supplier?.name || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    className={`py-1 px-3 ${
                      order?.status === "ACCEPTED"
                        ? "bg-green-500"
                        : order?.status === "DECLINED"
                        ? "bg-red-600"
                        : order?.status === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-black"
                    }`}
                  >
                    {order?.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No low stock items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default stockOrders;
