export type HockeyRoleId = "player" | "clubUc" | "fehoch" | "videoAnalyst";

export type HockeyDestinationKey = "hockey.player.destination" | "hockey.videoAnalyst.destination";

type HockeyRoleBase = {
  id: HockeyRoleId;
  roleKey: `hockey.${HockeyRoleId}.role`;
  periodKey: `hockey.${HockeyRoleId}.period`;
};

type LinkedHockeyRole = HockeyRoleBase & {
  href: string;
  destinationKey: HockeyDestinationKey;
};

type TextHockeyRole = HockeyRoleBase & {
  href?: undefined;
  destinationKey?: undefined;
};

export type HockeyRole = LinkedHockeyRole | TextHockeyRole;

/**
 * Home hockey lines. Club UC coaching ended in 2025. FEHOCH coaching and
 * coordination is current; no start year is recorded here.
 */
export const hockeyRoles: HockeyRole[] = [
  {
    id: "player",
    roleKey: "hockey.player.role",
    periodKey: "hockey.player.period",
    href: "https://atn.fehoch.cl/en/players/54338395",
    destinationKey: "hockey.player.destination",
  },
  {
    id: "clubUc",
    roleKey: "hockey.clubUc.role",
    periodKey: "hockey.clubUc.period",
  },
  {
    id: "fehoch",
    roleKey: "hockey.fehoch.role",
    periodKey: "hockey.fehoch.period",
  },
  {
    id: "videoAnalyst",
    roleKey: "hockey.videoAnalyst.role",
    periodKey: "hockey.videoAnalyst.period",
    href: "https://carpeta.cl/",
    destinationKey: "hockey.videoAnalyst.destination",
  },
];
