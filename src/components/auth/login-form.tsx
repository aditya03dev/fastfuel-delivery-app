
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
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  userType: "user" | "admin";
}

export function LoginForm({ userType }: LoginFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Create form with validation schema
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission with Supabase auth
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    
    try {
      // Sign in with Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error("Login failed");
      }

      // Fetch user role to redirect correctly
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) throw roleError;

      // Check if login type matches with user role
      if (userType === 'user' && roleData.role !== 'user') {
        await supabase.auth.signOut();
        throw new Error("This is a user login page. Please use the admin login.");
      }

      if (userType === 'admin' && roleData.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("This is an admin login page. Please use the user login.");
      }
      
      // Show success toast
      toast.success("Login successful!");
      
      // Redirect based on user type
      if (userType === "user") {
        navigate("/user/order");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid email or password. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" type="email" {...field} />
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </Form>
  );
}
