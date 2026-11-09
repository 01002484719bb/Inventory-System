import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CARS } from "../data.js";
import { carImage } from "../placeholder.js";
import "./inventory.css";

/* ⚠️ لو أسماء الحقول في data.js مختلفة، عدّلها هنا بس.
   (الحقول اللي مش موجودة في بياناتك بتختفي فلاترها لوحدها) */
const F = {
  brand: "brand",
  model: "model",
  year: "year",
  price: "price",
  fuel: "fuel",
  transmission: "transmission",
  condition: "condition",
};

const fmt = (n) => Number(n).toLocaleString("ar-EG");
const uniq = (k) => [...new Set(CARS.map((c) => c[k]).filter(Boolean))];

const SORTS = {
  new: { label: "الأحدث أولًا", fn: (a, b) => b[F.year] - a[F.year] },
  low: { label: "السعر: الأقل أولًا", fn: (a, b) => a[F.price] - b[F.price] },
  high: { label: "السعر: الأعلى أولًا", fn: (a, b) => b[F.price] - a[F.price] },
};

const EMPTY = { q: "", brand: "", model: "", fuel: "", transmission: "", condition: "", yearFrom: "", priceMax: "" };

export default function Inventory() {
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState("new");
  const [open, setOpen] = useState(false); // فتح الفلاتر على الموبايل

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value, ...(k === "brand" ? { model: "" } : {}) }));

  const brands = useMemo(() => uniq(F.brand), []);
  const fuels = useMemo(() => uniq(F.fuel), []);
  const gears = useMemo(() => uniq(F.transmission), []);
  const conds = useMemo(() => uniq(F.condition), []);
  const years = useMemo(() => uniq(F.year).sort((a, b) => b - a), []);
  const models = useMemo(
    () => [...new Set(CARS.filter((c) => !f.brand || c[F.brand] === f.brand).map((c) => c[F.model]))],
    [f.brand]
  );
  const maxPrice = useMemo(() => Math.max(...CARS.map((c) => Number(c[F.price]) || 0)), []);

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return CARS.map((c, i) => ({ ...c, _id: c.id ?? i }))
      .filter((c) => {
        if (q && !`${c[F.brand]} ${c[F.model]}`.toLowerCase().includes(q)) return false;
        if (f.brand && c[F.brand] !== f.brand) return false;
        if (f.model && c[F.model] !== f.model) return false;
        if (f.fuel && c[F.fuel] !== f.fuel) return false;
        if (f.transmission && c[F.transmission] !== f.transmission) return false;
        if (f.condition && c[F.condition] !== f.condition) return false;
        if (f.yearFrom && c[F.year] < Number(f.yearFrom)) return false;
        if (f.priceMax && c[F.price] > Number(f.priceMax)) return false;
        return true;
      })
      .sort(SORTS[sort].fn);
  }, [f, sort]);

  const active = Object.entries(f).filter(([, v]) => v).length;

  const select = ({ k, label, options, all = "الكل" }) =>
    options.length > 0 && (
      <div className="iv-field">
        <label htmlFor={`iv-${k}`}>{label}</label>
        <select id={`iv-${k}`} value={f[k]} onChange={set(k)}>
          <option value="">{all}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );

  return (
    <main className="iv">
      <header className="iv-head">
        <h1>المعرض</h1>
        <p>تصفح السيارات المتاحة وفلتر حسب اللي يناسبك.</p>
      </header>

      <div className="iv-bar">
        <input
          className="iv-search"
          type="search"
          placeholder="ابحث بالماركة أو الموديل"
          aria-label="بحث"
          value={f.q}
          onChange={set("q")}
        />
        <select className="iv-sort" aria-label="ترتيب" value={sort} onChange={(e) => setSort(e.target.value)}>
          {Object.entries(SORTS).map(([k, s]) => (
            <option key={k} value={k}>{s.label}</option>
          ))}
        </select>
        <button type="button" className="iv-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          الفلاتر{active ? ` (${active})` : ""}
        </button>
      </div>

      <div className="iv-layout">
        <aside className={`iv-filters ${open ? "is-open" : ""}`} aria-label="فلاتر البحث">
          {select({ k: "brand", label: "الماركة", options: brands })}
          {select({ k: "model", label: "الموديل", options: models })}
          {select({ k: "condition", label: "الحالة", options: conds })}
          {select({ k: "fuel", label: "نوع الوقود", options: fuels })}
          {select({ k: "transmission", label: "ناقل الحركة", options: gears })}
          {select({ k: "yearFrom", label: "سنة الصنع من", options: years, all: "أي سنة" })}

          <div className="iv-field">
            <label htmlFor="iv-price">
              أقصى سعر: <b>{f.priceMax ? `${fmt(f.priceMax)} ج.م` : "مفتوح"}</b>
            </label>
            <input
              id="iv-price"
              type="range"
              min="0"
              max={maxPrice}
              step="50000"
              value={f.priceMax || maxPrice}
              onChange={(e) => setF((s) => ({ ...s, priceMax: Number(e.target.value) >= maxPrice ? "" : e.target.value }))}
            />
          </div>

          <button type="button" className="iv-reset" onClick={() => setF(EMPTY)} disabled={!active}>
            مسح الفلاتر
          </button>
        </aside>

        <section aria-live="polite">
          <p className="iv-count">{list.length} سيارة</p>

          {list.length === 0 ? (
            <div className="iv-empty">
              <strong>مفيش سيارات بالمواصفات دي.</strong>
              <span>جرّب تقلل الفلاتر أو تزود السعر الأقصى.</span>
              <button type="button" className="iv-reset" onClick={() => setF(EMPTY)}>مسح الفلاتر</button>
            </div>
          ) : (
            <ul className="iv-grid">
              {list.map((c) => (
                <li key={c._id}>
                  <Link to={`/inventory/${c._id}`} className="iv-card">
                    <div className="iv-img">
                      <img src={carImage(c, F.brand)} alt={`${c[F.brand]} ${c[F.model]} ${c[F.year]}`} loading="lazy" />
                      {c[F.condition] && <span className="iv-tag">{c[F.condition]}</span>}
                    </div>
                    <div className="iv-body">
                      <h3>{c[F.brand]} {c[F.model]}</h3>
                      <p className="iv-meta">
                        {[c[F.year], c[F.fuel], c[F.transmission]].filter(Boolean).join(" • ")}
                      </p>
                      <p className="iv-price">{fmt(c[F.price])} ج.م</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
