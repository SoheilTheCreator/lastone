import { useState } from "react";

type NavLink = {
  label: string;
  value: string;
};

type DashboardNavigatorProps = {
  links: NavLink[];
  action: (value: string) => void;
};

export default function DashboardNavigator({
  links,
  action,
}: DashboardNavigatorProps) {
  const [active, setActive] = useState<string>(links[0]?.value);

  const handleClick = (value: string) => {
    setActive(value);
    action(value);
  };

  return (
    <nav
      className="
        w-full
        bg-[var(--bg)]
        border border-[var(--secondary)]
        rounded-xl
        p-2
        flex gap-2
      "
    >
      {links.map((l) => {
        const isActive = active === l.value;

        return (
          <button
            key={l.value}
            type="button"
            onClick={() => handleClick(l.value)}
            className={`
              flex-1
              px-4 py-2
              rounded-lg
              text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? "bg-[var(--button)] text-[var(--font-alt)] shadow-sm"
                  : "text-[var(--font-clr)] hover:bg-[var(--secondary)]/25"
              }
            `}
          >
            {l.label}
          </button>
        );
      })}
    </nav>
  );
}
