import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SceneTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null); // white overlay that completes the fill

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
      },
    });

    // Text rushes toward viewer the entire duration
    tl.to(textRef.current, {
      scale: 20,
      ease: "none",
      duration: 1,
    }, 0);

    // From 60% onward: white fill bleeds in — the letter color floods the screen
    // This is what reveals the About section underneath seamlessly
    tl.to(fillRef.current, {
      opacity: 1,
      ease: "none",
      duration: 0.4,
    }, 0.6);

  }, { scope: sectionRef });

  return (
    <>
      {/*
        Outer section = black world.
        Text zooms toward viewer.
        White fill floods the screen from 60% scroll onward.
        About (white bg) appears underneath = seamless — content "inside" the letter.
      */}
      <section
        ref={sectionRef}
        aria-hidden
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Zooming text */}
        <div
          ref={textRef}
          style={{
            textAlign: "center",
            willChange: "transform",
            transformOrigin: "center center",
            userSelect: "none",
            lineHeight: 0.88,
            pointerEvents: "none",
          }}
        >
          {/* Small eyebrow — only visible at start */}
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(0.6rem, 0.9vw, 0.75rem)",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "1.6rem",
            margin: "0 0 1.6rem 0",
          }}>
            Barranquilla · Colombia
          </p>

          {/* Word 1 — white */}
          <p style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(4.5rem, 13vw, 11rem)",
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            lineHeight: 0.88,
            margin: 0,
          }}>
            UNA IGLESIA
          </p>

          {/* Word 2 — rose, fills screen last */}
          <p style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(4.5rem, 13vw, 11rem)",
            fontWeight: 400,
            color: "rgb(159,18,57)",
            letterSpacing: "-0.01em",
            lineHeight: 0.88,
            margin: 0,
          }}>
            VIVA.
          </p>
        </div>

        {/*
          White fill layer — rises from opacity 0 to 1 during the last 40% of the pin.
          Matches About's white background exactly.
          This is what makes the content appear "inside" the letter:
          the white floods the screen, the pin ends, About is already there in white.
        */}
        <div
          ref={fillRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "#ffffff",
            opacity: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      </section>
    </>
  );
}
