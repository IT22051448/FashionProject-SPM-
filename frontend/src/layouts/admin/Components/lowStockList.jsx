import React, { useEffect, useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchLowStock } from "@/redux/stockSlice";
import CommonForm from "@/components/common/form";
import { fetchAllSuppliers } from "@/redux/supplierSlice";
import { sendEmail } from "@/redux/mailSlice/mailslice"; // Import the sendEmail action
import { reorderFormControls } from "@/config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast"; // Import useToast

function LowStockList() {
  const initialFormData = {
    supplier: "",
    quantity: 0,
    reorderDate: null,
  };

  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedStockItem, setSelectedStockItem] = useState(null);

  const dispatch = useDispatch();
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    dispatch(fetchAllSuppliers());
  }, [dispatch]);

  const {
    supplierList = [],
    isLoading,
    error,
  } = useSelector((state) => state.supplier);

  const supplierOptions = Array.isArray(supplierList)
    ? supplierList.map((supplier) => ({
        value: supplier.email,
        label: supplier.name,
      }))
    : [];

  useEffect(() => {
    dispatch(fetchLowStock());
  }, [dispatch]);

  const { lowStockList } = useSelector((state) => state.stock);
  const {
    isLoading: emailLoading,
    message: emailMessage,
    error: emailError,
  } = useSelector((state) => state.email);

  const lowArray = lowStockList?.lowStockItems || [];

  const handleOpenOrderDialog = (stockItem) => {
    setSelectedStockItem(stockItem);
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemCode: stockItem.itemId,
      quantity: stockItem.totalStock,
    }));
    setOpenOrderDialog(true);
  };

  const handlePlaceOrder = () => {
    const selectedSupplier = supplierList.find(
      (supplier) => supplier.email === formData.supplier
    );

    if (!selectedSupplier) {
      console.error("Supplier not found");
      return;
    }

    const orderData = {
      email: formData.supplier, // Supplier's email
      itemCode: selectedStockItem.itemId,
      qnt: formData.quantity,
      date: formData.reorderDate,
    };

    // Dispatch the sendEmail action
    dispatch(sendEmail(orderData)).then(() => {
      toast({
        title: "Order placed successfully",
      });
    });
  };

  return (
    <div>
      <Fragment>
        <Sheet open={openOrderDialog} onOpenChange={setOpenOrderDialog}>
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>Reorder Form</SheetTitle>
              {selectedStockItem && (
                <div>
                  <p className="text-sm text-gray-500 mt-2">
                    Ordering for Item ID:{" "}
                    <strong>{selectedStockItem.itemId}</strong>
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    Item Name: <strong>{selectedStockItem.title}</strong>
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    Current Stock:{" "}
                    <strong>{selectedStockItem.totalStock}</strong>
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
                supplierOptions={supplierOptions}
                onSubmit={handlePlaceOrder}
              />
            </div>

            {emailLoading && <p>Sending email...</p>}
            {emailError && <p className="text-red-600">{emailError}</p>}
          </SheetContent>
        </Sheet>
      </Fragment>

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
            <TableHead>
              <span className="sr-only">Order</span>
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
                <TableCell>{stockItem?.supplier?.name || "N/A"}</TableCell>
                <TableCell>
                  <Badge className="py-1 px-3 bg-red-700">
                    {stockItem?.totalStock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenOrderDialog(stockItem)}>
                    Order
                  </Button>
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
