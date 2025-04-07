"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export default function DynamicLogo() {
  const pathname = usePathname();

  const blackLogoPages = pathname === "/";
  const logoSrc = blackLogoPages ? "/logo-white.png" : "/logo-black.png";

  return (
    <Image
      src={logoSrc}
      alt="Logo"
      width={1000}
      height={1000}
      className="z-10 h-[30px] sm:h-[35px] w-auto object-contain"
    />
  );
}
