import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkLoyaltyCustomer } from "../../../redux/loyaltySlice/loyaltySlice";
import { Menu, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MenuItems from "./menuItem";
import HeaderRightContent from "./headerRightContent";

const ShoppingHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoyaltyCustomer = useSelector(
    (state) => state.loyalty.isLoyaltyCustomer
  );

  const { isAuthenticated } = useSelector((state) => state.auth);
  const userEmail = useSelector((state) => state.auth.user?.email);

  React.useEffect(() => {
    if (userEmail) {
      dispatch(checkLoyaltyCustomer(userEmail));
    }
  }, [userEmail, dispatch]);

  return (
    <header className="sticky top-0 z-40 w-full border bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <Shirt className="h-6 w-6" />
          <span className="font-bold">Fashion House</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems isLoyaltyCustomer={isLoyaltyCustomer} />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems isLoyaltyCustomer={isLoyaltyCustomer} />
        </div>
        {isAuthenticated ? (
          <div>
            <HeaderRightContent />
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default ShoppingHeader;
