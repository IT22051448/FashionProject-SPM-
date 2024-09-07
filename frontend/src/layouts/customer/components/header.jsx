import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shirt } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MenuItems from "./menuItem";
import HeaderRightContent from "./headerRightContent";

const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
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
            <MenuItems />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
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
