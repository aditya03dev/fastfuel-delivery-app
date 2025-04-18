
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelDropIcon } from "@/components/ui/icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { OrderFuelForm } from "@/components/user/order-fuel-form";
import { OrderSummary } from "@/components/user/order-summary";
import type { OrderFormValues } from "@/lib/validations/order-fuel";

const OrderFuel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<OrderFormValues>({
    pumpId: "",
    fuelType: "petrol",
    quantity: "10",
    deliveryAddress: "",
  });

  // Fetch available pumps
  const { data: pumps = [], isLoading: isPumpsLoading } = useQuery({
    queryKey: ['pumps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pump_profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Get selected pump details
  const selectedPump = pumps.find((p) => p.id === formValues.pumpId);
  
  // Handle form submission
  const onSubmit = async (data: OrderFormValues) => {
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    setIsLoading(true);
    setFormValues(data);
    
    try {
      const total = selectedPump ? 
        (data.fuelType === "petrol" ? selectedPump.petrol_price : selectedPump.diesel_price) * 
        Number(data.quantity) : 0;

      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          pump_id: data.pumpId,
          fuel_type: data.fuelType,
          quantity: Number(data.quantity),
          total_amount: total,
          status: 'pending',
          delivery_address: data.deliveryAddress,
        });

      if (error) throw error;
      
      toast.success("Order placed successfully!");
      navigate("/user/orders");
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FuelDropIcon className="h-6 w-6 text-fuel-blue" />
                <CardTitle>Order Fuel</CardTitle>
              </div>
              <CardDescription>
                Select a petrol pump, fuel type, and quantity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderFuelForm
                pumps={pumps}
                isLoading={isLoading}
                selectedPump={selectedPump}
                onSubmit={onSubmit}
                isPumpsLoading={isPumpsLoading}
              />
            </CardContent>
          </Card>

          <OrderSummary
            selectedPump={selectedPump}
            formValues={formValues}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderFuel;
