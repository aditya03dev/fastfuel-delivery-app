
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";
import UserSignup from "./pages/user/UserSignup";
import UserLogin from "./pages/user/UserLogin";
import OrderFuel from "./pages/user/OrderFuel";
import MyOrders from "./pages/user/MyOrders";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrderRequests from "./pages/admin/OrderRequests";
import UserManagement from "./pages/admin/UserManagement";
// import ViewFeedback from "./pages/admin/ViewFeedback";
import { Footer } from "./components/layout/footer";
import { AuthProvider } from "./contexts/AuthContext";
import UserProfile from "./pages/user/UserProfilePage";
import AdminProfile from "./pages/admin/AdminProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Index />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            
            {/* User Routes */}
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/order" element={<OrderFuel />} />
            <Route path="/user/orders" element={<MyOrders />} />
            <Route path="/user/profile" element={<UserProfile />} />

            
            {/* Admin Routes */}
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<OrderRequests />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/profile" element={<AdminProfile />} />

            {/* <Route path="/admin/feedback" element={<ViewFeedback />} /> */}
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
