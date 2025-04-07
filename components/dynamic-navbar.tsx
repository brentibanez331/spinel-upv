"use client";

import { usePathname } from "next/navigation";

export default function DynamicNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navColor = pathname === "/" ? "bg-none" : "bg-white";

  return (
    <div
      className={` w-full flex justify-between items-center py-6 px-8 text-sm flex-wrap ${navColor}`}
    >
      {children}
    </div>
  );
}
