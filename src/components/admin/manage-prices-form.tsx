
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

// Form schema
const priceFormSchema = z.object({
  petrolPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Petrol price must be greater than 0.",
  }),
  dieselPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Diesel price must be greater than 0.",
  }),
});

type PriceFormValues = z.infer<typeof priceFormSchema>;

interface ManagePricesFormProps {
  currentPrices: {
    petrolPrice: number;
    dieselPrice: number;
  };
  onUpdatePrices: (prices: { petrolPrice: number; dieselPrice: number }) => Promise<void>;
}

export function ManagePricesForm({ currentPrices, onUpdatePrices }: ManagePricesFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Create form
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      petrolPrice: currentPrices.petrolPrice.toString(),
      dieselPrice: currentPrices.dieselPrice.toString(),
    },
  });
  React.useEffect(() => {
    form.reset({
      petrolPrice: currentPrices.petrolPrice.toString(),
      dieselPrice: currentPrices.dieselPrice.toString(),
    });
  }, [currentPrices]);
  // Handle form submission
  async function onSubmit(values: PriceFormValues) {
    setIsLoading(true);
    
    try {
      await onUpdatePrices({
        petrolPrice: Number(values.petrolPrice),
        dieselPrice: Number(values.dieselPrice),
      });
      
      toast.success("Fuel prices updated successfully!");
    } catch (error) {
      toast.error("Failed to update prices. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="petrolPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Petrol Price (₹/L)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  step="0.01" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Current market price is around ₹100-105 per liter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dieselPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diesel Price (₹/L)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  step="0.01" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Current market price is around ₹87-92 per liter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Prices"}
        </Button>
      </form>
    </Form>
  );
}
