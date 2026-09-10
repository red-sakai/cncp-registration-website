import BokehBackground from "@/components/create-event/bokeh-background";
import Squares from "@/components/create-event/squares-background";

export default function AdminLoginBackground() {
  return (
    <>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0015] via-[#1a0533] to-[#0d1137]" />
      
      {/* Bokeh Background Effect */}
      <BokehBackground />
      
      {/* Grid Background */}
      <Squares direction="diagonal" speed={0.3} />
    </>
  );
}
