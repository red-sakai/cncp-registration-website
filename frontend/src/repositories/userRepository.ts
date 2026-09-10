import { createClient } from "@/lib/supabase/server";

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("check_email_exists", { check_email: normalizedEmail });

  if (error) {
    throw new Error(`Failed to find user by email: ${error.message}`);
  }

  return data ? { users_id: "exists" } : null;
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("users_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get user profile: ${error.message}`);
  }

  return data;
}

export async function getDbUserRole(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("users_id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data?.role ?? null;
}

// Implement other user-related repository functions here, such as createUser, updateUser, deleteUser, listUsers, etc, if there is
