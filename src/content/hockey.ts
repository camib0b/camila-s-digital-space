export type HockeyRoleId = "player" | "coaching" | "videoAnalyst";

export interface HockeyRole {
  id: HockeyRoleId;
  roleKey: `hockey.${HockeyRoleId}.role`;
  periodKey: `hockey.${HockeyRoleId}.period`;
}

/**
 * Home hockey lines. Coaching replaces the separate UC coach and national-team
 * assistant-coach lines. Both ran from 2023 and are still open, so the span is 2023–present.
 */
export const hockeyRoles: HockeyRole[] = [
  {
    id: "player",
    roleKey: "hockey.player.role",
    periodKey: "hockey.player.period",
  },
  {
    id: "coaching",
    roleKey: "hockey.coaching.role",
    periodKey: "hockey.coaching.period",
  },
  {
    id: "videoAnalyst",
    roleKey: "hockey.videoAnalyst.role",
    periodKey: "hockey.videoAnalyst.period",
  },
];
