import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faGem } from "@fortawesome/free-solid-svg-icons";
import { iconMap } from "@/lib/fontawesome";
import { cn } from "@/lib/utils";

interface FaIconProps {
  name?: string | null;
  icon?: IconDefinition;
  size?: "xs" | "sm" | "lg" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x";
  className?: string;
}

export function FaIcon({ name, icon, size, className }: FaIconProps) {
  // Resolve icon from direct prop, iconMap, or fallback to faGem
  let resolvedIcon: IconDefinition = faGem;

  if (icon) {
    resolvedIcon = icon;
  } else if (name && iconMap[name]) {
    resolvedIcon = iconMap[name];
  } else if (name) {
    console.warn(`FontAwesome icon '${name}' not found in iconMap. Falling back to faGem.`);
  }

  return (
    <FontAwesomeIcon
      icon={resolvedIcon}
      size={size}
      className={cn("inline-block", className)}
      aria-hidden="true"
    />
  );
}
