import RegisterBanner from "@/components/banners/RegisterBanner";
import CookieModal from "@/components/CookieModal";
import HeroSection from "@/components/main/HeroSection";
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
