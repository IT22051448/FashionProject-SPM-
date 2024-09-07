import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { fetchLowStock } from "@/redux/stockSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function LowStockList() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLowStock());
  }, [dispatch]);

  const { lowStockList } = useSelector((state) => state.stock);

  // Access lowStockItems array correctly from lowStockList
  const lowArray = lowStockList?.lowStockItems || [];

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Title</TableHead>

            <TableHead>Stock Price</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Stock Count</TableHead>
            <TableHead>
              <span className="sr-only">Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lowArray.length > 0 ? (
            lowArray.map((stockItem) => (
              <TableRow key={stockItem._id}>
                <TableCell>{stockItem?.itemId}</TableCell>
                <TableCell>{stockItem?.title}</TableCell>

                <TableCell>{stockItem?.price}</TableCell>
                <TableCell>{stockItem?.supplier}</TableCell>
                <TableCell>
                  <Badge className="py-1 px-3 bg-red-700">
                    {stockItem?.totalStock}
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

export default LowStockList;
