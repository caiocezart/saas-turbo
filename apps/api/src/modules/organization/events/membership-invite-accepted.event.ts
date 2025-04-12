export interface MembershipInviteAcceptedEvent {
  organizationName: string;
  email: string;
  name: string;
  inviteUrl: string;
  role: string;
}
