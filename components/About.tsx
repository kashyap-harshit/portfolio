"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Noise from "./Noise";
import TicTacToeFrame from "./TicTacToeFrame";
import SongPlayer from "./SongPlayer";
import { Arizonia, Quicksand } from "next/font/google";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { GITHUB_PROFILE } from "@/data/projects";

const meine = Arizonia({ subsets: ["latin"], weight: "400" });
const caveat = Quicksand({ subsets: ["latin"], weight: "400" });

// TODO: replace placeholders with your real links / assets.
const LINKEDIN = "https://www.linkedin.com/in/your-handle"; // placeholder
const RESUME = "/resume.pdf"; // drop resume.pdf into /public
const SONG_SRC = "/something.mp3"; // drop your track into /public
const SONG_TITLE = "Something - Beatles";

// How long the floating player lingers after you pause it (ms).
const LINGER_MS = 5000;

const links = [
  { label: "LinkedIn", href: LINKEDIN, Icon: FaLinkedin },
  { label: "GitHub", href: GITHUB_PROFILE, Icon: FaGithub },
  { label: "Resume", href: RESUME, Icon: FiFileText },
];

function About() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1

  // The in-card player acts as a sentinel: once it scrolls above the top of the
  // viewport, the floating corner player can appear.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  const scrolledPastRef = useRef(false);
  // After a pause, keep the floating player around for LINGER_MS, then drop it.
  const [lingering, setLingering] = useState(false);
  const lingerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // First-visit "sound warning" prompt (shown once, ever — tracked in
  // localStorage). The visitor chooses Play (a gesture, so sound is allowed) or
  // declines.
  const [showWarning, setShowWarning] = useState(false);

  const floatingShown = scrolledPast && (playing || lingering);

  const clearLinger = () => {
    if (lingerTimer.current) {
      clearTimeout(lingerTimer.current);
      lingerTimer.current = null;
    }
  };

  // Wire up the shared <audio> element.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => {
      setPlaying(true);
      clearLinger();
      setLingering(false);
    };
    const onPause = () => {
      setPlaying(false);
      // If we paused while the floating player was visible, let it linger.
      if (scrolledPastRef.current) {
        setLingering(true);
        clearLinger();
        lingerTimer.current = setTimeout(() => setLingering(false), LINGER_MS);
      }
    };
    const onTime = () =>
      setProgress(a.duration ? a.currentTime / a.duration : 0);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    a.addEventListener("timeupdate", onTime);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
      a.removeEventListener("timeupdate", onTime);
      clearLinger();
    };
  }, []);

  // Detect when the in-card player has scrolled above the viewport top.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const past =
          !entry.isIntersecting && entry.boundingClientRect.top <= 0;
        scrolledPastRef.current = past;
        setScrolledPast(past);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Show the warning only on the very first visit.
  useEffect(() => {
    try {
      if (!localStorage.getItem("sound-warning-seen")) {
        localStorage.setItem("sound-warning-seen", "1");
        setShowWarning(true);
      }
    } catch {
      /* localStorage unavailable — just skip the modal */
    }
  }, []);

  const acceptPlay = () => {
    audioRef.current?.play().catch(() => {});
    setShowWarning(false);
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = Number(e.target.value) * a.duration;
  };

  return (
    <div className="w-full flex flex-col items-center mt-4 border-b border-[#8b1e3f] pb-4">
      <span className={`${meine.className} text-4xl mb-4`}>About Me </span>

      {/* Single shared audio source for both the in-card and floating players. */}
      <audio ref={audioRef} src={SONG_SRC} preload="metadata" />

      <div className="relative w-[90%] mb-4">
        <TicTacToeFrame />
        <div className="relative overflow-hidden isolate">
          <Noise
            fullScreen={false}
            patternSize={250}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={2}
            patternAlpha={35}
          />
          <div className="relative">
            {/* Top: a few lines about me */}
            <p className={`${caveat.className} p-3 text-sm leading-relaxed`}>
              I&apos;m Harshit — an audio-tech and full-stack engineer who likes
              living where DSP meets machine learning. I build synths and VST
              plugins, ship multi-tenant backends, and train models for security
              and sound. Currently heading to UPF Barcelona for a Master&apos;s
              in Sound &amp; Music Computing.
            </p>

            {/* Bottom: song player (left) + links (right) */}
            <div
              className={`${caveat.className} border-t-2 border-[#8b1e3f] p-3 flex flex-wrap items-center justify-between gap-4`}
            >
              <div ref={sentinelRef}>
                <SongPlayer
                  title={SONG_TITLE}
                  playing={playing}
                  progress={progress}
                  onToggle={toggle}
                  onSeek={seek}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {links.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#f0c987] transition-colors"
                  >
                    <Icon className="shrink-0 text-base" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating corner player — flies into the top-left while playing (and
          scrolled past the card), lingers 5s after a pause, then fades away. */}
      <div
        className={`fixed -top-1 -left-1 z-50 transition-all duration-200 ease-linear ${
          floatingShown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-24 pointer-events-none"
        }`}
      >
        <div className="relative p-2">
          <TicTacToeFrame />
          <SongPlayer
            title={SONG_TITLE}
            playing={playing}
            progress={progress}
            onToggle={toggle}
            onSeek={seek}
          />
        </div>
      </div>

      {/* First-visit sound-warning countdown modal */}
      {showWarning && (
        <div className="fixed inset-0 z-60 grid place-items-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-[#1a0a18] px-8 py-7 mx-4 text-center">
            <TicTacToeFrame />
            <p className={`${caveat.className} text-lg text-[#89bd9e]`}>
              I have a song for you :)
            </p>
            <div className="mt-5 flex flex-col flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={acceptPlay}
                className={`${caveat.className} relative px-5 py-2 text-[#f0c987]  transition-colors cursor-pointer`}
              >
                <TicTacToeFrame />
                play
              </button>
              <button
                type="button"
                onClick={() => setShowWarning(false)}
                className={`${caveat.className} relative px-5 py-2 text-[#f0c987] transition-colors cursor-pointer`}
              >
                <TicTacToeFrame />
                naah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
