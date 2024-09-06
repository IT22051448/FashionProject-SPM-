import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addStockFormElements } from "@/config";

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

  const onSubmit = () => {
    
  };

  
  console.log(formData, "formData");

  return (
    <div>
      <Fragment>
        <div className="mb-5 w-full flex justify-end">
          <Button onClick={() => setOpenAddStockDialog(true)}>
            Add New Stock
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>

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
    </div>
  );
}

export default Admininventory;
