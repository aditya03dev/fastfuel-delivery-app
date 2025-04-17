
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Form schema
const feedbackFormSchema = z.object({
  rating: z.number().min(1, {
    message: "Please select a rating",
  }).max(5),
  comment: z.string().min(5, {
    message: "Comment must be at least 5 characters",
  }).max(500, {
    message: "Comment must not exceed 500 characters",
  }),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  orderId: string;
  pumpName: string;
  onSubmitComplete: () => void;
}

export function FeedbackForm({ orderId, pumpName, onSubmitComplete }: FeedbackFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

  // Create form
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: FeedbackFormValues) {
    setIsLoading(true);
    
    try {
      // Mock API call - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Will log feedback data
      console.log("Feedback data:", {
        orderId,
        ...values,
        timestamp: new Date().toISOString(),
      });
      
      // Show success toast
      toast.success("Feedback submitted successfully!");
      
      // Call the onSubmitComplete callback
      onSubmitComplete();
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Render star rating component
  const StarRating = () => {
    const rating = form.watch("rating");
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-8 w-8 cursor-pointer transition-all",
              (hoveredRating !== null ? star <= hoveredRating : star <= rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
            onClick={() => form.setValue("rating", star, { shouldValidate: true })}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
          />
        ))}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Rate your experience with {pumpName}</h3>
          <p className="text-sm text-muted-foreground">
            Your feedback helps improve our service
          </p>
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div>
                  <StarRating />
                  <input
                    type="hidden"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this order..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {500 - (field.value?.length || 0)} characters remaining
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSubmitComplete}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
