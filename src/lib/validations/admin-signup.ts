
import * as z from "zod";

export const adminSignupFormSchema = z.object({
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

export type AdminSignupFormValues = z.infer<typeof adminSignupFormSchema>;
