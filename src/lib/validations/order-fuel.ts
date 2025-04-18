
import { z } from "zod";

export const orderFormSchema = z.object({
  pumpId: z.string({
    required_error: "Please select a petrol pump",
  }),
  fuelType: z.enum(["petrol", "diesel"], {
    required_error: "Please select a fuel type",
  }),
  quantity: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100,
    {
      message: "Quantity must be between 1 and 100 liters",
    }
  ),
  deliveryAddress: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
