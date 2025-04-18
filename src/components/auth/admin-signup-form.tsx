
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAdminSignup } from "@/hooks/use-admin-signup";
import { AdminSignupFields } from "./admin-signup-fields";

export function AdminSignupForm() {
  const { form, isLoading, onSubmit } = useAdminSignup();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <AdminSignupFields form={form} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering pump..." : "Register Petrol Pump"}
        </Button>
      </form>
    </Form>
  );
}
