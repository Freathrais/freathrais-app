import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import RecentPostsSection from "@/components/home/RecentPostsSection";
import SocialMediaSection from "@/components/home/SocialMediaSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <RecentPostsSection />
      <SocialMediaSection />
      <CTASection />
    </div>
  );
}
