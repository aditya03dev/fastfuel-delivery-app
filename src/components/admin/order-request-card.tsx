
import { OrderData, OrderStatus } from "@/components/user/order-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelDropIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Clock, Truck } from "lucide-react";
import { useState } from "react";

// Props interface
interface OrderRequestCardProps {
  order: OrderData;
  onAccept: (orderId: string) => Promise<void>;
  onDecline: (orderId: string) => Promise<void>;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export function OrderRequestCard({ 
  order, 
  onAccept, 
  onDecline, 
  onUpdateStatus 
}: OrderRequestCardProps) {
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
      case "en route":
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

  // Handle accept order
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(order.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle decline order
  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await onDecline(order.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mark as en route
  const handleMarkEnRoute = async () => {
    setIsLoading(true);
    try {
      await onUpdateStatus(order.id, "en route");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mark as delivered
  const handleMarkDelivered = async () => {
    setIsLoading(true);
    try {
      await onUpdateStatus(order.id, "delivered");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Order #{order.id.substring(0, 8)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.timestamp)}
          </p>
        </div>
        <Badge className={cn("flex items-center gap-1", getStatusColor(order.status))}>
          {order.status === "pending" && <Clock className="h-4 w-4" />}
          {order.status === "en route" && <Truck className="h-4 w-4" />}
          <span className="capitalize">{order.status.replace("_", " ")}</span>
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Customer:</div>
          <div className="font-medium">User #{order.id.substring(8, 12)}</div>
          
          <div className="text-muted-foreground">Fuel:</div>
          <div className="flex items-center gap-1 font-medium capitalize">
            <FuelDropIcon className={`h-3 w-3 ${order.fuelType === "petrol" ? "text-fuel-orange" : "text-fuel-blue"}`} />
            {order.fuelType}
          </div>
          
          <div className="text-muted-foreground">Quantity:</div>
          <div className="font-medium">{order.quantity} liters</div>
          
          <div className="text-muted-foreground">Total Amount:</div>
          <div className="font-medium">₹{order.totalAmount.toFixed(2)}</div>
          
          <div className="text-muted-foreground">Delivery Address:</div>
          <div className="font-medium">{order.deliveryAddress}</div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {order.status === "pending" && (
          <>
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={handleAccept}
              disabled={isLoading}
            >
              Accept
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleDecline}
              disabled={isLoading}
            >
              Decline
            </Button>
          </>
        )}
        
        {order.status === "accepted" && (
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={handleMarkEnRoute}
            disabled={isLoading}
          >
            Mark as En Route
          </Button>
        )}
        
        {order.status === "en route" && (
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={handleMarkDelivered}
            disabled={isLoading}
          >
            Mark as Delivered
          </Button>
        )}
        
        {(order.status === "delivered" || order.status === "declined" || order.status === "cancelled") && (
          <p className="text-xs text-center text-muted-foreground w-full py-2">
            {order.status === "delivered" ? "Order completed" : 
             order.status === "declined" ? "You declined this order" :
             "Customer cancelled this order"}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
