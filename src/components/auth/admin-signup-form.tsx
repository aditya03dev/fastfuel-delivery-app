
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
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Form schema with validation
const formSchema = z.object({
  pumpName: z.string().min(3, {
    message: "Pump name must be at least 3 characters.",
  }),
  adminUsername: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).regex(/^[a-z0-9_]+$/, {
    message: "Username can only contain lowercase letters, numbers, and underscores.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be 10 digits.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  petrolPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Petrol price must be greater than 0.",
  }),
  dieselPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Diesel price must be greater than 0.",
  }),
});

type AdminSignupFormValues = z.infer<typeof formSchema>;

export function AdminSignupForm() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Create form with validation schema
  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pumpName: "",
      adminUsername: "",
      email: "",
      phone: "",
      password: "",
      address: "Kandivali, Mumbai",
      petrolPrice: "100",
      dieselPrice: "90",
    },
  });

  // Handle form submission with Supabase auth
  async function onSubmit(values: AdminSignupFormValues) {
    setIsLoading(true);
    
    try {
      // Step 1: Check if pump name or admin username already exists
      const { data: existingPump, error: checkError } = await supabase
        .from('pump_profiles')
        .select('pump_name, admin_username')
        .or(`pump_name.eq.${values.pumpName},admin_username.eq.${values.adminUsername}`)
        .maybeSingle();

      if (checkError) throw checkError;
      
      if (existingPump) {
        if (existingPump.pump_name === values.pumpName) {
          throw new Error("This petrol pump name is already registered");
        }
        if (existingPump.admin_username === values.adminUsername) {
          throw new Error("This admin username is already taken");
        }
      }

      // Step 2: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            is_admin: true, // Mark as admin
          }
        }
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Admin registration failed");
      }

      // Get the session right after signup to have proper authorization
      await refreshSession();

      // Step 3: Create pump profile with explicit user ID to satisfy RLS
      const { error: profileError } = await supabase.from('pump_profiles').insert({
        id: authData.user.id,
        pump_name: values.pumpName,
        admin_username: values.adminUsername,
        address: values.address,
        petrol_price: Number(values.petrolPrice),
        diesel_price: Number(values.dieselPrice)
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error("Failed to create pump profile: " + profileError.message);
      }
      
      // Show success toast
      toast.success("Petrol pump registration successful!");
      
      // Refresh the session one more time to ensure all data is up to date
      await refreshSession();
      
      // Redirect to dashboard
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin signup error:", error);
      
      // Handle common errors
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(error.message || "Failed to register pump. Please try again.");
      }
      
      // Sign out the user in case of error
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pumpName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Petrol Pump Name</FormLabel>
              <FormControl>
                <Input placeholder="Shell Kandivali West" {...field} />
              </FormControl>
              <FormDescription>
                This is the name users will see when selecting your pump.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adminUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Username</FormLabel>
              <FormControl>
                <Input placeholder="shell_admin" {...field} />
              </FormControl>
              <FormDescription>
                This will be your unique identifier on the platform.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="9876543210" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pump Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your pump address in Kandivali, Mumbai" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="petrolPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Petrol Price (₹/L)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="0.01" {...field} />
                </FormControl>
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
                  <Input type="number" min="1" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering pump..." : "Register Petrol Pump"}
        </Button>
      </form>
    </Form>
  );
}
