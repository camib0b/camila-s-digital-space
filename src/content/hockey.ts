export type HockeyRoleId = "player" | "coach.uc" | "coach.national" | "videoAnalyst";
export type HockeyRoleWithOrganizationId = "coach.uc" | "coach.national";

export interface HockeyRole {
  id: HockeyRoleId;
  roleKey: `hockey.${HockeyRoleId}.role`;
  organizationKey?: `hockey.${HockeyRoleWithOrganizationId}.organization`;
  periodKey: `hockey.${HockeyRoleId}.period`;
}

export const hockeyRoles: HockeyRole[] = [
  {
    id: "player",
    roleKey: "hockey.player.role",
    periodKey: "hockey.player.period",
  },
  {
    id: "coach.uc",
    roleKey: "hockey.coach.uc.role",
    organizationKey: "hockey.coach.uc.organization",
    periodKey: "hockey.coach.uc.period",
  },
  {
    id: "coach.national",
    roleKey: "hockey.coach.national.role",
    organizationKey: "hockey.coach.national.organization",
    periodKey: "hockey.coach.national.period",
  },
  {
    id: "videoAnalyst",
    roleKey: "hockey.videoAnalyst.role",
    periodKey: "hockey.videoAnalyst.period",
  },
];
