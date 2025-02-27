import {
  LtmsUser,
  OrganisationDepartment,
  Person,
  UserPermission,
  UserRole,
  LtmsUser as user,
} from "@prisma/client";
import { useEffect, useState } from "react";

interface ExtendedUser extends LtmsUser {
  Person?: Person;
  UserRole?: UserRole;
  Department?: OrganisationDepartment;
  UserPermissions?: UserPermission[];
}

export const useUserDetails = (uuid: string | null) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/users/${uuid}`);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  return { user, isLoading, error };
};
