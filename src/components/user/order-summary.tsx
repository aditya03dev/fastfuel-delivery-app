
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderSummaryProps {
  selectedPump: any;
  formValues: {
    fuelType: "petrol" | "diesel";
    quantity: string;
    deliveryAddress: string;
  };
}

export function OrderSummary({ selectedPump, formValues }: OrderSummaryProps) {
  const calculateTotal = () => {
    if (!selectedPump) return 0;
    
    const quantity = Number(formValues.quantity || 0);
    const price = formValues.fuelType === "petrol" 
      ? selectedPump.petrol_price 
      : selectedPump.diesel_price;
      
    return price * quantity;
  };

  return (
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
                {formValues.fuelType || "Not selected"}
              </div>
              
              <div className="text-sm text-muted-foreground">Quantity:</div>
              <div className="text-sm font-medium">
                {formValues.quantity || "0"} liters
              </div>
              
              <div className="text-sm text-muted-foreground">Unit Price:</div>
              <div className="text-sm font-medium">
                ₹{formValues.fuelType === "petrol" 
                  ? selectedPump.petrol_price 
                  : selectedPump.diesel_price}/L
              </div>
              
              <div className="text-sm text-muted-foreground">Delivery Address:</div>
              <div className="text-sm font-medium">{formValues.deliveryAddress}</div>
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
    </Card>
  );
}
