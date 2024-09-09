import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { fetchAllStock } from "@/redux/stockSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AdminStockList() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStock());
  }, [dispatch]);

  const { stockList } = useSelector((state) => state.stock);

  //console.log(stockList);

  const stockArray = stockList?.stocks || [];

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Stock Description</TableHead>
            <TableHead>Stock Price</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Stock Count</TableHead>
            <TableHead>
              <span className="sr-only">Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockArray.length > 0 ? (
            stockArray.map((stockItem) => (
              <TableRow key={stockItem._id}>
                <TableCell>{stockItem?.itemId}</TableCell>
                <TableCell>{stockItem?.title}</TableCell>
                <TableCell>{stockItem?.description}</TableCell>
                <TableCell>{stockItem?.price}</TableCell>
                <TableCell>
                  {stockItem?.supplier ? stockItem.supplier.name : "Unknown"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`py-1 px-3 ${
                      stockItem?.totalStock > 50
                        ? "bg-green-600"
                        : stockItem?.totalStock < 50
                        ? "bg-red-700"
                        : "bg-black"
                    }`}
                  >
                    {stockItem?.totalStock}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No stock available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminStockList;
