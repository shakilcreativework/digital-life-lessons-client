"use client";
import FeaturedLessons from "@/components/home/FeaturedLessons";
import FreeTrial from "@/components/home/FreeTrial";
import InfoSesson from "@/components/home/InfoSesson";
import RealPeople from "@/components/home/RealPeople";
import WhyLearning from "@/components/home/WhyLearning";
import { DynamicStatsSection } from "@/components/home/DynamicStatsSection";
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
      <DynamicStatsSection type={'top-contributors'} title={'Top Contributors of the Week'} />
      <DynamicStatsSection type={'most-saved'} title={'Most Saved Lessons'} />
      <FreeTrial />
      <RealPeople />
    </main>
  );
}
