
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

// Interface for user data
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isBanned: boolean;
  orderCount: number;
}

// Props interface
interface UserManagementCardProps {
  user: UserData;
  onToggleBan: (userId: string, ban: boolean) => Promise<void>;
}

export function UserManagementCard({ user, onToggleBan }: UserManagementCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Handle ban toggle
  const handleToggleBan = async () => {
    setIsLoading(true);
    try {
      await onToggleBan(user.id, !user.isBanned);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback className={user.isBanned ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}>
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{user.name}</CardTitle>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Phone:</div>
          <div className="font-medium">{user.phone}</div>
          
          <div className="text-muted-foreground">Address:</div>
          <div className="font-medium">{user.address}</div>
          
          <div className="text-muted-foreground">Orders:</div>
          <div className="font-medium">{user.orderCount}</div>
          
          <div className="text-muted-foreground">Status:</div>
          <div className={`font-medium ${user.isBanned ? "text-red-600" : "text-green-600"}`}>
            {user.isBanned ? "Banned" : "Active"}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={user.isBanned ? "outline" : "destructive"} 
          size="sm" 
          className="w-full"
          onClick={handleToggleBan}
          disabled={isLoading}
        >
          {isLoading 
            ? (user.isBanned ? "Unbanning..." : "Banning...") 
            : (user.isBanned ? "Unban User" : "Ban User")
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
