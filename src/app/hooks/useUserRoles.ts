import { Person, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";

 
export const useUserRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchroles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/userroles/all");
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setRoles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchroles();
  }, []);

  return { roles, isLoading, error };
};
