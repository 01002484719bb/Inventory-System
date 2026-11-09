import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { money } from "../data.js";
import { useInventoryStore } from "../inventory-store-context.js";
import { carImage } from "../placeholder.js";
import Seo from "../components/Seo.jsx";
import CarActions from "../components/CarActions.jsx";
import "./home.css";

const benefits = [
  ["اختيارات متنوعة", "قارن بين سيارات بمواصفات وأسعار مختلفة لتختار الأنسب لك."],
  ["معلومات واضحة", "راجع السعر وسنة الصنع والمواصفات الأساسية قبل التواصل."],
  ["تواصل مباشر", "اسأل فريق المعرض عن السيارة أو احجز تجربة قيادة."],
];

export default function Home() {
  const { cars } = useInventoryStore();
  const [query, setQuery] = useState("");
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const latestCars = [...cars].sort((a, b) => b.year - a.year).slice(0, 5);
  const featuredCars = cars.filter((car) => car.hot).slice(0, 3);

  const search = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/inventory?q=${encodeURIComponent(trimmedQuery)}` : "/inventory");
  };

  const moveCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector(".hm-car-card");
    const distance = card ? card.getBoundingClientRect().width + 18 : 300;
    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <main className="hm">
      <Seo
        title="معرض النخبة للسيارات | سيارات جديدة ومستعملة"
        description="اكتشف سيارات متنوعة في معرض النخبة، قارن المواصفات والأسعار وتواصل معنا للاستفسار أو حجز تجربة قيادة."
      />

      <section className="hm-hero">
        <div className="hm-hero-content">
          <span className="hm-eyebrow">اختيارك يبدأ من هنا</span>
          <h1>سيارتك المناسبة، أقرب مما تتخيل</h1>
          <p>تصفح سيارات المعرض، قارن المواصفات، واختَر بثقة.</p>
          <form className="hm-search" onSubmit={search} role="search">
            <label className="hm-visually-hidden" htmlFor="hm-search">
              ابحث عن سيارة
            </label>
            <input
              id="hm-search"
              type="search"
              placeholder="ابحث بالماركة أو الموديل"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="hm-button">
              ابحث الآن
            </button>
          </form>
          <Link className="hm-text-link" to="/inventory">
            تصفح كل السيارات <span aria-hidden="true">←</span>
          </Link>
        </div>
      </section>

      <section className="hm-section" aria-labelledby="hm-latest-title">
        <div className="hm-section-heading">
          <div>
            <span className="hm-eyebrow">وصلت حديثًا</span>
            <h2 id="hm-latest-title">أحدث السيارات</h2>
          </div>
          <div className="hm-carousel-controls" aria-label="تحكم في السيارات">
            <button type="button" aria-label="السيارات السابقة" onClick={() => moveCarousel(-1)}>
              ‹
            </button>
            <button type="button" aria-label="السيارات التالية" onClick={() => moveCarousel(1)}>
              ›
            </button>
          </div>
        </div>
        <div className="hm-carousel" ref={carouselRef}>
          {latestCars.map((car) => (
            <div className="hm-car-item" key={car.id}>
              <Link to={`/inventory/${car.id}`} className="hm-car-card">
                <div className="hm-car-image">
                  <img src={carImage(car)} alt={`${car.brand} ${car.model}`} />
                  <span>{car.cond}</span>
                </div>
                <div className="hm-car-info">
                  <h3>{car.brand} {car.model}</h3>
                  <p>{car.year} · {car.fuel} · {car.gear}</p>
                  <strong>{money(car.price)}</strong>
                </div>
              </Link>
              <CarActions car={car} />
            </div>
          ))}
        </div>
      </section>

      <section className="hm-section hm-benefits" aria-labelledby="hm-benefits-title">
        <div className="hm-section-heading">
          <div>
            <span className="hm-eyebrow">تجربة أسهل</span>
            <h2 id="hm-benefits-title">لماذا تختار معرض النخبة؟</h2>
          </div>
        </div>
        <div className="hm-benefit-grid">
          {benefits.map(([title, description], index) => (
            <article className="hm-benefit" key={title}>
              <span className="hm-benefit-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hm-section" aria-labelledby="hm-featured-title">
        <div className="hm-section-heading">
          <div>
            <span className="hm-eyebrow">اختيارات مميزة</span>
            <h2 id="hm-featured-title">سيارات مختارة لك</h2>
          </div>
          <Link className="hm-text-link" to="/inventory">
            كل السيارات <span aria-hidden="true">←</span>
          </Link>
        </div>
        <div className="hm-featured-grid">
          {featuredCars.map((car) => (
            <div className="hm-featured-item" key={car.id}>
              <Link className="hm-featured-card" to={`/inventory/${car.id}`}>
                <img src={carImage(car)} alt={`${car.brand} ${car.model}`} loading="lazy" />
                <span className="hm-featured-label">اختيار مميز</span>
                <div>
                  <h3>{car.brand} {car.model}</h3>
                  <p>{car.year} · {car.cond}</p>
                  <strong>{money(car.price)}</strong>
                </div>
              </Link>
              <CarActions car={car} />
            </div>
          ))}
        </div>
      </section>

      <section className="hm-cta">
        <div>
          <span className="hm-eyebrow">جاهز للخطوة التالية؟</span>
          <h2>اسألنا عن السيارة المناسبة لك</h2>
          <p>فريقنا جاهز لمساعدتك في معرفة التفاصيل وحجز تجربة قيادة.</p>
        </div>
        <Link className="hm-button" to="/contact">
          تواصل معنا
        </Link>
      </section>
    </main>
  );
}
