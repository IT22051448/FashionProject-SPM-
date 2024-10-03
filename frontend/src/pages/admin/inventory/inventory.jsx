import React, { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Test from "./stockOrders";
import Stock from "./stocks";
import LowStockList from "@/layouts/admin/Components/lowStockList";


 function Admininventory() {

  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFormURL = urlParam.get("tab");
    if (tabFormURL) {
      setTab(tabFormURL);
    }
  }, [location.search]);



 

  return (
    <div>
      {tab === "sup" && <Test />}
      {tab === "stock" && <Stock />}
      {tab === "lowstock" && <LowStockList />}
    </div>
  );
}

export default Admininventory;
