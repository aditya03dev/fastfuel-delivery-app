
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryTruckIcon, FuelDropIcon, FuelPumpIcon } from "@/components/ui/icons";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-sky-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-fuel-blue-dark sm:text-5xl">
                  Fast<span className="text-fuel-orange">Fuel</span>
                </h1>
                <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
                  On-demand fuel delivery right to your doorstep in Kandivali, Mumbai.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/user/login">
                  <Button size="lg" className="bg-fuel-blue hover:bg-fuel-blue-dark">
                    <DeliveryTruckIcon className="mr-2 h-5 w-5" />
                    I need fuel
                  </Button>
                </Link>
                <Link to="/admin/login">
                  <Button size="lg" variant="outline" className="border-fuel-orange text-fuel-orange hover:bg-fuel-orange hover:text-white">
                    <FuelPumpIcon className="mr-2 h-5 w-5" />
                    I'm a petrol pump admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-3">
              <Card className="border-2 border-fuel-blue/10 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <FuelPumpIcon className="h-12 w-12 text-fuel-blue mb-2" />
                  <CardTitle className="text-fuel-blue">Petrol &amp; Diesel Delivery</CardTitle>
                  <CardDescription>
                    Get fuel delivered from your favorite local pumps in Kandivali.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Select a registered petrol pump, choose fuel type and quantity, and we'll deliver it to your location.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-fuel-orange/10 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <DeliveryTruckIcon className="h-12 w-12 text-fuel-orange mb-2" />
                  <CardTitle className="text-fuel-orange">Real-Time Tracking</CardTitle>
                  <CardDescription>
                    Track your delivery in real-time from acceptance to delivery.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Watch as your order status updates in real-time, so you know exactly when your fuel will arrive.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-fuel-green/10 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <FuelDropIcon className="h-12 w-12 text-fuel-green mb-2" />
                  <CardTitle className="text-fuel-green">Secure Payments</CardTitle>
                  <CardDescription>
                    Pay securely after your fuel has been delivered.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Pay with various payment methods after your fuel has been delivered to ensure a secure transaction.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-fuel-blue-dark text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to get started?
                </h2>
                <p className="mx-auto max-w-[42rem] text-muted-foreground text-white/80">
                  Choose your role and sign up to enjoy our fuel delivery service.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/role-selection">
                  <Button size="lg" className="bg-white text-fuel-blue-dark hover:bg-gray-100">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
