"use client";

import React from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import * as reactSpring from "@react-spring/three";
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
        <ShaderGradientCanvas
          style={{
            position: "absolute",
            top: 0,
            zIndex: 5,
          }}
          pointerEvents="none"
        >
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.8&cAzimuthAngle=480&cDistance=4.5&cPolarAngle=110&cameraZoom=30&color1=%234833a4&color2=%23304DA1&color3=%236181ff&destination=onCanvas&embedMode=off&envPreset=dawn&format=gif&fov=30&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1.4&positionX=2.2&positionY=-0.5&positionZ=-1.4&range=enabled&rangeEnd=19.8&rangeStart=0&reflection=0.1&rotationX=120&rotationY=230&rotationZ=420&shader=defaults&toggleAxis=false&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=5.5&uSpeed=0.1&uStrength=2.5&uTime=0&wireframe=false&zoomOut=false"
          />
        </ShaderGradientCanvas>
      </div>
    </>
  );
}
