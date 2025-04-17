
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

// Interface for feedback data
export interface FeedbackData {
  id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  timestamp: string;
}

// Props interface
interface FeedbackCardProps {
  feedback: FeedbackData;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Render star rating
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback className={feedback.rating >= 4 
            ? "bg-green-100 text-green-600" 
            : feedback.rating >= 3 
              ? "bg-amber-100 text-amber-600" 
              : "bg-red-100 text-red-600"
          }>
            {getInitials(feedback.userName)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{feedback.userName}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Order #{feedback.orderId.substring(0, 8)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <StarRating rating={feedback.rating} />
            <span className="text-sm text-muted-foreground">
              {formatDate(feedback.timestamp)}
            </span>
          </div>
          
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">{feedback.comment}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Customer email: {feedback.userEmail}
        </p>
      </CardFooter>
    </Card>
  );
}
