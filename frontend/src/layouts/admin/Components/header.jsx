import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { logoutUser } from "../../../redux/authSlice";

// eslint-disable-next-line react/prop-types
const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="block lg:hidden">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
