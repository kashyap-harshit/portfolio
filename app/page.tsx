import Aurora from "@/components/Aurora";
import Image from "next/image";
import ShapeBlur from "@/components/ShapeBlur";
import Noise from "@/components/Noise";
import { Special_Gothic_Condensed_One, Carrois_Gothic } from "next/font/google";
import TechStack from "@/components/Techstack";

const spco = Special_Gothic_Condensed_One({
  weight: "400",
  subsets: ["latin"],
});
const carrois = Carrois_Gothic({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <div className="">
      <Aurora
        colorStops={["#3c153b", "#8b1e3f", "#8b1e3f"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className="h-screen w-screen grid grid-cols-2 ">
        <div className="relative overflow-hidden">
          <Noise
            patternSize={250}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={2}
            patternAlpha={15}
          />
          <div className=" h-screen ">
            <div className="flex justify-center items-center h-[95vh]">
              <div className="w-6/7 text-center">
                <p className={`text-6xl text-[#89bd9e] ${spco.className} `}>
                  HARSHIT KASHYAP SARMA
                </p>
                <p
                  className={`text-sm text-[#89bd9e] mt-2 ${carrois.className}`}
                >
                  {" "}
                  Highly capable Computer Science student specializing in
                  full-stack web development. Experienced in leading technical
                  execution for large-scale hackathons and university portals.
                  Strong in end-to-end development, deployment, and technical
                  communication. Seeking opportunities to apply technical depth
                  and leadership to deliver real impact
                </p>
                <TechStack />
              </div>
            </div>
            <div className="">footer</div>
          </div>
        </div>

        <div className="">World</div>
      </div>
    </div>
  );
}
