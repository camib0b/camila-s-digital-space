export type HockeyRoleId = "player" | "coachUc" | "coachNational" | "videoAnalyst";

export interface HockeyRole {
  id: HockeyRoleId;
  roleKey: `hockey.${HockeyRoleId}.role`;
  organizationKey?: `hockey.${HockeyRoleId}.organization`;
  periodKey: `hockey.${HockeyRoleId}.period`;
}

export const hockeyRoles: HockeyRole[] = [
  {
    id: "player",
    roleKey: "hockey.player.role",
    periodKey: "hockey.player.period",
  },
  {
    id: "coachUc",
    roleKey: "hockey.coachUc.role",
    organizationKey: "hockey.coachUc.organization",
    periodKey: "hockey.coachUc.period",
  },
  {
    id: "coachNational",
    roleKey: "hockey.coachNational.role",
    organizationKey: "hockey.coachNational.organization",
    periodKey: "hockey.coachNational.period",
  },
  {
    id: "videoAnalyst",
    roleKey: "hockey.videoAnalyst.role",
    organizationKey: "hockey.videoAnalyst.organization",
    periodKey: "hockey.videoAnalyst.period",
  },
];
