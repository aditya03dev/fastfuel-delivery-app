import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FuelDropIcon } from "@/components/ui/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// Form schema
const orderFormSchema = z.object({
  pumpId: z.string({
    required_error: "Please select a petrol pump",
  }),
  fuelType: z.enum(["petrol", "diesel"], {
    required_error: "Please select a fuel type",
  }),
  quantity: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100,
    {
      message: "Quantity must be between 1 and 100 liters",
    }
  ),
  deliveryAddress: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const OrderFuel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      pumpId: "",
      fuelType: "petrol",
      quantity: "10",
      deliveryAddress: "",
    },
  });
  
  // Get selected pump details
  const selectedPump = pumps.find((p) => p.id === form.watch("pumpId"));
  
  // Calculate order total
  const calculateTotal = () => {
    if (!selectedPump) return 0;
    
    const quantity = Number(form.watch("quantity") || 0);
    const fuelType = form.watch("fuelType");
    
    const price = fuelType === "petrol" 
      ? selectedPump.petrol_price 
      : selectedPump.diesel_price;
      
    return price * quantity;
  };
  
  // Handle form submission
  const onSubmit = async (data: OrderFormValues) => {
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          pump_id: data.pumpId,
          fuel_type: data.fuelType,
          quantity: Number(data.quantity),
          total_amount: calculateTotal(),
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="pumpId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Petrol Pump</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a petrol pump" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isPumpsLoading ? (
                              <SelectItem value="">Loading pumps...</SelectItem>
                            ) : pumps.length === 0 ? (
                              <SelectItem value="">No pumps available</SelectItem>
                            ) : (
                              pumps.map((pump) => (
                                <SelectItem key={pump.id} value={pump.id}>
                                  {pump.pump_name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose from registered pumps in your area
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedPump && (
                    <>
                      <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Fuel Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="petrol" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Petrol (₹{selectedPump.petrol_price}/L)
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="diesel" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Diesel (₹{selectedPump.diesel_price}/L)
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity (Liters)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="100" 
                                step="1" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Enter quantity between 1 and 100 liters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Your delivery address
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {selectedPump && (
                    <Button 
                      type="submit" 
                      className="w-full bg-fuel-blue hover:bg-fuel-blue-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Place Order"}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your fuel order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPump ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Petrol Pump:</div>
                      <div className="text-sm font-medium">{selectedPump.pump_name}</div>
                      
                      <div className="text-sm text-muted-foreground">Fuel Type:</div>
                      <div className="text-sm font-medium capitalize">
                        {form.watch("fuelType") || "Not selected"}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">Quantity:</div>
                      <div className="text-sm font-medium">
                        {form.watch("quantity") || "0"} liters
                      </div>
                      
                      <div className="text-sm text-muted-foreground">Unit Price:</div>
                      <div className="text-sm font-medium">
                        ₹{form.watch("fuelType") === "petrol" 
                          ? selectedPump.petrol_price 
                          : selectedPump.diesel_price}/L
                      </div>
                      
                      <div className="text-sm text-muted-foreground">Delivery Address:</div>
                      <div className="text-sm font-medium">{form.watch("deliveryAddress")}</div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span className="text-fuel-blue">
                          ₹{calculateTotal().toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Payment will be collected upon delivery
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Select a petrol pump to see order summary</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full rounded-md bg-muted p-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-sky-100 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-fuel-blue"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Orders are typically delivered within 30-60 minutes after acceptance.
                      You can track your order status in real-time.
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderFuel;
