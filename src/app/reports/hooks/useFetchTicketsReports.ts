import {
  LetterRequest,
  Person,
  UserRole,
  LtmsUser,
  OrganisationDepartment,
  LetterCategory,
  LetterRecipient,
  LetterTicket,
} from "@prisma/client";
import { useEffect, useState } from "react";

interface CustomTicket extends LetterTicket {
  Letter: LetterRequest;
}
export const useFetchTicketsReports = () => {
  const [tickets, setTickets] = useState<CustomTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchletters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/reports/tickets");
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setTickets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchletters();
  }, []);

  return { tickets, isLoading, error };
};
