  import { useState } from "react";
  import Seo from "../components/Seo.jsx";
  import "./contact.css";

// ⚠️ عدّل البيانات دي ببيانات المعرض الحقيقية
// (أو استورد رقم الواتساب من data.js بدل ما تكرره هنا)
const WA = "201000000000";
const PHONES = ["01000000000", "01100000000"];
const ADDRESS = "اكتب عنوان المعرض هنا";
const MAP_QUERY = "اكتب اسم المعرض أو العنوان للبحث في الخريطة";
const HOURS = [
  { day: "السبت – الخميس", time: "١٠ص – ٩م" },
  { day: "الجمعة", time: "٢م – ٩م" },
];

const SUBJECTS = ["شراء سيارة", "بيع سيارتي", "استبدال سيارة", "تمويل", "استفسار آخر"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 3) er.name = "اكتب اسمك الكامل";
    if (!/^(\+?20|0)?1[0125]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      er.phone = "اكتب رقم موبايل مصري صحيح، مثال: 01012345678";
    if (form.message.trim().length < 10) er.message = "اكتب رسالتك في 10 أحرف على الأقل";
    return er;
  };

  // الفورم بيفتح واتساب برسالة جاهزة (مفيش حاجة تحتاج سيرفر)
  const onSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    const text =
      `السلام عليكم، أنا ${form.name}\n` +
      `الموضوع: ${form.subject}\n` +
      `رقمي: ${form.phone}\n\n${form.message}`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  };

  return (
    <main className="ct">
      <Seo
        title="تواصل معنا | معرض النخبة للسيارات"
        description="تواصل مع معرض النخبة للاستفسار عن السيارات أو الخدمات أو لحجز تجربة قيادة."
      />
      <header className="ct-head">
        <h1>تواصل معنا</h1>
        <p>اكتب لنا أو كلمنا مباشرة، وبنرد عليك في نفس اليوم.</p>
      </header>

      <div className="ct-grid">
        {/* الفورم */}
        <section className="ct-card" aria-labelledby="ct-form-title">
          <h2 id="ct-form-title">ابعت رسالتك</h2>

          {sent ? (
            <div className="ct-success" role="status">
              <strong>اتفتحت محادثة الواتساب برسالتك.</strong>
              <span>اضغط إرسال هناك وهنكلمك في أقرب وقت.</span>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={() => setSent(false)}>
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="ct-field">
                <label htmlFor="name">الاسم</label>
                <input id="name" name="name" value={form.name} onChange={onChange}
                  autoComplete="name" aria-invalid={!!errors.name} />
                {errors.name && <small className="ct-err">{errors.name}</small>}
              </div>

              <div className="ct-field">
                <label htmlFor="phone">رقم الموبايل</label>
                <input id="phone" name="phone" type="tel" inputMode="tel" dir="ltr"
                  value={form.phone} onChange={onChange} autoComplete="tel"
                  aria-invalid={!!errors.phone} />
                {errors.phone && <small className="ct-err">{errors.phone}</small>}
              </div>

              <div className="ct-field">
                <label htmlFor="subject">بخصوص</label>
                <select id="subject" name="subject" value={form.subject} onChange={onChange}>
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="ct-field">
                <label htmlFor="message">الرسالة</label>
                <textarea id="message" name="message" rows="5" value={form.message}
                  onChange={onChange} aria-invalid={!!errors.message} />
                {errors.message && <small className="ct-err">{errors.message}</small>}
              </div>

              <button type="submit" className="ct-btn">أرسل عبر واتساب</button>
            </form>
          )}
        </section>

        {/* بيانات التواصل */}
        <aside className="ct-side">
          <section className="ct-card">
            <h2>بيانات المعرض</h2>
            <dl className="ct-info">
              <dt>العنوان</dt>
              <dd>{ADDRESS}</dd>

              <dt>الهاتف</dt>
              <dd>
                {PHONES.map((p) => (
                  <a key={p} href={`tel:${p}`} dir="ltr">{p}</a>
                ))}
              </dd>

              <dt>مواعيد العمل</dt>
              <dd>
                {HOURS.map((h) => (
                  <span key={h.day} className="ct-hours"><b>{h.day}</b> {h.time}</span>
                ))}
              </dd>
            </dl>
            <a className="ct-btn ct-btn-ghost" target="_blank" rel="noopener noreferrer"
              href={`https://wa.me/${WA}`}>
              محادثة واتساب مباشرة
            </a>
          </section>

          <div className="ct-map">
            <iframe
              title="موقع المعرض على الخريطة"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
