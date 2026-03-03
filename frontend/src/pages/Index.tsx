import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UploadInterface from "@/components/UploadInterface";
import HowItWorks from "@/components/HowItWorks";
import SampleGallery from "@/components/SampleGallery";
import TechDetails from "@/components/TechDetails";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <UploadInterface />
        <HowItWorks />
        <SampleGallery />
        <TechDetails />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
