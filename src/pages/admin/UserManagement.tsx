
import { UserManagementCard, UserData } from "@/components/admin/user-management-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data - will be replaced with Supabase data
const mockUsers: UserData[] = [
  {
    id: "user1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    address: "Kapol Vidyanidhi College, Kandivali, Mumbai",
    isBanned: false,
    orderCount: 5,
  },
  {
    id: "user2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "9876543211",
    address: "Near Mahindra Park, Kandivali, Mumbai",
    isBanned: true,
    orderCount: 2,
  },
  {
    id: "user3",
    name: "Amit Singh",
    email: "amit.singh@example.com",
    phone: "9876543212",
    address: "Thakur Village, Kandivali, Mumbai",
    isBanned: false,
    orderCount: 8,
  },
  {
    id: "user4",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "9876543213",
    address: "Lokhandwala Township, Kandivali, Mumbai",
    isBanned: false,
    orderCount: 3,
  },
  {
    id: "user5",
    name: "Vikram Mehta",
    email: "vikram.mehta@example.com",
    phone: "9876543214",
    address: "Mahavir Nagar, Kandivali, Mumbai",
    isBanned: false,
    orderCount: 1,
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter users by search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle toggle ban
  const handleToggleBan = async (userId: string, ban: boolean) => {
    try {
      // Mock API call - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, isBanned: ban } 
            : user
        )
      );
      
      toast.success(ban ? "User banned successfully!" : "User unbanned successfully!");
      return Promise.resolve();
    } catch (error) {
      toast.error(ban ? "Failed to ban user." : "Failed to unban user.");
      console.error(error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage users who order from your petrol pump
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by name, email, phone, or address..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <UserManagementCard
                  key={user.id}
                  user={user}
                  onToggleBan={handleToggleBan}
                />
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground col-span-full">
                <p>No users found matching your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserManagement;
