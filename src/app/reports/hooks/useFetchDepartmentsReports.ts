import { 
  OrganisationDepartment, 
} from "@prisma/client";
import { useEffect, useState } from "react";

interface customDepartment extends OrganisationDepartment {
  LettersCount: number;
  RecipientsCount: number;
  TicketsCount: number;
}
export const useFetchDepartmentsReports = () => {
  const [departments, setDepartments] = useState<customDepartment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchletters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/reports/departments");
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setDepartments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchletters();
  }, []);

  return { departments, isLoading, error };
};
