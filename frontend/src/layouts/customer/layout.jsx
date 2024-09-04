import { Outlet } from "react-router-dom";
import ShoppingHeader from "./components/header";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
