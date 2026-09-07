export interface ICreateOrganizationPayload {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface IUpdateOrganizationPayload {
  name?: string;
  logo?: string;
  description?: string;
}

export interface IInviteMemberPayload {
  email: string;
  role?: "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
}



