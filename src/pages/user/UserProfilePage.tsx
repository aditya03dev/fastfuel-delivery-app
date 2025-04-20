import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileData {
  name: string;
    email: string;
  address: string;
  phone: string;
}

export default function UserProfile() {
  const { userProfile } = useAuth(); // Get real data from AuthContext
  console.log("hello", userProfile);
  // Temporary fallback to dummy data if no profile exists
  const profileData = userProfile || {
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St, City",
    phone: "+1 234 567 8900",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container py-8">
        {" "}
        {/* Page container */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-bold">User Profile</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <div className="p-2 bg-muted rounded-md">{profileData.name}</div>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <div className="p-2 bg-muted rounded-md">{profileData.email}</div>
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <div className="p-2 bg-muted rounded-md">
                {profileData.address}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <div className="p-2 bg-muted rounded-md">{profileData.phone}</div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground italic">
              One time data input, no update for gas related legalities
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
