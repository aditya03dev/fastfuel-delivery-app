
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryTruckIcon, FuelPumpIcon } from "@/components/ui/icons";
import { Link } from "react-router-dom";

const RoleSelection = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <div className="grid gap-6 md:grid-cols-2 md:gap-12 max-w-5xl w-full">
        <Card className="border-2 border-fuel-blue/20 transition-all hover:border-fuel-blue hover:shadow-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <DeliveryTruckIcon className="h-16 w-16 text-fuel-blue" />
            </div>
            <CardTitle className="text-2xl text-fuel-blue">I'm a User</CardTitle>
            <CardDescription>
              Order fuel to be delivered to your location in Kandivali
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Find the nearest petrol pump, order fuel, and get it delivered straight to your doorstep.</p>
            <ul className="space-y-2 text-left list-disc list-inside">
              <li>Select from local registered petrol pumps</li>
              <li>Choose petrol or diesel with your required quantity</li>
              <li>Track your delivery in real-time</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="space-y-3 w-full">
              <Link to="/user/signup" className="w-full">
                <Button size="lg" className="w-full bg-fuel-blue hover:bg-fuel-blue-dark">Sign Up as User</Button>
              </Link>
              <Link to="/user/login" className="w-full">
                <Button size="lg" variant="outline" className="w-full">Log In as User</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="border-2 border-fuel-orange/20 transition-all hover:border-fuel-orange hover:shadow-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <FuelPumpIcon className="h-16 w-16 text-fuel-orange" />
            </div>
            <CardTitle className="text-2xl text-fuel-orange">I'm a Petrol Pump Admin</CardTitle>
            <CardDescription>
              Register your petrol pump and manage fuel delivery services
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Register your petrol pump, manage prices, accept orders, and grow your business with FastFuel.</p>
            <ul className="space-y-2 text-left list-disc list-inside">
              <li>Register your Kandivali petrol pump with a unique name</li>
              <li>Set and update your fuel prices</li>
              <li>Manage incoming order requests</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="space-y-3 w-full">
              <Link to="/admin/signup" className="w-full">
                <Button size="lg" className="w-full bg-fuel-orange hover:bg-fuel-orange-dark">Sign Up as Admin</Button>
              </Link>
              <Link to="/admin/login" className="w-full">
                <Button size="lg" variant="outline" className="w-full">Log In as Admin</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
