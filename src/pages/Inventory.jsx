import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInventoryStore } from "../inventory-store-context.js";
import { carImage } from "../placeholder.js";
import Seo from "../components/Seo.jsx";
import CarActions from "../components/CarActions.jsx";
import "./inventory.css";

const F = {
  brand: "brand",
  model: "model",
  year: "year",
  price: "price",
  fuel: "fuel",
  transmission: "gear",
  condition: "cond",
};

const fmt = (n) => Number(n).toLocaleString("ar-EG");
const uniq = (key, cars) => [...new Set(cars.map((car) => car[key]).filter(Boolean))];

const SORTS = {
  new: { label: "الأحدث أولًا", fn: (a, b) => Number(b[F.year]) - Number(a[F.year]) },
  low: { label: "السعر: الأقل أولًا", fn: (a, b) => Number(a[F.price]) - Number(b[F.price]) },
  high: { label: "السعر: الأعلى أولًا", fn: (a, b) => Number(b[F.price]) - Number(a[F.price]) },
};

const EMPTY = {
  q: "",
  brand: "",
  model: "",
  fuel: "",
  transmission: "",
  condition: "",
  yearFrom: "",
  priceMax: "",
};

export default function Inventory() {
  const { cars: inventoryCars } = useInventoryStore();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...EMPTY,
    q: searchParams.get("q") || "",
  }));
  const [sort, setSort] = useState("new");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setFilter = (key) => (event) => {
    const { value } = event.target;
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "brand" ? { model: "" } : {}),
    }));
  };

  const brands = useMemo(() => uniq(F.brand, inventoryCars), [inventoryCars]);
  const fuels = useMemo(() => uniq(F.fuel, inventoryCars), [inventoryCars]);
  const transmissions = useMemo(() => uniq(F.transmission, inventoryCars), [inventoryCars]);
  const conditions = useMemo(() => uniq(F.condition, inventoryCars), [inventoryCars]);
  const years = useMemo(
    () => uniq(F.year, inventoryCars).sort((a, b) => Number(b) - Number(a)),
    [inventoryCars],
  );
  const models = useMemo(
    () => [
      ...new Set(
        inventoryCars
          .filter((car) => !filters.brand || car[F.brand] === filters.brand)
          .map((car) => car[F.model])
          .filter(Boolean)
      ),
    ],
    [filters.brand, inventoryCars]
  );
  const maxPrice = useMemo(
    () => Math.max(0, ...inventoryCars.map((car) => Number(car[F.price]) || 0)),
    [inventoryCars]
  );

  const cars = useMemo(() => {
    const query = filters.q.trim().toLowerCase();

    return inventoryCars.map((car, index) => ({ ...car, _id: car.id ?? index }))
      .filter((car) => {
        const searchable = `${car[F.brand] ?? ""} ${car[F.model] ?? ""}`.toLowerCase();
        if (query && !searchable.includes(query)) return false;
        if (filters.brand && car[F.brand] !== filters.brand) return false;
        if (filters.model && car[F.model] !== filters.model) return false;
        if (filters.fuel && car[F.fuel] !== filters.fuel) return false;
        if (filters.transmission && car[F.transmission] !== filters.transmission) return false;
        if (filters.condition && car[F.condition] !== filters.condition) return false;
        if (filters.yearFrom && Number(car[F.year]) < Number(filters.yearFrom)) return false;
        if (filters.priceMax && Number(car[F.price]) > Number(filters.priceMax)) return false;
        return true;
      })
      .sort(SORTS[sort].fn);
  }, [filters, sort, inventoryCars]);

  const activeFilters = Object.entries(filters).filter(([, value]) => value).length;

  const renderSelect = ({ field, label, options, all = "الكل" }) =>
    options.length > 0 && (
      <div className="iv-field">
        <label htmlFor={`iv-${field}`}>{label}</label>
        <select id={`iv-${field}`} value={filters[field]} onChange={setFilter(field)}>
          <option value="">{all}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );

  return (
    <main className="iv">
      <Seo
        title="معرض السيارات | معرض النخبة"
        description="تصفح سيارات معرض النخبة الجديدة والمستعملة، وابحث حسب الماركة والموديل والسعر والمواصفات."
      />
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
          value={filters.q}
          onChange={setFilter("q")}
        />
        <select
          className="iv-sort"
          aria-label="ترتيب"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          {Object.entries(SORTS).map(([key, option]) => (
            <option key={key} value={key}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="iv-toggle"
          aria-expanded={filtersOpen}
          aria-controls="iv-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          الفلاتر{activeFilters ? ` (${activeFilters})` : ""}
        </button>
      </div>

      <div className="iv-layout">
        <aside
          id="iv-filters"
          className={`iv-filters${filtersOpen ? " is-open" : ""}`}
          aria-label="فلاتر البحث"
        >
          {renderSelect({ field: "brand", label: "الماركة", options: brands })}
          {renderSelect({ field: "model", label: "الموديل", options: models })}
          {renderSelect({ field: "condition", label: "الحالة", options: conditions })}
          {renderSelect({ field: "fuel", label: "نوع الوقود", options: fuels })}
          {renderSelect({ field: "transmission", label: "ناقل الحركة", options: transmissions })}
          {renderSelect({
            field: "yearFrom",
            label: "سنة الصنع من",
            options: years,
            all: "أي سنة",
          })}

          {maxPrice > 0 && (
            <div className="iv-field">
              <label htmlFor="iv-price">
                أقصى سعر: <b>{filters.priceMax ? `${fmt(filters.priceMax)} ج.م` : "مفتوح"}</b>
              </label>
              <input
                id="iv-price"
                type="range"
                min="0"
                max={maxPrice}
                step="50000"
                value={filters.priceMax || maxPrice}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    priceMax: Number(event.target.value) >= maxPrice ? "" : event.target.value,
                  }))
                }
              />
            </div>
          )}

          <button
            type="button"
            className="iv-reset"
            onClick={() => setFilters(EMPTY)}
            disabled={!activeFilters}
          >
            مسح الفلاتر
          </button>
        </aside>

        <section aria-live="polite">
          <p className="iv-count">{cars.length} سيارة</p>

          {cars.length === 0 ? (
            <div className="iv-empty">
              <strong>مفيش سيارات بالمواصفات دي.</strong>
              <span>جرّب تقلل الفلاتر أو تزود السعر الأقصى.</span>
              <button type="button" className="iv-reset" onClick={() => setFilters(EMPTY)}>
                مسح الفلاتر
              </button>
            </div>
          ) : (
            <ul className="iv-grid">
              {cars.map((car) => (
                <li key={car._id}>
                  <div className="iv-card-item">
                    <Link to={`/inventory/${car._id}`} className="iv-card">
                      <div className="iv-img">
                        <img
                          src={carImage(car, F.brand)}
                          alt={`${car[F.brand]} ${car[F.model]} ${car[F.year]}`}
                          loading="lazy"
                        />
                        {car[F.condition] && <span className="iv-tag">{car[F.condition]}</span>}
                      </div>
                      <div className="iv-body">
                        <h3>
                          {car[F.brand]} {car[F.model]}
                        </h3>
                        <p className="iv-meta">
                          {[car[F.year], car[F.fuel], car[F.transmission]].filter(Boolean).join(" • ")}
                        </p>
                        <p className="iv-price">{fmt(car[F.price])} ج.م</p>
                      </div>
                    </Link>
                    <CarActions car={car} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
