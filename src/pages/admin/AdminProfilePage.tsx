import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface AdminadminProfile {
  pump_name: string;
  admin_username: string;
  email: string;
  phone: string;
  address: string;
}
interface UseradminProfile {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export default function AdminProfile() {
  const { adminProfile } = useAuth(); // Get real data from AuthContext
  const { userProfile } = useAuth(); // Get real data from AuthContext

  // Temporary fallback to dummy data if no profile exists
  // const adminProfile = adminProfile || {
  //   pump_name: "City Petrol Station",
  //   admin_username: "admin123",
  //   email: "admin@citypetrol.com",
  //   phone: "+1 234 567 8901",
  //   address: "456 Gas Street, Industrial Area"
  // };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container py-8">
        {" "}
        {/* Page container */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-bold">Admin Profile</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Petrol Pump Name</Label>
              <div className="p-2 bg-muted rounded-md">
                {adminProfile.pump_name}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Admin User Name</Label>
              <div className="p-2 bg-muted rounded-md">
                {adminProfile.admin_username}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <div className="p-2 bg-muted rounded-md">{userProfile.email}</div>
            </div>
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <div className="p-2 bg-muted rounded-md">{userProfile.phone}</div>
            </div>
            <div className="grid gap-2">
              <Label>Pump Address</Label>
              <div className="p-2 bg-muted rounded-md">
                {adminProfile.address}
              </div>
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
