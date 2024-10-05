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
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import jsPDF autotable plugin

function AdminStockList() {
  const dispatch = useDispatch();
  const [selectedStock, setSelectedStock] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllStock());
  }, [dispatch]);

  const { stockList } = useSelector((state) => state.stock);
  const stockArray = stockList?.stocks || [];

  const handleDelete = (id) => {
    dispatch(deleteStock(id)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        dispatch(fetchAllStock());
        setSelectedStock(null);
        toast({
          title: "Stock deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete stock.",
        });
      }
    });
  };

  const downloadPDF = () => {
    const pdf = new jsPDF("l", "pt", "a4"); // Create a PDF document
    const tableColumn = [
      "Item ID",
      "Title",
      "Stock Description",
      "Stock Price",
      "Supplier",
      "Stock Count",
    ]; 
    const tableRows = []; 

    // Populate table rows with stock data
    stockArray.forEach((stockItem) => {
      const stockData = [
        stockItem.itemId,
        stockItem.title,
        stockItem.description,
        stockItem.price,
        stockItem.supplier ? stockItem.supplier.name : "Unknown",
        stockItem.totalStock,
      ];
      tableRows.push(stockData); 
    });

    // Add the table to the PDF
    pdf.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    pdf.save("stock-list.pdf"); // Save the PDF
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-center">All Stocks</h2>
      <Button
        className="bg-slate-900 hover:bg-blue-700"
        onClick={downloadPDF} 
      >
        Download List
      </Button>

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
                      <Button
                        className="bg-slate-700 hover:bg-red-700"
                        onClick={() => setSelectedStock(stockItem)}
                      >
                        Remove
                      </Button>
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
                          onClick={() => {
                            handleDelete(selectedStock?._id);
                            setSelectedStock(null);
                          }}
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
              <TableCell colSpan={8} className="text-center">
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
