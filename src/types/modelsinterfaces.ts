import { UserRole } from "@prisma/client";
import { ProposalStatus } from "./enums";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Proposal {
  id: string;
  title: string;
  status: ProposalStatus;
  createdAt: Date;
}
