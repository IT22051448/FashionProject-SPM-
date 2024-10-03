import { useState } from "react";
import {
  LayoutDashboard,
  Shirt,
  PackageOpen,
  Warehouse,
  ChevronDown,
  icons,
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
    subItems: [
      {
        id: "stock",
        label: "All Stocks",
        path: "/admin/inventory?tab=stock",
      },
      {
        id: "low",
        label: "Low Stocks",
        path: "/admin/inventory?tab=lowstock",
      },
      {
        id: "suppliers",
        label: "Stock Orders",
        path: "/admin/inventory?tab=sup",
      },
      {
        id: "analytics",
        label: "Analytics",
        path: "/admin/inventory?tab=analytics",
      },
    ],
  },
];

// eslint-disable-next-line react/prop-types
const MenuItems = ({ navigate, setOpen }) => {
  const [openItemId, setOpenItemId] = useState(null);

  const handleItemClick = (itemId, path) => {
    if (itemId === "inventory") {
      // Toggle the dropdown for inventory subItems
      setOpenItemId(openItemId === itemId ? null : itemId);
      navigate(path);
    } else {
      navigate(path);
      setOpen ? setOpen(false) : null;
    }
  };

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSideBarMenuItems.map((item, index) => (
        <div key={index} className="relative">
          <div
            onClick={() => handleItemClick(item.id, item.path)}
            className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.subItems && (
              <ChevronDown
                className={`transition-transform ${
                  openItemId === item.id ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {/* Render dropdown submenu for inventory */}
          {item.subItems && openItemId === item.id && (
            <div className="ml-6 mt-1 flex-col flex gap-1">
              {item.subItems.map((subItem, subIndex) => (
                <div
                  key={subIndex}
                  onClick={() => {
                    navigate(subItem.path);
                    setOpen ? setOpen(false) : null;
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <span>{subItem.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default MenuItems;
