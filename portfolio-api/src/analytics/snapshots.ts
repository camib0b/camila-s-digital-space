import type { FundSnapshot } from "./exposure";
import bndSnapshot from "../../data/holdings/bnd-2026-06-30.json";
import roboSnapshot from "../../data/holdings/robo-2026-04-30.json";
import vooSnapshot from "../../data/holdings/voo-2026-06-30.json";
import vxusSnapshot from "../../data/holdings/vxus-2026-04-30.json";

export const FUND_SNAPSHOTS: readonly FundSnapshot[] = [
  vooSnapshot as FundSnapshot,
  vxusSnapshot as FundSnapshot,
  roboSnapshot as FundSnapshot,
  bndSnapshot as FundSnapshot,
];
