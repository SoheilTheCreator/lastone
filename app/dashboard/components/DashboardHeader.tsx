import DashboardNavigator from "./DashboardNavigator";
import Nav from "../JSONs/NAV.json";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type DashboardHeaderProps = {
  handleTab: (value: string) => void;
};

export default function DashboardHeader({ handleTab }: DashboardHeaderProps) {
  const { screenName, logout } = useAuth();
  const [open, setOpen] = useState(true);

  const toggle = () => setOpen((v) => !v);

  return (
    <header className="px-8 w-full bg-[var(--bg)] border-b border-[var(--secondary)] pb-2">
      
      {/* Accordion Trigger */}
      <div
        onClick={toggle}
        className="
          flex items-center justify-between
          cursor-pointer select-none
          py-2
        "
      >
        {/* Welcome */}
        <h1 className=" px-6 py-4 text-lg font-semibold text-[var(--font-clr)]">
          خوش آمدی، {screenName}
        </h1>

        <div className="flex items-center gap-3">
          
          {/* Logout Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            className="
              px-4 py-1.5
              rounded-lg
              bg-[var(--button)]
              text-[var(--font-alt)]
              text-sm font-medium
              hover:brightness-110
              transition
              shadow-sm
            "
          >
            خروج
          </button>

          {/* Accordion Icon */}
          <ChevronDownIcon
            className={`mx-4
              w-5 h-5
              text-[var(--font-clr)]
              transition-transform duration-300
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </div>

      {/* Accordion Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${open ? "max-h-48 opacity-100 mt-3" : "max-h-0 opacity-0"}
        `}
      >
        <DashboardNavigator links={Nav} action={handleTab} />
      </div>
    </header>
  );
}
