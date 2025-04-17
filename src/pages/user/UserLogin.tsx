
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryTruckIcon } from "@/components/ui/icons";
import { Link } from "react-router-dom";

const UserLogin = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <DeliveryTruckIcon className="h-12 w-12 text-fuel-blue mb-2" />
          </div>
          <CardTitle className="text-2xl text-fuel-blue">User Login</CardTitle>
          <CardDescription>
            Log in to your account to order fuel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm userType="user" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/user/signup" className="text-fuel-blue underline">
              Sign Up
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Are you a petrol pump admin?{" "}
            <Link to="/admin/login" className="text-fuel-orange underline">
              Admin Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserLogin;
