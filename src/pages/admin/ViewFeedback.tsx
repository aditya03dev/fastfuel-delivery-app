
import { FeedbackCard, FeedbackData } from "@/components/admin/feedback-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with Supabase data
const mockFeedback: FeedbackData[] = [
  {
    id: "feedback1",
    orderId: "ord123456789",
    userName: "Rahul Sharma",
    userEmail: "rahul.sharma@example.com",
    rating: 5,
    comment: "Excellent service! The fuel was delivered promptly and the delivery person was very professional.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "feedback2",
    orderId: "ord223456789",
    userName: "Priya Patel",
    userEmail: "priya.patel@example.com",
    rating: 4,
    comment: "Good service overall. The delivery was on time. Would order again.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "feedback3",
    orderId: "ord323456789",
    userName: "Amit Singh",
    userEmail: "amit.singh@example.com",
    rating: 3,
    comment: "Average service. The delivery was a bit delayed, but the quality of fuel was good.",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: "feedback4",
    orderId: "ord423456789",
    userName: "Neha Gupta",
    userEmail: "neha.gupta@example.com",
    rating: 2,
    comment: "Not satisfied with the service. The delivery was very late and there was no communication about the delay.",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    id: "feedback5",
    orderId: "ord523456789",
    userName: "Vikram Mehta",
    userEmail: "vikram.mehta@example.com",
    rating: 5,
    comment: "Fantastic service! The fuel was delivered on time and the quality was excellent.",
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  },
];

const ViewFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackData[]>(mockFeedback);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  
  // Filter feedback by search query and rating
  let filteredFeedback = feedback.filter(item => 
    (item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.orderId.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (ratingFilter === "all" || item.rating === parseInt(ratingFilter))
  );
  
  // Sort feedback
  filteredFeedback = [...filteredFeedback].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    
    if (sortOption === "newest") {
      return dateB - dateA;
    } else if (sortOption === "oldest") {
      return dateA - dateB;
    } else if (sortOption === "highest") {
      return b.rating - a.rating;
    } else if (sortOption === "lowest") {
      return a.rating - b.rating;
    }
    
    return 0;
  });

  // Calculate average rating
  const averageRating = feedback.length > 0
    ? (feedback.reduce((acc, item) => acc + item.rating, 0) / feedback.length).toFixed(1)
    : "0.0";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customer Feedback</h1>
            <p className="text-muted-foreground">
              Review customer feedback for your fuel delivery service
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-full lg:col-span-1 flex items-center p-4 bg-muted rounded-md">
              <div className="text-center w-full">
                <div className="text-3xl font-bold">{averageRating}/5</div>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={Number(averageRating) >= star ? "currentColor" : "none"}
                      stroke="currentColor"
                      className="h-5 w-5 text-yellow-400"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {feedback.length} reviews
                </p>
              </div>
            </div>
            
            <div className="col-span-full lg:col-span-3 grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search feedback..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={ratingFilter}
                onValueChange={setRatingFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={sortOption}
                onValueChange={setSortOption}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map(item => (
                <FeedbackCard
                  key={item.id}
                  feedback={item}
                />
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground col-span-full">
                <p>No feedback found matching your filters</p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setRatingFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewFeedback;
