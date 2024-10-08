import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "@/redux/loyaltySlice/loyaltySlice";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Register required chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const LoyaltyReport = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.loyalty);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  if (loading)
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-lg text-red-600">Error: {error}</div>
    );

  // Function to calculate revenue for each customer
  const calculateRevenue = (points, referrals) => {
    return (points - referrals * 40) * 10;
  };

  // Calculate revenues for all customers
  const revenues = customers.map((customer) =>
    calculateRevenue(customer.loyaltyPoints, customer.referredcount)
  );

  // Calculate highest, lowest, and total revenue
  const highestRevenue = Math.max(...revenues);
  const lowestRevenue = Math.min(...revenues);
  const totalRevenue = revenues.reduce((acc, revenue) => acc + revenue, 0);

  // Find the customer with the highest and lowest revenue
  const highestRevenueCustomer = customers[revenues.indexOf(highestRevenue)];
  const lowestRevenueCustomer = customers[revenues.indexOf(lowestRevenue)];

  // Define color mapping for each tier
  const tierColorMap = {
    Diamond: "#451af0",
    Bronze: "#784d19",
    Gold: "#a38518",
    Silver: "#cfcfcf",
    Grey: "#727372",
    Platinum: "#539dfc",
  };

  // Function to get members count per tier with fixed colors
  const getMembersByTier = () => {
    const tierCounts = customers.reduce((acc, customer) => {
      acc[customer.tier] = (acc[customer.tier] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(tierCounts),
      datasets: [
        {
          label: "Members by Tier",
          data: Object.values(tierCounts),
          backgroundColor: Object.keys(tierCounts).map(
            (tier) => tierColorMap[tier] || "#000"
          ), // Use fixed colors
        },
      ],
    };
  };

  // Function to get member points for bar chart
  const getPointsByMember = () => {
    const labels = customers.map((customer) => customer.name);
    const data = customers.map((customer) => customer.loyaltyPoints);
    return {
      labels,
      datasets: [
        {
          label: "Loyalty Points",
          data,
          backgroundColor: "#228B22",
        },
      ],
    };
  };

  // Function to get referrals count for bar chart
  const getReferralsByMember = () => {
    const labels = customers.map((customer) => customer.name);
    const data = customers.map((customer) => customer.referredcount);
    return {
      labels,
      datasets: [
        {
          label: "Referrals",
          data,
          backgroundColor: "#FF4500",
        },
      ],
    };
  };

  // Sort customers by loyalty points (highest to lowest)
  const sortedCustomers = [...customers].sort(
    (a, b) => b.loyaltyPoints - a.loyaltyPoints
  );

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add report title
    doc.text("Loyalty Report", 20, 10);

    // Add the table with adjusted styles
    doc.autoTable({
      head: [
        [
          "Name",
          "Email",
          "Phone Number",
          "Date of Birth",
          "Loyalty Points",
          "Tier",
          "Referrals",
          "Join Date",
        ],
      ],
      body: sortedCustomers.map((customer) => [
        customer.name,
        customer.email,
        customer.phoneNumber,
        new Date(customer.dateOfBirth).toLocaleDateString("en-GB"),
        customer.loyaltyPoints,
        customer.tier,
        customer.referredcount,
        new Date(customer.joinDate).toLocaleDateString("en-GB"),
      ]),
      startY: 20,
      styles: {
        fontSize: 8, // Smaller font size
        cellPadding: 1, // Smaller cell padding
      },
      margin: { top: 20 },
    });

    // Add charts to PDF with higher resolution
    const addChartToPDF = (chartId, title, width, height) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const chart = document.getElementById(chartId);
          const chartURL = chart.toDataURL("image/png", 1.0); // Use 1.0 for full resolution
          doc.addPage();
          doc.text(title, 20, 10);
          doc.addImage(chartURL, "PNG", 20, 20, width, height); // Adjust dimensions as needed
          resolve();
        }, 1000); // Add delay to ensure chart is fully rendered
      });
    };

    // Chain promises to add all charts
    Promise.all([
      addChartToPDF("membersByTierChart", "Members by Tier", 120, 80), // Adjust width and height for pie chart
      addChartToPDF(
        "pointsByMemberChart",
        "Loyalty Points by Member",
        180,
        100
      ),
      addChartToPDF("referralsByMemberChart", "Referrals by Member", 180, 100),
    ]).then(() => {
      doc.save("loyalty-report.pdf");
    });
  };

  return (
    <div className="loyalty-report p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Loyalty Report</h2>
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save as PDF
        </button>
      </div>

      {/* Display Stats */}
      <div className="stats-container grid grid-cols-3 gap-6 mb-8">
        <div className="stat-card bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            Highest Revenue Generator
          </h3>
          <p className="text-lg font-bold">
            {highestRevenueCustomer ? highestRevenueCustomer.name : "N/A"}: $
            {highestRevenue.toFixed(2)}
          </p>
        </div>
        <div className="stat-card bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            Lowest Revenue Generator
          </h3>
          <p className="text-lg font-bold">
            {lowestRevenueCustomer ? lowestRevenueCustomer.name : "N/A"}: $
            {lowestRevenue.toFixed(2)}
          </p>
        </div>
        <div className="stat-card bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Total Revenue</h3>
          <p className="text-lg font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Standalone Table for customer information */}
      <div className="chart-container bg-white shadow-lg p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Loyalty Members Information
        </h3>
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date of Birth
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loyalty Points
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrals
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCustomers.map((customer) => (
              <tr key={customer.email}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {customer.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {customer.phoneNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(customer.dateOfBirth).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {customer.loyaltyPoints}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {customer.tier}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {customer.referredcount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(customer.joinDate).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <div className="chart-container grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Members by Tier
          </h3>
          <Pie data={getMembersByTier()} id="membersByTierChart" />
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Loyalty Points by Member
          </h3>
          <Bar data={getPointsByMember()} id="pointsByMemberChart" />
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Referrals by Member
          </h3>
          <Bar data={getReferralsByMember()} id="referralsByMemberChart" />
        </div>
      </div>
    </div>
  );
};

export default LoyaltyReport;
