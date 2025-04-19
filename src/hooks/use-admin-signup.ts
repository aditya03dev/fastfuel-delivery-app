
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { adminSignupFormSchema, type AdminSignupFormValues } from "@/lib/validations/admin-signup";
import { v4 as uuidv4 } from 'uuid';

export function useAdminSignup() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupFormSchema),
    defaultValues: {
      pumpName: "",
      adminUsername: "",
      email: "",
      phone: "",
      password: "",
      address: "Kandivali, Mumbai",
      petrolPrice: "100",
      dieselPrice: "90",
    },
  });

  async function onSubmit(values: AdminSignupFormValues) {
    setIsLoading(true);
    
    try {
      const { data: existingPump, error: checkError } = await supabase
        .from('pump_profiles')
        .select('pump_name, admin_username')
        .or(`pump_name.eq.${values.pumpName},admin_username.eq.${values.adminUsername}`)
        .maybeSingle();

      if (checkError) throw checkError;
      
      if (existingPump) {
        if (existingPump.pump_name === values.pumpName) {
          throw new Error("This petrol pump name is already registered");
        }
        if (existingPump.admin_username === values.adminUsername) {
          throw new Error("This admin username is already taken");
        }
      }

      // const { data: authData, error: authError } = await supabase.auth.signUp({
      //   email: values.email,
      //   password: values.password,
      //   options: {
      //     data: {
      //       is_admin: true,
      //     }
      //   }
      // });

      // if (authError) throw authError;
      
      // if (!authData.user) {
      //   throw new Error("Admin registration failed");
      // }

      // await refreshSession();

      // const { error: profileError } = await supabase.from('pump_profiles').insert({
      //   id: authData.user.id,
      //   user_id: authData.user.id,
      //   pump_name: values.pumpName,
      //   admin_username: values.adminUsername,
      //   address: values.address,
      //   petrol_price: Number(values.petrolPrice),
      //   diesel_price: Number(values.dieselPrice)
      // });

      // if (profileError) {
      //   console.error("Profile creation error:", profileError);
      //   throw new Error("Failed to create pump profile: " + profileError.message);
      // }
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            is_admin: true,
          },
        },
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Admin registration failed");
      }
      
      await refreshSession();
      
      // STEP 1: Insert into user_profiles to satisfy FK constraint
      const { error: userProfileError } = await supabase.from("user_profiles").insert({
        id: authData.user.id,
        name: values.adminUsername,
        phone: values.phone, // make sure you have this input
        address: values.address,
      });
      
      if (userProfileError) {
        throw new Error("Failed to create user profile: " + userProfileError.message);
      }
      const pumpId = uuidv4();
      // STEP 2: Now you can safely insert into pump_profiles
      const { error: profileError } = await supabase.from("pump_profiles").insert({
        id: pumpId,
        user_id: authData.user.id,
        pump_name: values.pumpName,
        admin_username: values.adminUsername,
        address: values.address,
        petrol_price: Number(values.petrolPrice),
        diesel_price: Number(values.dieselPrice),
      });
      
      if (profileError) {
        throw new Error("Failed to create pump profile: " + profileError.message);
      }
      

      toast.success("Petrol pump registration successful!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin signup error:", error);
      toast.error(error.message || "Failed to register pump. Please try again.");
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
