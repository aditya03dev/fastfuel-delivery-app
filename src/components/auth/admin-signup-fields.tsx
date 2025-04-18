
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { AdminSignupFormValues } from "@/lib/validations/admin-signup";

interface AdminSignupFieldsProps {
  form: UseFormReturn<AdminSignupFormValues>;
}

export function AdminSignupFields({ form }: AdminSignupFieldsProps) {
  return (
    <>
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
    </>
  );
}
