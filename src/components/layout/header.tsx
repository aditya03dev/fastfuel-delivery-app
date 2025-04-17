
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FuelPumpIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, userRole, signOut, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Skip showing header on initial role selection page
  if (location.pathname === "/" && !user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <FuelPumpIcon className="h-6 w-6 text-fuel-orange" />
          <span className="text-xl font-bold text-fuel-blue-dark">FastFuel</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            {userRole === "user" ? (
              <nav className="hidden md:flex gap-6">
                <Link 
                  to="/user/order" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-fuel-blue",
                    location.pathname === "/user/order" ? "text-fuel-blue underline underline-offset-4" : "text-muted-foreground"
                  )}
                >
                  Order Fuel
                </Link>
                <Link 
                  to="/user/orders" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-fuel-blue",
                    location.pathname === "/user/orders" ? "text-fuel-blue underline underline-offset-4" : "text-muted-foreground"
                  )}
                >
                  My Orders
                </Link>
              </nav>
            ) : (
              <nav className="hidden md:flex gap-6">
                <Link 
                  to="/admin/dashboard" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-fuel-blue",
                    location.pathname === "/admin/dashboard" ? "text-fuel-blue underline underline-offset-4" : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/orders" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-fuel-blue",
                    location.pathname === "/admin/orders" ? "text-fuel-blue underline underline-offset-4" : "text-muted-foreground"
                  )}
                >
                  Order Requests
                </Link>
                <Link 
                  to="/admin/users" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-fuel-blue",
                    location.pathname === "/admin/users" ? "text-fuel-blue underline underline-offset-4" : "text-muted-foreground"
                  )}
                >
                  User Management
                </Link>
                <Link 
                  to="/admin/feedback" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-fuel-blue",
                    location.pathname === "/admin/feedback" ? "text-fuel-blue underline underline-offset-4" : "text-muted-foreground"
                  )}
                >
                  Feedback
                </Link>
              </nav>
            )}

            {/* User dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">
                      {userRole === "user" ? "User Account" : "Admin Account"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={userRole === "user" ? "/user/profile" : "/admin/profile"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive flex cursor-pointer items-center"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile menu button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 md:hidden">
                {userRole === "user" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/user/order">Order Fuel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/orders">My Orders</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/orders">Order Requests</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/users">User Management</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/feedback">Feedback</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/role-selection">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/role-selection">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
