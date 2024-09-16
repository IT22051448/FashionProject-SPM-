import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { fetchAllStock, deleteStock } from "@/redux/stockSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdDeleteForever } from "react-icons/md";
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

function AdminStockList() {
  const dispatch = useDispatch();
  const [selectedStock, setSelectedStock] = useState(null); // Track the selected stock to delete

  useEffect(() => {
    dispatch(fetchAllStock());
  }, [dispatch]);

  const { stockList } = useSelector((state) => state.stock);

  const stockArray = stockList?.stocks || [];

  // Trigger the delete action
  const handleDelete = (id) => {
    dispatch(deleteStock(id));
    setSelectedStock(null); // Reset the selected stock after deletion
  };

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
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setSelectedStock(stockItem)} // Set the selected stock for deletion
                      >
                        <MdDeleteForever size={32} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this stock?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The stock item will be
                          permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(selectedStock._id)} // Confirm and delete stock
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
