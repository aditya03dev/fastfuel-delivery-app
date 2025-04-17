
import { OrderRequestCard } from "@/components/admin/order-request-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { OrderData, OrderStatus } from "@/components/user/order-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data - will be replaced with Supabase data
const mockOrders: OrderData[] = [
  {
    id: "ord123456789",
    pumpName: "Shell Kandivali West",
    adminUsername: "shell_admin",
    fuelType: "petrol",
    quantity: 10,
    totalAmount: 1025.00,
    status: "pending",
    timestamp: new Date().toISOString(),
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
  {
    id: "ord223456789",
    pumpName: "Shell Kandivali West",
    adminUsername: "shell_admin",
    fuelType: "diesel",
    quantity: 15,
    totalAmount: 1335.00,
    status: "accepted",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
  {
    id: "ord323456789",
    pumpName: "Shell Kandivali West",
    adminUsername: "shell_admin",
    fuelType: "petrol",
    quantity: 5,
    totalAmount: 504.50,
    status: "delivered",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
  {
    id: "ord423456789",
    pumpName: "Shell Kandivali West",
    adminUsername: "shell_admin",
    fuelType: "diesel",
    quantity: 8,
    totalAmount: 714.40,
    status: "declined",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
  {
    id: "ord523456789",
    pumpName: "Shell Kandivali West",
    adminUsername: "shell_admin",
    fuelType: "petrol",
    quantity: 12,
    totalAmount: 1221.60,
    status: "en_route",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
];

const OrderRequests = () => {
  const [orders, setOrders] = useState<OrderData[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter orders by search query
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter orders by status for tabs
  const pendingOrders = filteredOrders.filter(order => order.status === "pending");
  const activeOrders = filteredOrders.filter(order => ["accepted", "en_route"].includes(order.status));
  const completedOrders = filteredOrders.filter(order => order.status === "delivered");
  const cancelledOrders = filteredOrders.filter(order => ["declined", "cancelled"].includes(order.status));

  // Handle accept order
  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Mock API call - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "accepted" } 
            : order
        )
      );
      
      toast.success("Order accepted successfully!");
      return Promise.resolve();
    } catch (error) {
      toast.error("Failed to accept order. Please try again.");
      console.error(error);
      return Promise.reject(error);
    }
  };

  // Handle decline order
  const handleDeclineOrder = async (orderId: string) => {
    try {
      // Mock API call - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "declined" } 
            : order
        )
      );
      
      toast.success("Order declined successfully!");
      return Promise.resolve();
    } catch (error) {
      toast.error("Failed to decline order. Please try again.");
      console.error(error);
      return Promise.reject(error);
    }
  };

  // Handle update order status
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // Mock API call - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status } 
            : order
        )
      );
      
      toast.success(`Order marked as ${status.replace("_", " ")}!`);
      return Promise.resolve();
    } catch (error) {
      toast.error("Failed to update order status. Please try again.");
      console.error(error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order Requests</h1>
            <p className="text-muted-foreground">
              Manage fuel delivery orders from customers
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders by ID or address..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="pending">
                Pending ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledOrders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-6">
              {pendingOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pendingOrders.map(order => (
                    <OrderRequestCard
                      key={order.id}
                      order={order}
                      onAccept={handleAcceptOrder}
                      onDecline={handleDeclineOrder}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No pending orders found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              {activeOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeOrders.map(order => (
                    <OrderRequestCard
                      key={order.id}
                      order={order}
                      onAccept={handleAcceptOrder}
                      onDecline={handleDeclineOrder}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No active orders found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              {completedOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {completedOrders.map(order => (
                    <OrderRequestCard
                      key={order.id}
                      order={order}
                      onAccept={handleAcceptOrder}
                      onDecline={handleDeclineOrder}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No completed orders found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-6">
              {cancelledOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {cancelledOrders.map(order => (
                    <OrderRequestCard
                      key={order.id}
                      order={order}
                      onAccept={handleAcceptOrder}
                      onDecline={handleDeclineOrder}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No cancelled orders found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderRequests;
