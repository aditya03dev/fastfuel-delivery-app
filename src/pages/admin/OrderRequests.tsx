import { OrderRequestCard } from "@/components/admin/order-request-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { OrderData, OrderStatus } from "@/components/user/order-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Mock data - will be replaced with Supabase data
const mockOrders: OrderData[] = [
  {
    id: "ord123456789",
    pumpName: "Shell Kandivali West",
    adminUsername: "shell_admin",
    fuelType: "petrol",
    quantity: 10,
    totalAmount: 1025.0,
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
    totalAmount: 1335.0,
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
    totalAmount: 504.5,
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
    totalAmount: 714.4,
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
    totalAmount: 1221.6,
    status: "en route",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
  },
];

const OrderRequests = () => {
  const [orders, setOrders] = useState<OrderData[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");

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
    console.log("id", userId);

    const { data: pumpData, error: pumpError } = await supabase
      .from("pump_profiles")
      .select("id") // 'id' is the pump_id
      .eq("user_id", userId)
      .single(); // Expect only one pump per admin

    if (pumpError || !pumpData) {
      console.error("Failed to fetch pump for admin:", pumpError);
      return;
    }

    const pumpId = pumpData.id;
    console.log("pump", pumpId);

    // Fetch orders for admin based on user_id and pump_id
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("pump_id", pumpId) // Force the type to UUID
      .order("timestamp", { ascending: false });

    if (ordersError) {
      console.error("Failed to fetch orders:", ordersError);
      return;
    }
    if (ordersError) {
      toast.error("Failed to fetch orders.");
      console.error("Supabase fetch error:", ordersError.message);
      return;
    }

    console.log("Orders data:", ordersData);
    const mappedOrders: OrderData[] = (ordersData || []).map((order: any) => ({
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

  // Filter orders by search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter orders by status for tabs
  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "pending"
  );
  const activeOrders = filteredOrders.filter((order) =>
    ["accepted", "en route"].includes(order.status)
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "delivered"
  );
  const cancelledOrders = filteredOrders.filter((order) =>
    ["declined", "cancelled"].includes(order.status)
  );

  // Handle accept order
  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Mock API call - will be replaced with Supabase
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // // Update local state
      // setOrders(prevOrders =>
      //   prevOrders.map(order =>
      //     order.id === orderId
      //       ? { ...order, status: "accepted" }
      //       : order
      //   )
      // );

      // toast.success("Order accepted successfully!");
      const { error } = await supabase
        .from("orders")
        .update({ status: "accepted" })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "accepted" } : order
        )
      );

      toast.success("Order accepted successfully!");
      // return Promise.resolve();
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
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const { error } = await supabase
      .from("orders")
      .update({ status: "declined" })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    // Update local state
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "declined" } : order
      )
    );

    toast.success("Order accepted successfully!");

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "declined" } : order
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
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const { error } = await supabase
        .from("orders")
        .update({ status: status })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      // Update local state
      // setOrders((prevOrders) =>
      //   prevOrders.map((order) =>
      //     order.id === orderId ? { ...order, status: "accepted" } : order
      //   )
      // );

      // toast.success("Order accepted successfully!");

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
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
            <h1 className="text-2xl font-bold tracking-tight">
              Order Requests
            </h1>
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
                  {pendingOrders.map((order) => (
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
                  {activeOrders.map((order) => (
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
                  {completedOrders.map((order) => (
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
                  {cancelledOrders.map((order) => (
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

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { FeedbackForm } from "@/components/user/feedback-form";
// import { OrderCard, OrderData } from "@/components/user/order-card";
// import { Footer } from "@/components/layout/footer";
// import { Header } from "@/components/layout/header";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { supabase } from "@/integrations/supabase/client";

// // Mock data - will be replaced with Supabase data
// const mockOrders: OrderData[] = [
//   {
//     id: "ord123456789",
//     pumpName: "Shell Kandivali West",
//     adminUsername: "shell_admin",
//     fuelType: "petrol",
//     quantity: 10,
//     totalAmount: 1025.0,
//     status: "pending",
//     timestamp: new Date().toISOString(),
//     deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
//   },
//   {
//     id: "ord223456789",
//     pumpName: "HP Kandivali East",
//     adminUsername: "hp_admin",
//     fuelType: "diesel",
//     quantity: 15,
//     totalAmount: 1335.0,
//     status: "accepted",
//     timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
//     deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
//   },
//   {
//     id: "ord323456789",
//     pumpName: "Indian Oil Kandivali",
//     adminUsername: "ioc_admin",
//     fuelType: "petrol",
//     quantity: 5,
//     totalAmount: 504.5,
//     status: "delivered",
//     timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
//     deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
//   },
//   {
//     id: "ord423456789",
//     pumpName: "Shell Kandivali West",
//     adminUsername: "shell_admin",
//     fuelType: "diesel",
//     quantity: 8,
//     totalAmount: 714.4,
//     status: "declined",
//     timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
//     deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
//   },
//   {
//     id: "ord523456789",
//     pumpName: "HP Kandivali East",
//     adminUsername: "hp_admin",
//     fuelType: "petrol",
//     quantity: 12,
//     totalAmount: 1221.6,
//     status: "en_route",
//     timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
//     deliveryAddress: "Kapol Vidyanidhi College, Kandivali, Mumbai",
//   },
// ];

// const MyOrders = () => {
//   const [orders, setOrders] = useState<OrderData[]>(mockOrders);
//   const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
//   const [feedbackPumpName, setFeedbackPumpName] = useState<string>("");
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // const fetchOrders = async () => {
//   //   const user = supabase.auth.getUser();

//   //   const { data, error } = await supabase
//   //     .from("orders")
//   //     .select(`
//   //       id,
//   //       fuel_type,
//   //       quantity,
//   //       total,
//   //       status,
//   //       timestamp,
//   //       address,
//   //       pump_profiles (
//   //         pump_name,
//   //         admin_username
//   //       )
//   //     `)
//   //     .eq("user_id", (await user).data.user?.id) // fetch only for current user
//   //     .order("timestamp", { ascending: false });

//   //   if (error) {
//   //     toast.error("Failed to fetch orders.");
//   //     console.error("Supabase fetch error:", error);
//   //     return;
//   //   }

//   //   const mappedOrders: OrderData[] = (data || []).map((order: any) => ({
//   //     id: order.id,
//   //     fuelType: order.fuel_type,
//   //     quantity: order.quantity,
//   //     totalAmount: order.total,
//   //     status: order.status,
//   //     timestamp: order.timestamp,
//   //     deliveryAddress: order.address,
//   //     pumpName: order.pump_profiles?.pump_name ?? "Unknown Pump",
//   //     adminUsername: order.pump_profiles?.admin_username ?? "unknown_admin",
//   //   }));

//   //   setOrders(mappedOrders);
//   //   console.log('map',mappedOrders);
//   // };
//   // Helper function to find order by ID
//   const fetchOrders = async () => {
//     const { data: userData } = await supabase.auth.getUser();
//     const userId = userData?.user?.id;
//     console.log("id", userId);

//     const { data: pumpData, error: pumpError } = await supabase
//     .from("pump_profiles")
//     .select("id") // 'id' is the pump_id
//     .eq("user_id", userId)
//     .single(); // Expect only one pump per admin

//   if (pumpError || !pumpData) {
//     console.error("Failed to fetch pump for admin:", pumpError);
//     return;
//   }

//   const pumpId = pumpData.id;
//   console.log('pump',pumpId);

//     // Fetch orders for admin based on user_id and pump_id
// const { data: ordersData, error: ordersError } = await supabase
//   .from("orders")
//   .select("*")
//   .eq("pump_id", pumpId) // Force the type to UUID
//   .order("timestamp", { ascending: false });

//   if (ordersError) {
//     console.error("Failed to fetch orders:", ordersError);
//     return;
//   }
//     if (ordersError) {
//       toast.error("Failed to fetch orders.");
//       console.error("Supabase fetch error:", ordersError.message);
//       return;
//     }

//     console.log("Orders data:", ordersData);
//     const mappedOrders: OrderData[] = (ordersData || []).map((order: any) => ({
//       id: order.id,
//       fuelType: order.fuel_type,
//       quantity: order.quantity,
//       totalAmount: order.total,
//       status: order.status,
//       timestamp: order.timestamp,
//       deliveryAddress: order.address,
//       pumpName: order.pump_profiles?.pump_name ?? "Unknown Pump",
//       adminUsername: order.pump_profiles?.admin_username ?? "Unknown Admin",
//     }));

//     // Update the state with the mapped orders
//     setOrders(mappedOrders);
//   };

//   const getOrderById = (id: string) => {
//     return orders.find((order) => order.id === id);
//   };

//   // Handle order cancellation
//   const handleCancelOrder = async (orderId: string) => {
//     try {
//       // Mock API call - will be replaced with Supabase
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update local state
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === orderId ? { ...order, status: "cancelled" } : order
//         )
//       );

//       toast.success("Order cancelled successfully!");
//     } catch (error) {
//       toast.error("Failed to cancel order. Please try again.");
//       console.error(error);
//     }
//   };

//   // Handle feedback dialog
//   const handleFeedbackClick = (orderId: string) => {
//     const order = getOrderById(orderId);
//     if (order) {
//       setFeedbackOrderId(orderId);
//       setFeedbackPumpName(order.pumpName);
//     }
//   };

//   // Close feedback dialog
//   const closeFeedbackDialog = () => {
//     setFeedbackOrderId(null);
//   };

//   // Filter orders by status for tabs
//   const activeOrders = orders.filter((order) =>
//     ["pending", "accepted", "en_route"].includes(order.status)
//   );

//   const completedOrders = orders.filter((order) =>
//     ["delivered"].includes(order.status)
//   );

//   const cancelledOrders = orders.filter((order) =>
//     ["declined", "cancelled"].includes(order.status)
//   );

//   return (
//     <div className="flex min-h-screen flex-col">
//       <Header />
//       <main className="flex-1 container py-12">
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
//             <p className="text-muted-foreground">
//               Track and manage your fuel orders
//             </p>
//           </div>

//           <Tabs defaultValue="active" className="w-full">
//             <TabsList className="grid w-full md:w-auto grid-cols-3">
//               <TabsTrigger value="active">
//                 Active ({activeOrders.length})
//               </TabsTrigger>
//               <TabsTrigger value="completed">
//                 Completed ({completedOrders.length})
//               </TabsTrigger>
//               <TabsTrigger value="cancelled">
//                 Cancelled ({cancelledOrders.length})
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="active" className="mt-6">
//               {activeOrders.length > 0 ? (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {activeOrders.map((order) => (
//                     <OrderCard
//                       key={order.id}
//                       order={order}
//                       onCancel={
//                         order.status === "pending"
//                           ? handleCancelOrder
//                           : undefined
//                       }
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="py-12 text-center text-muted-foreground">
//                   <p>You don't have any active orders</p>
//                   <Button className="mt-4" asChild>
//                     <a href="/user/order">Order Fuel Now</a>
//                   </Button>
//                 </div>
//               )}
//             </TabsContent>

//             <TabsContent value="completed" className="mt-6">
//               {completedOrders.length > 0 ? (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {completedOrders.map((order) => (
//                     <OrderCard
//                       key={order.id}
//                       order={order}
//                       onFeedback={handleFeedbackClick}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="py-12 text-center text-muted-foreground">
//                   <p>You don't have any completed orders</p>
//                 </div>
//               )}
//             </TabsContent>

//             <TabsContent value="cancelled" className="mt-6">
//               {cancelledOrders.length > 0 ? (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {cancelledOrders.map((order) => (
//                     <OrderCard key={order.id} order={order} />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="py-12 text-center text-muted-foreground">
//                   <p>You don't have any cancelled orders</p>
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Feedback Dialog */}
//         <Dialog
//           open={!!feedbackOrderId}
//           onOpenChange={() => closeFeedbackDialog()}
//         >
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Leave Feedback</DialogTitle>
//             </DialogHeader>
//             {feedbackOrderId && (
//               <FeedbackForm
//                 orderId={feedbackOrderId}
//                 pumpName={feedbackPumpName}
//                 onSubmitComplete={closeFeedbackDialog}
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default MyOrders;
