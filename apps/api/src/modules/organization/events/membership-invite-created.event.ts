export interface MembershipInviteCreatedEvent {
  organizationName: string;
  email: string;
  name: string;
  inviteUrl: string;
  role: string;
}
