"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DynamicButton() {
  const pathname = usePathname();

  const blackText = pathname === "/";
  const colorSrc = blackText ? "text-white hover:text-black" : "text-black";

  return (
    <Button
      variant="ghost"
      className={`rounded-full px-4 sm:px-6 font-bold ${colorSrc}`}
      asChild
      size="sm"
    >
      <Link href="/sign-in">Sign In</Link>
    </Button>
  );
}
