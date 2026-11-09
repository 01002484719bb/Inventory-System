import { useEffect, useState } from "react";
import "./CinematicIntro.css";

const INTRO_DURATION = 4000;

function shouldShowIntro() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CinematicIntro() {
  const [visible, setVisible] = useState(shouldShowIntro);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeoutId = window.setTimeout(finish, INTRO_DURATION);

    function finish() {
      setVisible(false);
    }

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="cinematic-intro" dir="rtl">
      <button
        className="cinematic-intro__skip"
        type="button"
        onClick={() => setVisible(false)}
      >
        تخطي
      </button>

      <div className="cinematic-intro__atmosphere" aria-hidden="true" />
      <div className="cinematic-intro__brand" aria-label="النخبة للسيارات">
        <span>النخبة</span>
        <i />
        <span>للسيارات</span>
      </div>
      <div className="cinematic-intro__tagline" aria-hidden="true">
        قيادة استثنائية. حضور لا يُنسى.
      </div>

      <div className="cinematic-intro__ring" aria-hidden="true" />
      <div className="cinematic-intro__floor" aria-hidden="true" />

      <svg
        className="cinematic-intro__car"
        viewBox="0 0 1200 650"
        role="img"
        aria-label="رسم ظلي لسيارة رياضية فاخرة"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="car-body" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#f4f4f5" stopOpacity=".22" />
            <stop offset=".28" stopColor="#77777d" stopOpacity=".25" />
            <stop offset=".58" stopColor="#18181c" stopOpacity=".96" />
            <stop offset="1" stopColor="#050507" />
          </linearGradient>
          <linearGradient id="car-window" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e9f4ff" stopOpacity=".36" />
            <stop offset=".48" stopColor="#4a5360" stopOpacity=".5" />
            <stop offset="1" stopColor="#090a0d" stopOpacity=".95" />
          </linearGradient>
          <linearGradient id="headlight-beam" x1="1" y1=".5" x2="0" y2=".5">
            <stop stopColor="#fff" stopOpacity=".84" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="taillight" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#ff152b" />
            <stop offset="1" stopColor="#ff5260" stopOpacity=".18" />
          </linearGradient>
          <radialGradient id="wheel-metal">
            <stop offset="0" stopColor="#a5a5aa" />
            <stop offset=".2" stopColor="#292a2f" />
            <stop offset=".72" stopColor="#111216" />
            <stop offset=".9" stopColor="#77777d" />
            <stop offset="1" stopColor="#09090b" />
          </radialGradient>
          <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="small-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <g className="cinematic-intro__headlight-beam" aria-hidden="true">
          <path d="M1010 399 1190 340 1190 465 1002 414Z" fill="url(#headlight-beam)" />
          <path d="M1015 408 1190 390 1190 427Z" fill="#fff" opacity=".6" filter="url(#soft-glow)" />
        </g>

        <g className="cinematic-intro__car-drawing">
          <path
            className="cinematic-intro__silhouette"
            d="M112 461
              Q121 439 157 423 L240 397
              Q275 388 302 356 L384 272
              Q410 246 453 237 L623 216
              Q667 211 700 239 L810 336
              Q833 357 873 365 L1011 390
              Q1045 397 1070 423 L1090 450
              Q1099 463 1087 478 L1050 490
              Q1044 427 981 414 Q910 402 884 468
              L478 477
              Q469 414 404 411 Q337 408 318 481
              L183 479 Q135 479 112 461Z"
            fill="url(#car-body)"
            stroke="#d8d8dc"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          <path
            d="m329 371 74-82q19-21 54-26l144-19q36-5 63 18l111 98-114 1-30-62q-10-19-33-19H456q-20 0-33 16l-56 72Z"
            fill="url(#car-window)"
            stroke="#a8a8ad"
            strokeOpacity=".52"
            strokeWidth="2"
          />
          <path d="m610 249 3 108" fill="none" stroke="#e4e4e7" strokeOpacity=".42" strokeWidth="3" />
          <path d="m459 252-30 106" fill="none" stroke="#e4e4e7" strokeOpacity=".28" strokeWidth="2" />
          <path d="m339 377 523-1" fill="none" stroke="#e5e5e7" strokeOpacity=".58" strokeWidth="2" />

          <path d="m164 424 103-24 34-28-81 19q-37 9-56 33Z" fill="#101014" stroke="#77777d" strokeOpacity=".62" strokeWidth="2" />
          <path d="m951 388 71 15q18 5 30 23l-73-14Z" fill="#151519" stroke="#dedee0" strokeOpacity=".6" strokeWidth="2" />
          <path d="m1024 398 48 20-37-4Z" fill="url(#taillight)" className="cinematic-intro__taillight" />
          <path d="m1015 399 39 15" fill="none" stroke="#ff283b" strokeWidth="4" filter="url(#small-glow)" />

          <path d="m1008 391 41 9-16 13-38-8Z" fill="#fff" className="cinematic-intro__headlight" />
          <path d="m1008 391 41 9-16 13-38-8Z" fill="none" stroke="#fff" strokeWidth="4" filter="url(#small-glow)" />

          <path d="m116 451 40-8-10 15-37 10Z" fill="url(#taillight)" />
          <path d="m130 478 926 0" fill="none" stroke="#f4f4f5" strokeOpacity=".5" strokeWidth="2" />
          <path d="m525 396 128-1" fill="none" stroke="#f4f4f5" strokeOpacity=".26" strokeWidth="2" />
          <path d="m690 401 128-2" fill="none" stroke="#f4f4f5" strokeOpacity=".25" strokeWidth="2" />
          <path d="m558 413 57 0" fill="none" stroke="#e11d2e" strokeOpacity=".9" strokeWidth="3" />
          <path d="m564 421 43 0" fill="none" stroke="#e11d2e" strokeOpacity=".45" strokeWidth="1.5" />
          <path d="m191 424 91-25" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="2" />
          <path d="m884 375 61 11" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />

          <g className="cinematic-intro__wheel" transform="translate(402 451)">
            <g className="cinematic-intro__wheel-spin">
              <circle r="63" fill="#050507" stroke="#aaaab0" strokeOpacity=".7" strokeWidth="3" />
              <circle r="53" fill="url(#wheel-metal)" stroke="#25262a" strokeWidth="5" />
              <circle r="40" fill="none" stroke="#888990" strokeOpacity=".65" strokeWidth="2" />
              <g stroke="#c6c6ca" strokeOpacity=".78" strokeWidth="4">
                <path d="M0-39V-8M0 39V8M-39 0h31M39 0H8M-28-28l22 22M28 28 6 6M28-28 6-6M-28 28l22-22" />
              </g>
              <circle r="10" fill="#24252a" stroke="#b8b8bd" strokeWidth="3" />
            </g>
          </g>
          <g className="cinematic-intro__wheel" transform="translate(978 451)">
            <g className="cinematic-intro__wheel-spin">
              <circle r="63" fill="#050507" stroke="#aaaab0" strokeOpacity=".7" strokeWidth="3" />
              <circle r="53" fill="url(#wheel-metal)" stroke="#25262a" strokeWidth="5" />
              <circle r="40" fill="none" stroke="#888990" strokeOpacity=".65" strokeWidth="2" />
              <g stroke="#c6c6ca" strokeOpacity=".78" strokeWidth="4">
                <path d="M0-39V-8M0 39V8M-39 0h31M39 0H8M-28-28l22 22M28 28 6 6M28-28 6-6M-28 28l22-22" />
              </g>
              <circle r="10" fill="#24252a" stroke="#b8b8bd" strokeWidth="3" />
            </g>
          </g>

          <path d="M86 520 Q600 485 1120 520" fill="none" stroke="#e11d2e" strokeOpacity=".72" strokeWidth="3" filter="url(#small-glow)" />
          <path d="M210 530 Q600 512 1010 530" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="2" />
        </g>
      </svg>

      <div className="cinematic-intro__floor-glow" aria-hidden="true" />
    </div>
  );
}
