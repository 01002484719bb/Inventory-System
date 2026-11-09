import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fmt, money, waLink } from "../data.js";
import { useInventoryStore } from "../inventory-store-context.js";
import { carImage } from "../placeholder.js";
import Seo from "../components/Seo.jsx";
import CarActions from "../components/CarActions.jsx";
import "./car-details.css";

const terms = [12, 24, 36, 48, 60];

export default function CarDetails() {
  const { id } = useParams();
  const { cars, reviews, setReviews } = useInventoryStore();
  const car = cars.find((item) => String(item.id) === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [months, setMonths] = useState(36);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const images = useMemo(() => {
    if (!car) return [];
    if (car.images?.length) return car.images;
    if (car.image) return [car.image];
    return [0, 1, 2].map((variant) => carImage(car, "brand", variant));
  }, [car]);

  const structuredData = useMemo(() => {
    if (!car) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${car.brand} ${car.model} ${car.year}`,
      brand: { "@type": "Brand", name: car.brand },
      model: car.model,
      category: "سيارة",
      description: `${car.cond} ${car.brand} ${car.model} موديل ${car.year}.`,
      offers: {
        "@type": "Offer",
        priceCurrency: "EGP",
        price: car.price,
        availability: "https://schema.org/InStock",
      },
    };
  }, [car]);

  if (!car) {
    return (
      <main className="cd cd-not-found">
        <Seo
          title="السيارة غير موجودة | معرض النخبة"
          description="السيارة المطلوبة غير موجودة في المعرض حاليًا. تصفح السيارات المتاحة في معرض النخبة."
        />
        <h1>السيارة غير موجودة</h1>
        <p>قد تكون السيارة لم تعد متاحة أو أن الرابط غير صحيح.</p>
        <Link className="cd-button" to="/inventory">
          العودة إلى المعرض
        </Link>
      </main>
    );
  }

  const downPayment = Math.round((car.price * downPaymentPercent) / 100);
  const financedAmount = car.price - downPayment;
  const monthlyPayment = Math.ceil(financedAmount / months);
  const contactMessage = `مرحبًا، أود الاستفسار عن ${car.brand} ${car.model} موديل ${car.year}.`;
  const carReviews = reviews.filter((review) => String(review.carId) === String(car.id));
  const averageRating = carReviews.length
    ? (carReviews.reduce((total, review) => total + review.rating, 0) / carReviews.length).toFixed(1)
    : null;
  const specs = [
    ["الماركة والموديل", `${car.brand} ${car.model}`],
    ["سنة الصنع", car.year],
    ["الحالة", car.cond],
    ["المسافة المقطوعة", `${fmt(car.km)} كم`],
    ["نوع الوقود", car.fuel],
    ["ناقل الحركة", car.gear],
    ["قوة المحرك", `${fmt(car.hp)} حصان`],
  ];

  const submitReview = (event) => {
    event.preventDefault();
    const name = reviewName.trim();
    const comment = reviewComment.trim();
    if (!name || !comment) {
      setReviewMessage("اكتب اسمك ورأيك قبل الإرسال.");
      return;
    }

    setReviews([
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        carId: car.id,
        name,
        rating: Number(reviewRating),
        comment,
        createdAt: new Date().toISOString(),
      },
      ...reviews,
    ]);
    setReviewName("");
    setReviewRating("5");
    setReviewComment("");
    setReviewMessage("تم حفظ رأيك على هذا الجهاز.");
  };

  return (
    <main className="cd">
      <Seo
        title={`${car.brand} ${car.model} ${car.year} | معرض النخبة`}
        description={`تفاصيل ${car.brand} ${car.model} موديل ${car.year}: المواصفات والسعر ${money(car.price)}. تواصل مع معرض النخبة للاستفسار.`}
        structuredData={structuredData}
      />

      <nav className="cd-breadcrumb" aria-label="مسار الصفحة">
        <Link to="/">الرئيسية</Link>
        <span aria-hidden="true">/</span>
        <Link to="/inventory">المعرض</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{car.brand} {car.model}</span>
      </nav>

      <div className="cd-top">
        <div>
          <span className="cd-condition">{car.cond}</span>
          <h1>{car.brand} {car.model}</h1>
          <p>{car.year} · {car.fuel} · {car.gear}</p>
        </div>
        <div className="cd-detail-actions">
          <strong className="cd-price">{money(car.price)}</strong>
          <CarActions car={car} />
        </div>
      </div>

      <div className="cd-layout">
        <div className="cd-primary">
          <section className="cd-gallery" aria-label="صور السيارة">
            <div className="cd-main-image">
              <img src={images[selectedImage]} alt={`${car.brand} ${car.model} - صورة ${selectedImage + 1}`} />
              {!car.image && !car.images?.length && (
                <span className="cd-image-note">صورة توضيحية</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="cd-thumbnails" aria-label="اختر صورة">
                {images.map((image, index) => (
                  <button
                    type="button"
                    className={index === selectedImage ? "is-selected" : ""}
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`عرض الصورة ${index + 1}`}
                    aria-pressed={index === selectedImage}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="cd-panel" aria-labelledby="cd-specs-title">
            <h2 id="cd-specs-title">مواصفات السيارة</h2>
            <dl className="cd-specs">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="cd-panel cd-reviews" aria-labelledby="cd-reviews-title">
            <h2 id="cd-reviews-title">آراء العملاء</h2>
            <p className="cd-review-summary">
              {averageRating
                ? `التقييم ${averageRating} من ٥ (${carReviews.length} رأي)`
                : "لا توجد تقييمات بعد. كن أول من يشارك رأيه."}
            </p>
            {carReviews.length > 0 && (
              <ul className="cd-review-list">
                {carReviews.map((review) => (
                  <li key={review.id}>
                    <div className="cd-review-heading">
                      <strong>{review.name}</strong>
                      <span aria-label={`${review.rating} من 5 نجوم`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    </div>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
            <form className="cd-review-form" onSubmit={submitReview}>
              <h3>أضف تقييمك</h3>
              <label htmlFor="cd-review-name">الاسم</label>
              <input
                id="cd-review-name"
                maxLength={60}
                value={reviewName}
                onChange={(event) => setReviewName(event.target.value)}
                required
              />
              <label htmlFor="cd-review-rating">التقييم</label>
              <select id="cd-review-rating" value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{rating} من ٥ نجوم</option>
                ))}
              </select>
              <label htmlFor="cd-review-comment">رأيك</label>
              <textarea
                id="cd-review-comment"
                maxLength={500}
                rows={4}
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                required
              />
              {reviewMessage && <p className="cd-review-message" role="status">{reviewMessage}</p>}
              <button className="cd-button" type="submit">إرسال التقييم</button>
            </form>
          </section>
        </div>

        <aside className="cd-sidebar">
          <section className="cd-panel cd-actions" aria-label="التواصل حول السيارة">
            <span className="cd-muted">السعر</span>
            <strong className="cd-price">{money(car.price)}</strong>
            <Link className="cd-button" to="/contact">
              اطلب تجربة قيادة
            </Link>
            <a
              className="cd-button cd-button-whatsapp"
              href={waLink(contactMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              استفسر عبر واتساب
            </a>
            <p>تواصل معنا للتأكد من التوفر ومعرفة التفاصيل.</p>
          </section>

          <section className="cd-panel cd-finance" aria-labelledby="cd-finance-title">
            <h2 id="cd-finance-title">حاسبة تقديرية</h2>
            <p className="cd-muted">تقدير حسابي لتقسيم المبلغ، وليس عرض تمويل.</p>

            <label htmlFor="cd-down-payment">
              نسبة المقدم <b>{downPaymentPercent}٪</b>
            </label>
            <input
              id="cd-down-payment"
              type="range"
              min="0"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(event) => setDownPaymentPercent(Number(event.target.value))}
            />
            <p className="cd-calc-line">
              المقدم: <strong>{money(downPayment)}</strong>
            </p>

            <label htmlFor="cd-months">مدة التقسيط الافتراضية</label>
            <select id="cd-months" value={months} onChange={(event) => setMonths(Number(event.target.value))}>
              {terms.map((term) => (
                <option key={term} value={term}>{term} شهرًا</option>
              ))}
            </select>

            <div className="cd-monthly">
              <span>القسط الحسابي / شهر</span>
              <strong>{money(monthlyPayment)}</strong>
            </div>
            <small>
              تقدير دون احتساب فوائد أو رسوم. المبلغ والشروط النهائية تعتمد على جهة التمويل.
            </small>
          </section>
        </aside>
      </div>
    </main>
  );
}
