export type HockeyRoleId = "player" | "coach" | "videoAnalyst";
export type HockeyRoleWithOrganizationId = Exclude<HockeyRoleId, "player">;

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
    id: "coach",
    roleKey: "hockey.coach.role",
    organizationKey: "hockey.coach.organization",
    periodKey: "hockey.coach.period",
  },
  {
    id: "videoAnalyst",
    roleKey: "hockey.videoAnalyst.role",
    organizationKey: "hockey.videoAnalyst.organization",
    periodKey: "hockey.videoAnalyst.period",
  },
];
