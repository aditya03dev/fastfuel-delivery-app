
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, type OrderFormValues } from "@/lib/validations/order-fuel";

interface OrderFormProps {
  pumps: any[];
  isLoading: boolean;
  selectedPump: any;
  onSubmit: (data: OrderFormValues) => void;
  isPumpsLoading: boolean;
}

export function OrderFuelForm({ pumps, isLoading, selectedPump, onSubmit, isPumpsLoading }: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      pumpId: "",
      fuelType: "petrol",
      quantity: "10",
      deliveryAddress: "",
    },
  });

  return (
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
  );
}
