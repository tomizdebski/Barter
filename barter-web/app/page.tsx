import RegisterBanner from "@/components/banners/RegisterBanner";
import HeroSection from "@/components/HeroSection";
import TestimonialsBarter from "@/components/Testimonials";
import TrendingSection from "@/components/TrendingSection";
import Image from "next/image";

export default function Home() {
  return (
    <div >
      
      <HeroSection />
      <TrendingSection />
      <RegisterBanner />
      <TestimonialsBarter />
    </div>
  );
}
