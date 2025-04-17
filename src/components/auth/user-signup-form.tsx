
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
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
});

type UserSignupFormValues = z.infer<typeof formSchema>;

export function UserSignupForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Create form with validation schema
  const form = useForm<UserSignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "Kapol Vidyanidhi College, Kandivali, Mumbai",
    },
  });

  // Handle form submission with Supabase auth
  async function onSubmit(values: UserSignupFormValues) {
    setIsLoading(true);
    
    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            is_admin: false, // Mark as regular user
          }
        }
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("User registration failed");
      }

      // Step 2: Create user profile
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: authData.user.id,
        name: values.name,
        phone: values.phone,
        address: values.address
      });

      if (profileError) throw profileError;
      
      // Show success toast
      toast.success("Account created successfully! You can now log in.");
      
      // Sign out the user so they can log in explicitly
      await supabase.auth.signOut();
      
      // Redirect to login
      navigate("/user/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle common errors
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
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
                <Input placeholder="john@example.com" type="email" {...field} />
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
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your address in Kandivali, Mumbai" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
