import { useEffect, useState } from "react";
import "./IntroAnimation.css";

const SLATS = 8;
const TOTAL_MS = 3400;

export default function IntroAnimation() {
  const [show, setShow] = useState(() => {
    try {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      return !reduce && !sessionStorage.getItem("intro-seen");
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(finish, TOTAL_MS);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  function finish() {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    document.body.style.overflow = "";
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="intro" dir="rtl" onClick={finish} aria-hidden="true">
      <div className="intro__door">
        {Array.from({ length: SLATS }).map((_, i) => (
          <span key={i} className="intro__slat" style={{ "--i": i }} />
        ))}
      </div>

      <div className="intro__content">
        <div className="intro__logo">
          <span>النخبة</span>
          <b>.</b>
          <span>للسيارات</span>
        </div>
        <div className="intro__track">
          <i className="intro__bar" />
        </div>
        <p className="intro__hint">جارٍ فتح المعرض</p>
      </div>
    </div>
  );
}