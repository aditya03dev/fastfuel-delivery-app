
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { Session, User } from "@supabase/supabase-js";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";

// type AuthContextType = {
//   session: Session | null;
//   user: User | null;
//   isLoading: boolean;
//   userRole: "user" | "admin" | null;
//   signOut: () => Promise<void>;
//   refreshSession: () => Promise<void>;
// }; 

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Function to fetch user role
//   const fetchUserRole = async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('user_roles')
//         .select('role')
//         .eq('user_id', userId)
//         .single();

//       if (error) {
//         console.error("Error fetching user role:", error);
//         return;
//       }

//       setUserRole(data.role as "user" | "admin");
//     } catch (error) {
//       console.error("Error in fetchUserRole:", error);
//     }
//   };

//   // Function to refresh session
//   const refreshSession = async () => {
//     try {
//       const { data, error } = await supabase.auth.refreshSession();
//       if (error) {
//         throw error;
//       }
      
//       setSession(data.session);
//       setUser(data.session?.user ?? null);
      
//       if (data.session?.user) {
//         await fetchUserRole(data.session.user.id);
//       }
//     } catch (error) {
//       console.error("Error refreshing session:", error);
//     }
//   };

//   useEffect(() => {
//     // Set up auth state listener FIRST
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, currentSession) => {
//         console.log("Auth state changed:", event);
//         setSession(currentSession);
//         setUser(currentSession?.user ?? null);

//         // Get user role on auth change
//         if (currentSession?.user) {
//           setTimeout(() => {
//             fetchUserRole(currentSession.user.id);
//           }, 0);
//         } else {
//           setUserRole(null);
//         }
//       }
//     );

//     // THEN check for existing session
//     supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
//       setSession(currentSession);
//       setUser(currentSession?.user ?? null);
      
//       if (currentSession?.user) {
//         fetchUserRole(currentSession.user.id);
//       }
//       setIsLoading(false);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       toast.success("Logged out successfully");
//     } catch (error) {
//       console.error("Error signing out:", error);
//       toast.error("Failed to log out");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       session, 
//       user, 
//       isLoading, 
//       userRole, 
//       signOut,
//       refreshSession 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Nut } from "lucide-react";

// ✅ ADDED: Types for user and admin profiles
type UserProfileData = {
  name: string;
  phone: string;
  address: string;
  email: string;
};

type AdminProfileData = {
  pump_name: string;
  admin_username: string;
  address: string;
  petrol_price: number;
  diesel_price: number;
};

// ✅ UPDATED: AuthContextType to include profile data
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  userRole: "user" | "admin" | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  userProfile?: UserProfileData;
  adminProfile?: AdminProfileData;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ ADDED: Profile states
  const [userProfile, setUserProfile] = useState<UserProfileData>();
  const [adminProfile, setAdminProfile] = useState<AdminProfileData>();

  // ✅ ADDED: Fetch minimal user profile fields
  // const fetchUserProfile = async (userId: string) => {
  //   const { data, error } = await supabase
  //     .from("user_profiles").select("*").eq("id", userId)
  //     .single();
  //   // console.log('data',data);  

  //   if (!error && data) {
  //     setUserProfile({
  //       name: data.name,
  //       phone: data.phone,
  //       address: data.address,
  //       // email:email
  //       email: user?.email ?? ""
  //     });
  //   } else {
  //     console.error("Error fetching user profile:", error);
  //   }
  // };
  const fetchUserProfile = async (user: User) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
  
    if (!error && data) {
      setUserProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: user.email ?? "" // ✅ guaranteed to be set now
      });
    } else {
      console.error("Error fetching user profile:", error);
    }
  };
  
  // ✅ ADDED: Fetch minimal admin profile fields
  const fetchAdminProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("pump_profiles")
      .select("pump_name, admin_username, address, petrol_price, diesel_price")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setAdminProfile({
        pump_name: data.pump_name,
        admin_username: data.admin_username,
        address: data.address,
        petrol_price: data.petrol_price,
        diesel_price: data.diesel_price,
      });
    } else {
      console.error("Error fetching admin profile:", error);
    }
  };

  // ✅ UPDATED: Role logic to also trigger profile fetch
  // const fetchUserRole = async (userId: string) => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('user_roles')
  //       .select('role')
  //       .eq('user_id', userId)
  //       .single();

  //     if (error) {
  //       console.error("Error fetching user role:", error);
  //       return;
  //     }

  //     const role = data.role as "user" | "admin";
  //     setUserRole(role);

  //     // ✅ ADDED: Trigger profile fetch
  //     if (role === "user") {
  //       await fetchUserProfile(userId);
  //     } else if (role === "admin") {
  //       await fetchAdminProfile(userId);
  //     }

  //   } catch (error) {
  //     console.error("Error in fetchUserRole:", error);
  //   }
  // };
  const fetchUserRole = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
  
      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }
  
      const role = data.role as "user" | "admin";
      setUserRole(role);
  
      if (role === "user") {
        await fetchUserProfile(user); // pass user, not just ID
      } else if (role === "admin") {
        await fetchAdminProfile(user.id);
        await fetchUserProfile(user); // pass user, not just ID
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
    }
  };
  
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      setSession(data.session);
      setUser(data.session?.user ?? null);
      console.log('session',data.session?.user ?? null);
      console.log('session',data.session?.user?.email ?? null);
      setEmail(data.session?.user?.email ?? null);

      if (data.session?.user) {
        await fetchUserRole(data.session?.user);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        console.log("Auth user:", currentSession?.user ?? null);
        console.log("Auth user:", currentSession?.user?.email ?? null);

        setEmail(currentSession?.user?.email ?? null);

        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRole(currentSession?.user);
          }, 0);
        } else {
          setUserRole(null);
          setUserProfile(undefined);   // ✅ Clear user profile on logout
          setAdminProfile(undefined);  // ✅ Clear admin profile on logout
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchUserRole(currentSession?.user);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");

      // ✅ RESET state after logout
      setUserRole(null);
      setUserProfile(undefined);
      setAdminProfile(undefined);

    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      isLoading,
      userRole,
      signOut,
      refreshSession,
      userProfile,      // ✅ now exposed
      adminProfile      // ✅ now exposed
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
