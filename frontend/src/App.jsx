import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthSignup from "./pages/auth/signup";
import AdminLayout from "./layouts/admin/layout";
import AdminDashboard from "./pages/admin/dashboard/dashboard";
import AdminProducts from "./pages/admin/products/products";
import AdminOrders from "./pages/admin/orders/orders";
import NotFound from "./pages/not-found/notfound";
import CustomerLayout from "./layouts/customer/layout";
import ShoppingHome from "./pages/customer/home/home";
import Profile from "./pages/customer/profile/profile";
import UnAuthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";
import { useSelector } from "react-redux";
import ShoppingCheckout from "./pages/customer/checkout/checkout";
import ShoppingListing from "./pages/customer/listing/listing";

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  console.log(user);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/signup" />} />

        <Route
          path="/auth"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="signup" element={<AuthSignup />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <CustomerLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauth-page" element={<UnAuthPage />} />
      </Routes>
    </>
  );
}

export default App;
