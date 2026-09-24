import {
  Cpu,
  Cog,
  Radar,
  Lightbulb,
  ToggleLeft,
  Battery,
  Zap,
  GitCommitHorizontal,
  Microchip,
  Cable,
  LayoutGrid,
  Wrench,
  BatteryCharging,
  Box,
  Package,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  cog: Cog,
  radar: Radar,
  lightbulb: Lightbulb,
  "toggle-left": ToggleLeft,
  battery: Battery,
  zap: Zap,
  "git-commit-horizontal": GitCommitHorizontal,
  component: GitCommitHorizontal,
  microchip: Microchip,
  cable: Cable,
  "layout-grid": LayoutGrid,
  wrench: Wrench,
  "battery-charging": BatteryCharging,
  box: Box,
  package: Package,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Package;
  return <Icon className={className} aria-hidden="true" />;
}
