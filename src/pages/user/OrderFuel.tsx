import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FuelDropIcon } from "@/components/ui/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert,Database } from "@/integrations/supabase/types";
// import type { Database } from './types';


// Mock data - will be replaced with Supabase data
const mockPumps = [
  {
    id: "1",
    pumpName: "Shell Kandivali West",
    adminUsername: "shell_admin",
    petrolPrice: 102.5,
    dieselPrice: 89.3,
  },
  {
    id: "2",
    pumpName: "HP Kandivali East",
    adminUsername: "hp_admin",
    petrolPrice: 101.8,
    dieselPrice: 88.9,
  },
  {
    id: "3",
    pumpName: "Indian Oil Kandivali",
    adminUsername: "ioc_admin",
    petrolPrice: 100.9,
    dieselPrice: 87.5,
  },
];

// Form schema
const orderFormSchema = z.object({
  pumpId: z.string({
    required_error: "Please select a petrol pump",
  }),
  fuelType: z.enum(["petrol", "diesel"], {
    required_error: "Please select a fuel type",
  }),
  quantity: z
    .string()
    .refine(
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
  // const [selectedPump, setSelectedPump] = useState<
  //   (typeof mockPumps)[0] | null
  // >(null);
  const [selectedPump, setSelectedPump] = useState<
  Database["public"]["Tables"]["pump_profiles"]["Row"] | null
>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pumps, setPumps] = useState<
    Database["public"]["Tables"]["pump_profiles"]["Row"][]
  >([]);

  useEffect(() => {
    const fetchPumps = async () => {
      const { data, error } = await supabase.from("pump_profiles").select("*");

      if (error) {
        console.error("Error fetching pumps:", error.message);
        toast.error("Failed to load pumps.");
        return;
      }

      setPumps(data || []);
      // setSelectedPump(data);
      setSelectedPump(data[0] || null);

    };

    fetchPumps();
  }, []);

  // Initialize form
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      pumpId: "",
      fuelType: "petrol",
      quantity: "10",
      deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
    },
  });

  // Handle pump selection
  // const handlePumpChange = (pumpId: string) => {
  //   const pump = mockPumps.find((p) => p.id === pumpId);
  //   setSelectedPump(pump || null);
  // };
  const handlePumpChange = (pumpId: string) => {
    const pump = pumps.find((p) => p.id === pumpId);
    setSelectedPump(pump || null);
  };
  

  // Calculate order total
  const calculateTotal = () => {
    if (!selectedPump) return 0;

    const quantity = Number(form.watch("quantity") || 0);
    const fuelType = form.watch("fuelType");

    const price =
      fuelType === "petrol"
        ? selectedPump.petrol_price
        : selectedPump.diesel_price;

    return price * quantity;
  };

  // Handle form submission
  // const onSubmit = async (data: OrderFormValues) => {
  //   setIsLoading(true);

  //   try {
  //     // Mock API call - will be replaced with Supabase
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // Log order data
  //     console.log("Order data:", {
  //       ...data,
  //       total: calculateTotal(),
  //       timestamp: new Date().toISOString(),
  //       status: "pending",
  //     });

  //     // Show success toast
  //     toast.success("Order placed successfully!");

  //     // Redirect to orders page
  //     navigate("/user/orders");
  //   } catch (error) {
  //     toast.error("Failed to place order. Please try again.");
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data: OrderFormValues) => {
    setIsLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("User not authenticated");
      }

      const orderPayload: TablesInsert<"orders"> = {
        address: data.deliveryAddress ?? "", // required
        fuel_type: data.fuelType ?? "petrol", // required
        quantity: Number(data.quantity) || 0, // required and must be a number
        user_id: userData.user.id,
        status: "pending",
        timestamp: new Date().toISOString(),
        total: calculateTotal(),
        pump_id: selectedPump?.id ?? "",
      };

      const { error } = await supabase.from("orders").insert([orderPayload]);

      if (error) {
        throw error;
      }

      toast.success("Order placed successfully!");
      navigate("/user/orders");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order insert error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Form */}
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* <FormField
                    control={form.control}
                    name="pumpId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Petrol Pump</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            handlePumpChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a petrol pump" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockPumps.map((pump) => (
                              <SelectItem key={pump.id} value={pump.id}>
                                {pump.pumpName} ({pump.adminUsername})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose from registered pumps in Kandivali
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="pumpId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Petrol Pump</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handlePumpChange(value); // This sets selectedPump
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a petrol pump" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pumps.map((pump) => (
                              <SelectItem key={pump.id} value={pump.id}>
                                {pump.pump_name} ({pump.admin_username})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose from registered pumps in Kandivali
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
                              Your delivery address in Kandivali, Mumbai
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

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your fuel order details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPump ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">
                        Petrol Pump:
                      </div>
                      <div className="text-sm font-medium">
                        {selectedPump.pump_name}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Fuel Type:
                      </div>
                      <div className="text-sm font-medium capitalize">
                        {form.watch("fuelType") || "Not selected"}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Quantity:
                      </div>
                      <div className="text-sm font-medium">
                        {form.watch("quantity") || "0"} liters
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Unit Price:
                      </div>
                      <div className="text-sm font-medium">
                        ₹
                        {form.watch("fuelType") === "petrol"
                          ? selectedPump.petrol_price
                          : selectedPump.diesel_price}
                        /L
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Delivery Address:
                      </div>
                      <div className="text-sm font-medium">
                        {form.watch("deliveryAddress")}
                      </div>
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
                      Orders are typically delivered within 30-60 minutes after
                      acceptance. You can track your order status in real-time.
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
