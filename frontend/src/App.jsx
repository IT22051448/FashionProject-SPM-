import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthSignup from "./pages/auth/singup";
import AdminLayout from "./layouts/admin/layout";
import AdminDashboard from "./pages/admin/dashboard/dashboard";
import AdminProducts from "./pages/admin/products/products";
import AdminOrders from "./pages/admin/orders/orders";
import NotFound from "./pages/not-found/notfound";
import CustomerLayout from "./layouts/customer/layout";
import ShoppingHome from "./pages/customer/home/home";

import LoyaltySignUp from "./pages/customer/loyalty/LoyaltyCustomers";
import LoyaltyReferral from "./pages/customer/loyalty/LoyaltyFriendReferal";
import LoyaltyMember from "./pages/customer/loyalty/LoyaltyMember";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="signup" element={<AuthSignup />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
        <Route path="/shop" element={<CustomerLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="loyaltySignUp" element={<LoyaltySignUp />} />
          <Route path="LoyaltyReferral" element={<LoyaltyReferral />} />
          <Route path="LoyaltyMember" element={<LoyaltyMember />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
