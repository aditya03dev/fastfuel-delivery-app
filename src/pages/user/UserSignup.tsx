
import { UserSignupForm } from "@/components/auth/user-signup-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryTruckIcon } from "@/components/ui/icons";
import { Link } from "react-router-dom";

const UserSignup = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <DeliveryTruckIcon className="h-12 w-12 text-fuel-blue mb-2" />
          </div>
          <CardTitle className="text-2xl text-fuel-blue">Create a User Account</CardTitle>
          <CardDescription>
            Enter your details to create an account and order fuel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserSignupForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/user/login" className="text-fuel-blue underline">
              Log In
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Are you a petrol pump admin?{" "}
            <Link to="/admin/signup" className="text-fuel-orange underline">
              Register your pump
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserSignup;
