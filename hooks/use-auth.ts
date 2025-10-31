"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserRole {
  role: string;
  permissions: string;
}

export function useAuth() {
  const { data: session, isPending } = useSession();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const router = useRouter();

  // Fetch user role when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [session]);

  const fetchUserRole = async () => {
    setIsLoadingRole(true);
    try {
      const response = await fetch("/api/user/role");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data);
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    } finally {
      setIsLoadingRole(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userRole?.permissions) return false;
    try {
      const permissions = JSON.parse(userRole.permissions);
      return permissions[permission] === true;
    } catch {
      return false;
    }
  };

  const isDireksi = userRole?.role === "Direksi";
  const isSuperadmin = userRole?.role === "Superadmin";

  return {
    session,
    isPending,
    userRole,
    isLoadingRole,
    isAuthenticated: !!session?.user?.id,
    hasPermission,
    isDireksi,
    isSuperadmin,
    canWrite: !isDireksi, // Direksi has read-only access
    logout,
  };
}