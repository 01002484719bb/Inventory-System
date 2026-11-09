import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInventoryStore } from "../inventory-store-context.js";

const links = [
  ["/", "الرئيسية"],
  ["/inventory", "المعرض"],
  ["/favorites", "المفضلة"],
  ["/compare", "المقارنة"],
  ["/admin", "الإدارة"],
  ["/services", "الخدمات"],
  ["/contact", "تواصل معنا"],
];

export default function Layout() {
  const { pathname } = useLocation();
  const { favorites, compare, initialStorageError } = useInventoryStore();
  const [storageError, setStorageError] = useState(initialStorageError);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const handleStorageStatus = (event) => setStorageError(event.detail);
    window.addEventListener("inventory-storage-status", handleStorageStatus);
    return () => window.removeEventListener("inventory-storage-status", handleStorageStatus);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll("main section, main article, main .iv-card-item");
    const pending = new Set(targets);
    targets.forEach((target) => {
      target.setAttribute("data-scroll-reveal", "hidden");
    });

    const revealVisible = () => {
      pending.forEach((target) => {
        const { top, bottom } = target.getBoundingClientRect();
        if (top >= window.innerHeight - 36 || bottom <= 0) return;
        target.setAttribute("data-scroll-reveal", "visible");
        pending.delete(target);
      });
    };

    revealVisible();
    window.addEventListener("scroll", revealVisible, { passive: true });

    return () => {
      window.removeEventListener("scroll", revealVisible);
      targets.forEach((target) => target.removeAttribute("data-scroll-reveal"));
    };
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeoutId = window.setTimeout(() => setShowIntro(false), 1700);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {showIntro && (
        <div className="intro-animation" aria-hidden="true">
          <img className="intro-animation__image" src="/Cars/commerce.jpeg" alt="" />
          <div className="intro-animation__content">
            <span className="intro-animation__eyebrow">ELITE AUTOMOTIVE</span>
            <div className="intro-animation__brand">النخبة<b>.</b>للسيارات</div>
            <p>سيارتك المناسبة، أقرب مما تتخيل</p>
            <span className="intro-animation__progress">
              <span />
            </span>
          </div>
        </div>
      )}
      <header>
        <div className="wrap nav">
          <Link to="/" className="logo">النخبة<b>.</b>للسيارات</Link>
          <nav>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "on" : "")}>
                {to === "/favorites" ? `${label} (${favorites.length})` : null}
                {to === "/compare" ? `${label} (${compare.length})` : null}
                {to !== "/favorites" && to !== "/compare" ? label : null}
              </NavLink>
            ))}
          </nav>
          <Link className="btn" to="/contact">احجز تجربة قيادة</Link>
        </div>
      </header>
      {storageError && <p className="storage-warning" role="status">{storageError}</p>}
      <Outlet />
      <footer>
        <div className="wrap">© ٢٠٢٦ معرض النخبة للسيارات</div>
      </footer>
    </>
  );
}