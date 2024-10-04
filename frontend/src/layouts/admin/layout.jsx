import { Outlet } from "react-router-dom";
import AdminSidebar from "./Components/sidebar";
import AdminHeader from "./Components/header";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";


const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-r from-gray-100 to-gray-300 border-2 border-black">
      {/* Side Bar */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col bg-muted/40 p-4 md:p-6">
          <Toaster />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
