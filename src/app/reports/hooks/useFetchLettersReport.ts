import {
  LetterRequest,
  Person,
  UserRole,
  LtmsUser,
  OrganisationDepartment,
  LetterCategory,
  LetterRecipient,
} from "@prisma/client";
import { useEffect, useState } from "react";

interface CustomLetter extends LetterRequest {
  id?: string;
  SenderUser: LtmsUser;
  SenderDepartment: OrganisationDepartment;
  LetterCategory: LetterCategory;
  LetterRecipients: LetterRecipient[];
}
export const useFetchLettersReport = () => {
  const [letters, setLetters] = useState<CustomLetter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchletters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/reports/letters");
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setLetters(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchletters();
  }, []);

  return { allletters: letters, isLoading, error };
};
