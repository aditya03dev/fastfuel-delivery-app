
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FeedbackForm } from "@/components/user/feedback-form";
import { OrderCard, OrderData } from "@/components/user/order-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useState,useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";


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
    pumpName: "HP Kandivali East",
    adminUsername: "hp_admin",
    fuelType: "diesel",
    quantity: 15,
    totalAmount: 1335.00,
    status: "accepted",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
  {
    id: "ord323456789",
    pumpName: "Indian Oil Kandivali",
    adminUsername: "ioc_admin",
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
    pumpName: "HP Kandivali East",
    adminUsername: "hp_admin",
    fuelType: "petrol",
    quantity: 12,
    totalAmount: 1221.60,
    status: "en route",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
];

const MyOrders = () => {
  const [orders, setOrders] = useState<OrderData[]>(mockOrders);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackPumpName, setFeedbackPumpName] = useState<string>("");
  useEffect(() => {
    fetchOrders();
  }, []);

  // const fetchOrders = async () => {
  //   const user = supabase.auth.getUser();

  //   const { data, error } = await supabase
  //     .from("orders")
  //     .select(`
  //       id,
  //       fuel_type,
  //       quantity,
  //       total,
  //       status,
  //       timestamp,
  //       address,
  //       pump_profiles (
  //         pump_name,
  //         admin_username
  //       )
  //     `)
  //     .eq("user_id", (await user).data.user?.id) // fetch only for current user
  //     .order("timestamp", { ascending: false });

  //   if (error) {
  //     toast.error("Failed to fetch orders.");
  //     console.error("Supabase fetch error:", error);
  //     return;
  //   }

  //   const mappedOrders: OrderData[] = (data || []).map((order: any) => ({
  //     id: order.id,
  //     fuelType: order.fuel_type,
  //     quantity: order.quantity,
  //     totalAmount: order.total,
  //     status: order.status,
  //     timestamp: order.timestamp,
  //     deliveryAddress: order.address,
  //     pumpName: order.pump_profiles?.pump_name ?? "Unknown Pump",
  //     adminUsername: order.pump_profiles?.admin_username ?? "unknown_admin",
  //   }));

  //   setOrders(mappedOrders);
  //   console.log('map',mappedOrders);
  // };
  // Helper function to find order by ID
  const fetchOrders = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    console.log('id',userId);
  
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });
  
    if (error) {
      toast.error("Failed to fetch orders.");
      console.error("Supabase fetch error:", error.message);
      return;
    }
  
    console.log("Orders data:", data);
    const mappedOrders: OrderData[] = (data || []).map((order: any) => ({
      id: order.id,
      fuelType: order.fuel_type,
      quantity: order.quantity,
      totalAmount: order.total,
      status: order.status,
      timestamp: order.timestamp,
      deliveryAddress: order.address,
      pumpName: order.pump_profiles?.pump_name ?? "Unknown Pump",
      adminUsername: order.pump_profiles?.admin_username ?? "Unknown Admin",
    }));

    // Update the state with the mapped orders
    setOrders(mappedOrders);
  };
  
  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      // Mock API call - will be replaced with Supabase
      // await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('order',orderId);
      const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);
      
      if (error) {
        throw error;
      }
  
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "cancelled" } 
            : order
        )
      );
      
      toast.success("Order cancelled successfully!");
    } catch (error) {
      toast.error("Failed to cancel order. Please try again.");
      console.error(error);
    }
  };

  // Handle feedback dialog
  const handleFeedbackClick = (orderId: string) => {
    const order = getOrderById(orderId);
    if (order) {
      setFeedbackOrderId(orderId);
      setFeedbackPumpName(order.pumpName);
    }
  };

  // Close feedback dialog
  const closeFeedbackDialog = () => {
    setFeedbackOrderId(null);
  };

  // Filter orders by status for tabs
  const activeOrders = orders.filter(order => 
    ["pending", "accepted", "en route"].includes(order.status)
  );
  
  const completedOrders = orders.filter(order => 
    ["delivered"].includes(order.status)
  );
  
  const cancelledOrders = orders.filter(order => 
    ["declined", "cancelled"].includes(order.status)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your fuel orders
            </p>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
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
            
            <TabsContent value="active" className="mt-6">
              {activeOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancel={order.status === "pending" ? handleCancelOrder : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>You don't have any active orders</p>
                  <Button className="mt-4" asChild>
                    <a href="/user/order">Order Fuel Now</a>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              {completedOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {completedOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onFeedback={handleFeedbackClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>You don't have any completed orders</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-6">
              {cancelledOrders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {cancelledOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>You don't have any cancelled orders</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Feedback Dialog */}
        <Dialog open={!!feedbackOrderId} onOpenChange={() => closeFeedbackDialog()}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Leave Feedback</DialogTitle>
            </DialogHeader>
            {feedbackOrderId && (
              <FeedbackForm
                orderId={feedbackOrderId}
                pumpName={feedbackPumpName}
                onSubmitComplete={closeFeedbackDialog}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
