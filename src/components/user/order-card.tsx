
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelDropIcon, FuelPumpIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Check, Clock, Truck, X } from "lucide-react";
import { useState } from "react";

// Define order status type
export type OrderStatus = "pending" | "accepted" | "declined" | "en_route" | "delivered" | "cancelled";

// Interface for order data
export interface OrderData {
  id: string;
  pumpName: string;
  adminUsername: string;
  fuelType: "petrol" | "diesel";
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  timestamp: string;
  deliveryAddress: string;
}

// Props interface
interface OrderCardProps {
  order: OrderData;
  onCancel?: (orderId: string) => void;
  onFeedback?: (orderId: string) => void;
}

export function OrderCard({ order, onCancel, onFeedback }: OrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-600 hover:bg-amber-100";
      case "accepted":
        return "bg-blue-100 text-blue-600 hover:bg-blue-100";
      case "en_route":
        return "bg-purple-100 text-purple-600 hover:bg-purple-100";
      case "delivered":
        return "bg-green-100 text-green-600 hover:bg-green-100";
      case "declined":
        return "bg-red-100 text-red-600 hover:bg-red-100";
      case "cancelled":
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  // Get status icon
  const StatusIcon = () => {
    switch (order.status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <Check className="h-4 w-4" />;
      case "en_route":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Check className="h-4 w-4" />;
      case "declined":
        return <X className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    if (!onCancel) return;
    
    setIsLoading(true);
    try {
      await onCancel(order.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle feedback
  const handleFeedback = () => {
    if (!onFeedback) return;
    onFeedback(order.id);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FuelPumpIcon className="h-4 w-4 text-fuel-orange" />
            <CardTitle className="text-base font-medium">{order.pumpName}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Order #{order.id.substring(0, 8)}
          </p>
        </div>
        <Badge className={cn("flex items-center gap-1", getStatusColor(order.status))}>
          <StatusIcon />
          <span className="capitalize">{order.status.replace("_", " ")}</span>
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Fuel:</div>
          <div className="flex items-center gap-1 font-medium capitalize">
            <FuelDropIcon className={`h-3 w-3 ${order.fuelType === "petrol" ? "text-fuel-orange" : "text-fuel-blue"}`} />
            {order.fuelType}
          </div>
          
          <div className="text-muted-foreground">Quantity:</div>
          <div className="font-medium">{order.quantity} liters</div>
          
          <div className="text-muted-foreground">Total Amount:</div>
          <div className="font-medium">₹{order.totalAmount.toFixed(2)}</div>
          
          <div className="text-muted-foreground">Ordered on:</div>
          <div className="font-medium">{formatDate(order.timestamp)}</div>
          
          <div className="text-muted-foreground">Delivery Address:</div>
          <div className="font-medium">{order.deliveryAddress}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        {order.status === "pending" && onCancel && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Order"}
          </Button>
        )}
        {order.status === "delivered" && onFeedback && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleFeedback}
          >
            Leave Feedback
          </Button>
        )}
        {(order.status !== "pending" && order.status !== "delivered") && (
          <div className="text-xs text-center text-muted-foreground w-full py-2">
            {order.status === "en_route" ? "Your fuel is on the way!" : 
             order.status === "accepted" ? "Your order has been accepted and will be delivered soon" :
             order.status === "declined" ? "Your order was declined by the petrol pump" :
             order.status === "cancelled" ? "You cancelled this order" : ""}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
