import { Person, LetterRequest, LtmsUser as user } from "@prisma/client";
import { useEffect, useState } from "react";

interface DashboardDataModel {
  categories: number;
  recentletters: LetterRequest[];
  letterscount: number;
  userscount: number;
  departmentscount: number;
  ticketscount: number;
  lettersperdepartment: {
    uuid: string;
    name: string;
    _count: { Letters: number };
  }[];
  topdepartments: {
    uuid: string;
    name: string;
    totalRooteLetters: number;
    totalReplyLetters: number;
  }[];
}
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardDataModel | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error(response.statusText);
        const responsejson = await response.json();
        setDashboardData(responsejson);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchdata();
  }, []);

  return { data: dashboardData, isLoading, error };
};
