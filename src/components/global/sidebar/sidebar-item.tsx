import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  href: string;
  selected: boolean;
  notifications?: number;
};

const SidebarItem = ({ icon, title, href, selected, notifications }: Props) => {
  return (
    <li className="cursor-pointer my-[3px]">
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D] transition-colors duration-300",
          selected ? "bg-[#1d1d1d]" : ""
        )}
      >
        {/* Left Section: Icon and Title */}
        <div className="flex items-center gap-2 p-2 cursor-pointer">
          <div
            className={cn(
              "p-2 rounded-md text-gray-400 group-hover:text-[#00a87e] transition-transform duration-300",
              selected ? "text-[#00a87e]" : ""
            )}
          >
            {icon}
          </div>
          <span
            className={cn(
              "font-medium group-hover:text-[#9d9d9d] transition-all truncate w-32",
              selected ? "text-[#9d9d9d]" : "text-[#545454]"
            )}
          >
            {title}
          </span>
        </div>

        {/* Right Section: Notifications */}
        {notifications ? (
          <div
            className={cn(
              "flex items-center justify-center bg-[#ff3b30] text-white text-xs font-bold w-5 h-5 rounded-full mr-2",
              "transition-opacity duration-300",
              notifications > 0 ? "opacity-100" : "opacity-0"
            )}
          >
            {notifications}
          </div>
        ) : null}
      </Link>
    </li>
  );
};

export default SidebarItem;