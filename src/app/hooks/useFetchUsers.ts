import { Person, UserRole, LtmsUser as user } from "@prisma/client";
import { useEffect, useState } from "react";


interface CustomUser extends user {
  Person: Person;
  Role: UserRole;
}
export const useFetchUsers = () => {
  const [users, setUsers] = useState<CustomUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/users/all");
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, isLoading, error };
};
