"use client";
import FeaturedLessons from "@/components/home/FeaturedLessons";
import FreeTrial from "@/components/home/FreeTrial";
import InfoSesson from "@/components/home/InfoSesson";
import RealPeople from "@/components/home/RealPeople";
import WhyLearning from "@/components/home/WhyLearning";
import dynamic from "next/dynamic";

const HeroSlider = dynamic(() => import("@/components/home/HeroSwiper"), {
  ssr: false,
});


export default function Home() {
  return (
    <main>
      <HeroSlider />
      <InfoSesson />
      <FeaturedLessons />
      <WhyLearning />
      <FreeTrial />
      <RealPeople />
    </main>
  );
}
