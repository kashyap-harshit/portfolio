import Aurora from "@/components/Aurora";
import Image from "next/image";
import ShapeBlur from "@/components/ShapeBlur";
import Noise from "@/components/Noise";
import {
  Special_Gothic_Condensed_One,
  Carrois_Gothic,
  Caveat,
} from "next/font/google";
import TechStack from "@/components/Techstack";
import RandomFact from "@/components/RandomFact";

const spco = Special_Gothic_Condensed_One({
  weight: "400",
  subsets: ["latin"],
});
const carrois = Carrois_Gothic({
  subsets: ["latin"],
  weight: "400",
});

const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
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
          <div className=" h-screen flex flex-col justify-between">
            <div className="flex justify-center items-center flex-col w-full h-[95vh]">
              <div className="w-6/7">
                <div className=" text-center">
                  <p className={`text-6xl text-[#89bd9e] ${spco.className} `}>
                    HARSHIT KASHYAP SARMA
                  </p>
                  <p
                    className={`text-lg text-[#89bd9e] mt-2 ${caveat.className}`}
                  >
                    {" "}
                    Highly capable Computer Science student specializing in
                    full-stack web development. Seeking opportunities to apply
                    technical depth and leadership to deliver real impact and
                    something dramatic should come here.
                  </p>
                  <div className={`${spco.className}`}>
                    <TechStack />
                  </div>
                </div>
              </div>
              <div className="scrollspy mt-4 text-center text-base ">
                <div className={`${spco.className}`}>EVENTS</div>
                <div className={`${spco.className}`}>PROJECTS</div>
                <div className={`${spco.className}`}>BLOGS</div>
              </div>
            </div>
            <div
              className={`${caveat.className} text-sm text-center w-full text-[#f0c987]`}
            >
              <RandomFact />
            </div>
          </div>
        </div>

        <div className="">World</div>
      </div>
    </div>
  );
}
