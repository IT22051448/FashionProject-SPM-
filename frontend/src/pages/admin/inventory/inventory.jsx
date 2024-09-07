import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addStockFormElements } from "@/config";
import { addNewStock, fetchAllStock } from "@/redux/stockSlice";
import AdminStockList from "@/layouts/admin/Components/adminStockList";
import LLowStockList from "@/layouts/admin/Components/lowStockList";

import { useToast } from "@/hooks/use-toast";

const initialFormData = {
  title: "",
  description: "",
  itemId: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
  supplier: "",
};

function Admininventory() {
  const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [showLowStock, setShowLowStock] = useState(false); // State to manage the switch

  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllStock());
  }, [dispatch]);

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(
      addNewStock({
        ...formData,
      })
    ).then((data) => {
      if (data) {
        dispatch(fetchAllStock());
        setFormData(initialFormData);
        setOpenAddStockDialog(false);
        toast({
          title: "Stock added successfully",
        });
      }
    });
  };

  const handleSwitchChange = (checked) => {
    setShowLowStock(checked);
  };

  return (
    <div>
      <Fragment>
        <div className="mb-5 w-full flex justify-end">
          <Button onClick={() => setOpenAddStockDialog(true)}>
            Add New Stock
          </Button>
        </div>

        <Sheet
          open={openAddStockDialog}
          onOpenChange={setOpenAddStockDialog} // Pass the state setter function directly
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>Add New Stock</SheetTitle>
            </SheetHeader>

            <div className="py-6">
              <CommonForm
                formData={formData}
                onSubmit={onSubmit}
                setFormData={setFormData}
                buttonText="Add Stock"
                formControls={addStockFormElements}
              />
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>

      {/* Centering the Switch and Label */}
      <div className="flex items-center justify-center space-x-2 mt-5">
        <Switch
          id="view-low-stocks"
          checked={showLowStock}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="view-low-stocks">Click to View Low Stocks</Label>
      </div>

      <div className="mt-5">
        {/* Conditionally render based on switch state */}
        {showLowStock ? <LLowStockList /> : <AdminStockList />}
      </div>
    </div>
  );
}

export default Admininventory;
