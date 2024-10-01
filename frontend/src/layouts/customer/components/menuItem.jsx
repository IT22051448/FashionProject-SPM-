import { shopHeaderLinks } from "@/config";
import { Link } from "react-router-dom";

const MenuItems = ({ isLoyaltyCustomer }) => {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shopHeaderLinks
        .filter((menuItem) => !menuItem.isLoyalty)
        .map((menuItem) => (
          <Link
            className="text-sm font-medium"
            key={menuItem.id}
            to={menuItem.path}
          >
            {menuItem.label}
          </Link>
        ))}

      {isLoyaltyCustomer ? (
        <Link
          to="/shop/loyaltyMember"
          className="text-sm font-medium hover:underline"
        >
          Loyalty Profile
        </Link>
      ) : (
        <Link
          to="/shop/loyaltySignUp"
          className="text-sm font-medium hover:underline"
        >
          Become a Loyalty Member
        </Link>
      )}
    </nav>
  );
};

export default MenuItems;
