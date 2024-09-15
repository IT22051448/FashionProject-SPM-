import {
  LayoutDashboard,
  Shirt,
  PackageOpen,
  Warehouse,
  Stamp,
} from "lucide-react";

// eslint-disable-next-line react-refresh/only-export-components
export const adminSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <Shirt />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <PackageOpen />,
  },
  {
    id: "inventory",
    label: "Inventory",
    path: "/admin/inventory",
    icon: <Warehouse />,
  },

  {
    id: "promocodes",
    label: "Promo Codes",
    path: "/admin/promocodes",
    icon: <Stamp />,
  },

  {
    id: "loyaltymembers",
    label: "Loyalty Members",
    path: "/admin/view-members",
    icon: <Stamp />,
  },
];

// eslint-disable-next-line react/prop-types
const MenuItems = ({ navigate, setOpen }) => {
  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSideBarMenuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            navigate(item.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default MenuItems;
