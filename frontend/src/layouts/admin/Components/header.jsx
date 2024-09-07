import { Button } from "@/components/ui/button";
import { logOutUser } from "@/redux/authSlice";
import { persistor } from "@/redux/store";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

// eslint-disable-next-line react/prop-types
const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logOutUser());
    persistor.purge();
  }

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
