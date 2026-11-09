import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import "./services.css";

const services = [
  {
    number: "01",
    title: "حلول التمويل",
    description: "تعرّف على خيارات التمويل المتاحة، وناقش تفاصيلها وشروطها مع فريق المعرض قبل اتخاذ القرار.",
    icon: "٪",
  },
  {
    number: "02",
    title: "التأمين",
    description: "استفسر عن خيارات التأمين المناسبة لسيارتك، وما تحتاج إليه لمقارنة التغطيات.",
    icon: "✓",
  },
  {
    number: "03",
    title: "الصيانة",
    description: "اسأل عن إرشادات العناية بالسيارة ومواعيد الصيانة الدورية المناسبة لها.",
    icon: "⚙",
  },
  {
    number: "04",
    title: "استبدال سيارتك",
    description: "تواصل معنا لمناقشة استبدال سيارتك الحالية بسيارة أخرى من السيارات المتاحة.",
    icon: "↔",
  },
];

export default function Services() {
  return (
    <main className="sv">
      <Seo
        title="خدمات السيارات | معرض النخبة"
        description="تعرف على خدمات معرض النخبة: الاستفسار عن التمويل والتأمين والصيانة واستبدال السيارات."
      />

      <section className="sv-hero">
        <span className="sv-eyebrow">خدماتنا</span>
        <h1>مساعدتك لا تتوقف عند اختيار السيارة</h1>
        <p>اسأل فريق المعرض عن الخدمات المتاحة والتفاصيل المناسبة لاحتياجاتك.</p>
      </section>

      <section className="sv-grid" aria-label="خدمات المعرض">
        {services.map((service) => (
          <article className="sv-card" key={service.number}>
            <div className="sv-card-top">
              <span className="sv-icon" aria-hidden="true">{service.icon}</span>
              <span className="sv-number">{service.number}</span>
            </div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <Link to="/contact" className="sv-link">
              اسأل عن الخدمة <span aria-hidden="true">←</span>
            </Link>
          </article>
        ))}
      </section>

      <section className="sv-note">
        <div>
          <h2>تحتاج إلى تفاصيل أكثر؟</h2>
          <p>تواصل معنا لمعرفة مدى توفر الخدمة وشروطها قبل زيارتك.</p>
        </div>
        <Link className="sv-button" to="/contact">
          تواصل معنا
        </Link>
      </section>
    </main>
  );
}
