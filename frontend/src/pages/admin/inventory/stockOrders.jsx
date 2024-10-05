import React, { useEffect } from "react";
import { fetchStockOrders } from "@/redux/supplierToken/supplierTokenSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button component
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import jsPDF autotable plugin

function StockOrders() {
  const dispatch = useDispatch();

  const { stockOrders = [] } = useSelector((state) => state.token);

  useEffect(() => {
    dispatch(fetchStockOrders());
  }, [dispatch]);

  if (stockOrders.length > 0) {
    console.log("Stock orders fetched successfully");
  } else {
    console.log("No stock orders found");
  }

  // Function to download the stock orders as a PDF
  const downloadPDF = () => {
    const pdf = new jsPDF("l", "pt", "a4"); // Create a PDF document
    const tableColumn = ["Item ID", "Quantity", "Supplier", "Status"]; // Define the table columns
    const tableRows = []; // Initialize an array to hold table rows

    // Populate table rows with stock orders data
    stockOrders.forEach((order) => {
      const orderData = [
        order.itemId,
        order.quantity,
        order.supplier?.name || "N/A",
        order.status,
      ];
      tableRows.push(orderData); // Add each stock order's data to the table rows
    });

    // Add the table to the PDF
    pdf.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    pdf.save("stock-orders.pdf"); // Save the PDF
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-center">Stock Orders</h2>

      {/* Button to download stock orders as PDF */}
      <Button className="bg-slate-900 hover:bg-blue-700" onClick={downloadPDF}>
        Download Orders List
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockOrders.length > 0 ? (
            stockOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order?.itemId}</TableCell>
                <TableCell>{order?.quantity}</TableCell>
                <TableCell>{order?.supplier?.name || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    className={`py-1 px-3 ${
                      order?.status === "ACCEPTED"
                        ? "bg-green-500"
                        : order?.status === "DECLINED"
                        ? "bg-red-600"
                        : order?.status === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-black"
                    }`}
                  >
                    {order?.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No stock orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default StockOrders;
