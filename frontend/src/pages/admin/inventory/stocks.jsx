import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addStockFormElements } from "@/config";
import { addNewStock, fetchAllStock } from "@/redux/stockSlice";
import { fetchAllSuppliers } from "@/redux/supplierSlice";
import AdminStockList from "@/layouts/admin/Components/adminStockList";
import LowStockList from "@/layouts/admin/Components/lowStockList";
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

function Stock() {
  const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [showLowStock, setShowLowStock] = useState(false);
  const location = useLocation();
  const [tab, setTab] = useState("");

  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllStock());
    dispatch(fetchAllSuppliers());
  }, [dispatch]);

  const {
    supplierList = [],
    isLoading,
    error,
  } = useSelector((state) => state.supplier);

  useEffect(() => {
    console.log("Supplier List:", supplierList);
    console.log("Is Loading:", isLoading);
    console.log("Error:", error);
  }, [supplierList, isLoading, error]);

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFormURL = urlParam.get("tab");
    if (tabFormURL) {
      setTab(tabFormURL);
    }
  }, [location.search]);

  const supplierOptions = Array.isArray(supplierList)
    ? supplierList.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      }))
    : [];

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

        <Sheet open={openAddStockDialog} onOpenChange={setOpenAddStockDialog}>
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
                supplierOptions={supplierOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>

      <div className="flex items-center justify-center space-x-2 mt-5">
        <Switch
          id="view-low-stocks"
          checked={showLowStock}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="view-low-stocks">Click to View Low Stocks</Label>
      </div>

      <div className="mt-5">
        {showLowStock ? <LowStockList /> : <AdminStockList />}
      </div>
    </div>
  );
}

export default Stock;
