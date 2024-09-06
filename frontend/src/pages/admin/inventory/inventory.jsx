import React from "react";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function Admininventory() {
  return (
    <div>
      <Fragment>
        <div className="mb-5 w-full flex justify-end">
          <Button >
            Add New stock
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>
        <Sheet
          
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>Add New Stock</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Fragment>
    </div>
  );
}

export default Admininventory;
