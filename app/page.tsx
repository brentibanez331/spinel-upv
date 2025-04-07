"use client";

import React from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center w-full items-center min-h-screen relative">
        <div className="z-10 leading-none flex font-bold flex-col items-center justify-center">
          <p style={{ fontSize: "2rem" }} className="font-semibold text-white">
            Ang Botong Wais, Ang Botong Panalo
          </p>
          <h1 style={{ fontSize: "10rem" }} className="text-white">
            BotWais
          </h1>
          <p style={{ fontSize: "1.5rem" }} className="font-normal text-white">
            Gabay mo sa bawat boto, tinig mo sa bawat desisyon
          </p>

          <div className="pt-4">
            <Button
              style={{ fontSize: "1.2rem" }}
              className=" rounded-full px-8 font-semibold bg-[#ffa600] hover:bg-[#ff8c00] "
            >
              <Link href="/sign-up" className="text-[#0C40BB] ">
                Try BotWais now!
              </Link>
            </Button>
          </div>
        </div>        
      </div>
    </>
  );
}
