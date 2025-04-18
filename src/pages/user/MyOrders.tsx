
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FeedbackForm } from "@/components/user/feedback-form";
import { OrderCard, OrderData } from "@/components/user/order-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const MyOrders = () => {
  const { user } = useAuth();
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackPumpName, setFeedbackPumpName] = useState<string>("");

  // Fetch orders from Supabase
  const { data: orders = [], refetch } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          pump:pump_profiles(pump_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(order => ({
        id: order.id,
        pumpName: order.pump.pump_name,
        fuelType: order.fuel_type,
        quantity: order.quantity,
        totalAmount: order.total_amount,
        status: order.status,
        timestamp: order.created_at,
        deliveryAddress: order.delivery_address,
        pump_id: order.pump_id
      }));
    },
    enabled: !!user
  });

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('status', 'pending');

      if (error) throw error;
      
      toast.success("Order cancelled successfully!");
      refetch();
    } catch (error: any) {
      toast.error("Failed to cancel order. Please try again.");
      console.error(error);
    }
  };

  // Handle feedback dialog
  const handleFeedbackClick = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setFeedbackOrderId(orderId);
      setFeedbackPumpName(order.pumpName);
    }
  };

  // Filter orders by status
  const activeOrders = orders.filter(order => 
    ["pending", "accepted", "en_route"].includes(order.status)
  );
  
  const completedOrders = orders.filter(order => 
    order.status === "delivered"
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
        <Dialog open={!!feedbackOrderId} onOpenChange={() => setFeedbackOrderId(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Leave Feedback</DialogTitle>
            </DialogHeader>
            {feedbackOrderId && (
              <FeedbackForm
                orderId={feedbackOrderId}
                pumpName={feedbackPumpName}
                onSubmitComplete={() => setFeedbackOrderId(null)}
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
