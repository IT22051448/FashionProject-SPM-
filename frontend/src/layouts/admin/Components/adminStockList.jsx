import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
import CommonForm from "@/components/common/form";
import { sendEmail } from "@/redux/mailSlice/mailslice";
import { reorderFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fetchAllSuppliers } from "@/redux/supplierSlice";

function AdminStockList() {
  const dispatch = useDispatch();
  const [selectedStock, setSelectedStock] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [formData, setFormData] = useState({ supplier: "", quantity: 0 });
  const [supplierList, setSupplierList] = useState([]);

  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllStock());
    dispatch(fetchAllSuppliers()).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        setSupplierList(response.payload);
      }
    });
  }, [dispatch]);

  const { stockList } = useSelector((state) => state.stock);
  const stockArray = stockList?.stocks || [];

  const handleDelete = (id) => {
    dispatch(deleteStock(id));
    setSelectedStock(null);
  };

  const handleOpenOrderDialog = (stockItem) => {
    setSelectedStock(stockItem);
    setFormData({
      supplier: "",
      quantity: stockItem.totalStock,
    });
    setOpenOrderDialog(true);
  };

  const handlePlaceOrder = () => {
    const orderData = {
      email: formData.supplier,
      itemCode: selectedStock.itemId,
      qnt: formData.quantity,
      date: new Date().toISOString(),
    };

    dispatch(sendEmail(orderData)).then(() => {
      toast({
        title: "Order placed successfully",
      });
      setOpenOrderDialog(false);
    });
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
            <TableHead>
              <span className="sr-only">Order</span>
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
                        onClick={() => setSelectedStock(stockItem)}
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
                          onClick={() => handleDelete(selectedStock._id)}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell>
                  < Button onClick={() => handleOpenOrderDialog(stockItem)}>
                    Order
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No stock available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Order Sheet */}
      <Sheet open={openOrderDialog} onOpenChange={setOpenOrderDialog}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Order Form</SheetTitle>
            {selectedStock && (
              <div>
                <p className="text-sm text-gray-500 mt-2">
                  Ordering for Item ID: <strong>{selectedStock.itemId}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Item Name: <strong>{selectedStock.title}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Current Stock: <strong>{selectedStock.totalStock}</strong>
                </p>
              </div>
            )}
          </SheetHeader>

          <div className="py-6">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              buttonText="Place Order"
              formControls={reorderFormControls}
              supplierOptions={supplierList.map((supplier) => ({
                value: supplier.email,
                label: supplier.name,
              }))}
              onSubmit={handlePlaceOrder}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AdminStockList;
