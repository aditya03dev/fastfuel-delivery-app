import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ManagePricesForm } from "@/components/admin/manage-prices-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FuelDropIcon, FuelPumpIcon } from "@/components/ui/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Mock data - will be replaced with Supabase data
const mockAdminData = {
  pumpName: "Shell Kandivali West",
  adminUsername: "shell_admin",
  prices: {
    petrolPrice: 102.5,
    dieselPrice: 89.3,
  },
  stats: {
    totalOrders: 47,
    pendingOrders: 3,
    completedOrders: 42,
    cancelledOrders: 2,
    totalRevenue: 48250.75,
    averageRating: 4.2,
  },
  recentSales: [
    { day: "Mon", petrol: 120, diesel: 90 },
    { day: "Tue", petrol: 150, diesel: 110 },
    { day: "Wed", petrol: 135, diesel: 95 },
    { day: "Thu", petrol: 180, diesel: 120 },
    { day: "Fri", petrol: 195, diesel: 135 },
    { day: "Sat", petrol: 210, diesel: 150 },
    { day: "Sun", petrol: 170, diesel: 105 },
  ],
};

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(mockAdminData);
  const [prices, setPrices] = useState(0);
  const [diesel, setDiesal] = useState(0);
  const [pump_name, setPump_name] = useState("");

  const fetchPrice = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    console.log("id", userId);

    const { data: pumpData, error: pumpError } = await supabase
      .from("pump_profiles")
      .select("*") // 'id' is the pump_id
      .eq("user_id", userId)
      .single(); // Expect only one pump per admin

    if (pumpError || !pumpData) {
      console.error("Failed to fetch pump for admin:", pumpError);
      return;
    }

    const pumpId = pumpData.id;
    console.log("pump", pumpData);

    // console.log("Orders data:", ordersData);
    setDiesal(pumpData.diesel_price);
    setPrices(pumpData.petrol_price);
    setPump_name(pumpData.pump_name);
  };
  useEffect(() => {
    fetchPrice();
  }, []);
  // Handle price updates
  const handleUpdatePrices = async (prices: {
    petrolPrice: number;
    dieselPrice: number;
  }) => {
    try {
      // Mock API call - will be replaced with Supabase
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      console.log("id", userId);
      const { error } = await supabase
        .from("pump_profiles")
        .update({
          petrol_price: prices.petrolPrice,
          diesel_price: prices.dieselPrice,
        })
        .eq("user_id", userId);

      setPrices(prices.petrolPrice);
      setDiesal(prices.dieselPrice);
      // Update local state
      setAdminData((prev) => ({
        ...prev,
        prices,
      }));

      return Promise.resolve();
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {pump_name} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your fuel delivery services
            </p>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(adminData.stats.totalOrders * 0.15)} from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 3h5v5" />
                  <path d="M4 20l16-16" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{adminData.stats.totalRevenue.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">
                  +₹{Math.floor(adminData.stats.totalRevenue * 0.12).toLocaleString('en-IN')} from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Requires your action
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.stats.averageRating.toFixed(1)}/5</div>
                <p className="text-xs text-muted-foreground">
                  Based on {adminData.stats.completedOrders} ratings
                </p>
              </CardContent>
            </Card>
          </div>
           */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Manage Prices */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FuelDropIcon className="h-6 w-6 text-fuel-orange" />
                  <CardTitle>Manage Fuel Prices</CardTitle>
                </div>
                <CardDescription>
                  Update your petrol and diesel prices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManagePricesForm
                  currentPrices={{ petrolPrice: prices, dieselPrice: diesel }}
                  onUpdatePrices={handleUpdatePrices}
                />
              </CardContent>
            </Card>

            {/* Sales Chart */}
            {/* <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FuelPumpIcon className="h-6 w-6 text-fuel-blue" />
                  <CardTitle>Weekly Sales Overview</CardTitle>
                </div>
                <CardDescription>
                  Fuel sales for the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={adminData.recentSales}
                    margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} liters`, undefined]}
                      labelFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="petrol" name="Petrol" barSize={30}>
                      {adminData.recentSales.map((entry, index) => (
                        <Cell key={`petrol-${index}`} fill="#f97316" />
                      ))}
                    </Bar>
                    <Bar dataKey="diesel" name="Diesel" barSize={30}>
                      {adminData.recentSales.map((entry, index) => (
                        <Cell key={`diesel-${index}`} fill="#0056b3" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
