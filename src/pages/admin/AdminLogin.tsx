
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelPumpIcon } from "@/components/ui/icons";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <FuelPumpIcon className="h-12 w-12 text-fuel-orange mb-2" />
          </div>
          <CardTitle className="text-2xl text-fuel-orange">Petrol Pump Admin Login</CardTitle>
          <CardDescription>
            Log in to manage your fuel delivery services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm userType="admin" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Haven't registered your pump yet?{" "}
            <Link to="/admin/signup" className="text-fuel-orange underline">
              Register Now
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Are you a user looking for fuel?{" "}
            <Link to="/user/login" className="text-fuel-blue underline">
              User Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
