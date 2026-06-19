"use client";
import FreeTrial from "@/components/home/FreeTrial";
import InfoSesson from "@/components/home/InfoSesson";
import RealPeople from "@/components/home/RealPeople";
import dynamic from "next/dynamic";

const HeroSlider = dynamic(() => import("@/components/home/HeroSwiper"), {
  ssr: false,
});


export default function Home() {
  return (
    <main>
      <HeroSlider />
      <InfoSesson />
      <FreeTrial />
      <RealPeople />
    </main>
  );
}
