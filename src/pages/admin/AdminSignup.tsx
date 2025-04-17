
import { AdminSignupForm } from "@/components/auth/admin-signup-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelPumpIcon } from "@/components/ui/icons";
import { Link } from "react-router-dom";

const AdminSignup = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <FuelPumpIcon className="h-12 w-12 text-fuel-orange mb-2" />
          </div>
          <CardTitle className="text-2xl text-fuel-orange">Register Petrol Pump</CardTitle>
          <CardDescription>
            Register your petrol pump to provide fuel delivery services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminSignupForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already registered your pump?{" "}
            <Link to="/admin/login" className="text-fuel-orange underline">
              Log In
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Are you a user looking for fuel?{" "}
            <Link to="/user/signup" className="text-fuel-blue underline">
              Create User Account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSignup;
