"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center bg-gradient-to-br from-[#304da1] to-[#6155a5] w-full items-center min-h-screen relative overflow-hidden opacity-90">
      {/* <Image
        src="/bg-gradient.png"
        alt="Cover Background"
        fill
        className="object-cover z-0"
        priority
      /> */}

      <div className="z-10 leading-none flex font-bold flex-col items-center justify-center text-center">
        <p className="text-3xl font-semibold text-white">
          Ang Botong Wais, Ang Botong Panalo
        </p>
        <h1 style={{ fontSize: "10rem" }} className="text-white">
          BotWais
        </h1>
        <p className="font-normal text-2xl text-white">
          Gabay mo sa bawat boto, tinig mo sa bawat desisyon
        </p>

        <div className="pt-4">
          <Button
            style={{ fontSize: "1.2rem" }}
            className="rounded-full px-8 font-semibold bg-[#ffa600] hover:bg-[#ff8c00] shadow-lg"
          >
            <Link href="/sign-up" className="text-[#0C40BB]">
              Subukan ngayon!
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
