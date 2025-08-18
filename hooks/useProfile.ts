"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/database.types";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        // If no profile exists, create one from auth metadata
        if (error.code === 'PGRST116') {
          const newProfile = {
            id: user!.id,
            full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
            email: user?.email || '',
            avatar_url: user?.user_metadata?.avatar_url || '',
          };

          const { data: insertedData, error: insertError } = await supabase
            .from("user_profiles")
            .insert([newProfile])
            .select()
            .single();

          if (insertError) {
            throw insertError;
          }

          setProfile(insertedData);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from("user_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}