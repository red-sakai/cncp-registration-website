import { getUserProfile } from "@/repositories/userRepository";
import { getAuthUserMetadata } from "@/repositories/authRepository";

export interface UserInfo {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
}

/**
 * Get user information by user ID
 * This is useful for displaying organizer information
 */
export async function getUserInfo(userId: string): Promise<UserInfo | null> {
  if (!userId) {
    return null;
  }

  try {
    const userProfile = await getUserProfile(userId);
    
    if (userProfile) {
      // Build full name from first and last name
      const fullName = [userProfile.first_name, userProfile.last_name]
        .filter(Boolean)
        .join(" ")
        .trim() || null;

      return {
        firstName: userProfile.first_name || null,
        lastName: userProfile.last_name || null,
        fullName,
        email: userProfile.email || null,
      };
    }

    // Fallback: try to get user info from auth metadata
    const authUser = await getAuthUserMetadata(userId);
    if (authUser) {
      const meta = authUser.user_metadata || {};
      const fullName = meta.full_name
        || [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim()
        || null;

      return {
        firstName: meta.first_name || null,
        lastName: meta.last_name || null,
        fullName,
        email: authUser.email || null,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to get user info:", error);
    return null;
  }
}
