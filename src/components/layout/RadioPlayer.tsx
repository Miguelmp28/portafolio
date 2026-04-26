import { useState, useRef } from "react";

interface Props {
  embedUrl: string;
  title: string;
}

/** Converts any YouTube URL to an embeddable autoplay URL */
function toAutoplayEmbed(url: string): string {
  if (!url) return "";

  // Already an embed URL
  if (url.includes("/embed/")) {
    return url.includes("autoplay") ? url : url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1");
  }

  // Watch URL: https://www.youtube.com/watch?v=ID&list=...
  const vidMatch = url.match(/[?&]v=([^&]+)/);
  if (vidMatch) {
    const id = vidMatch[1];
    const listMatch = url.match(/[?&]list=([^&]+)/);
    const list = listMatch ? `&list=${listMatch[1]}` : "";
    return `https://www.youtube.com/embed/${id}?autoplay=1${list}`;
  }

  // Short URL: https://youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
  }

  return url;
}

export default function RadioPlayer({ embedUrl, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasEmbed = Boolean(embedUrl?.trim());
  const autoplayUrl = toAutoplayEmbed(embedUrl);

  const toggle = () => {
    if (!hasEmbed || !iframeRef.current) return;
    // Set src synchronously within the user-gesture handler → browser allows autoplay
    iframeRef.current.src = playing ? "about:blank" : autoplayUrl;
    setPlaying((p) => !p);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-5 sm:right-5">
      {/* Hidden iframe — always in DOM, src controlled imperatively */}
      <iframe
        ref={iframeRef}
        title={title}
        src="about:blank"
        allow="autoplay; encrypted-media"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          top: -9999,
          left: -9999,
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />

      {/* Small circular button */}
      <button
        type="button"
        disabled={!hasEmbed}
        onClick={toggle}
        aria-label={playing ? "Detener emisora" : "Reproducir emisora"}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full shadow-lg",
          "transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
          playing
            ? "bg-rose-600 shadow-rose-600/30 hover:bg-rose-700"
            : "bg-stone-900 shadow-stone-900/30 hover:bg-rose-600",
        ].join(" ")}
      >
        <span
          className="flex h-4 w-4 items-end justify-center gap-[2.5px]"
          aria-hidden="true"
        >
          {playing ? (
            <>
              <span className="wave-bar w-[3px] rounded-full bg-white" style={{ height: 12 }} />
              <span className="wave-bar w-[3px] rounded-full bg-white" style={{ height: 12 }} />
              <span className="wave-bar w-[3px] rounded-full bg-white" style={{ height: 12 }} />
              <span className="wave-bar w-[3px] rounded-full bg-white" style={{ height: 12 }} />
            </>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
