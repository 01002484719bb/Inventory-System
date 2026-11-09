import { useState } from "react";
import { useInventoryStore } from "../inventory-store-context.js";
import { money } from "../data.js";
import { carImage } from "../placeholder.js";
import Seo from "../components/Seo.jsx";
import "./admin.css";

const createEmptyCar = () => ({
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: "",
  fuel: "بنزين",
  gear: "أوتوماتيك",
  cond: "مستعملة",
  km: 0,
  hp: 0,
  color: "#444444",
  image: "",
  hot: false,
});

export default function Admin() {
  const { cars, setCars, favorites, setFavorites, compare, setCompare, reviews, setReviews } = useInventoryStore();
  const [form, setForm] = useState(createEmptyCar);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm(createEmptyCar());
    setEditingId(null);
    setError("");
  };

  const saveCar = (event) => {
    event.preventDefault();
    const car = {
      ...form,
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      price: Number(form.price),
      km: Number(form.km),
      hp: Number(form.hp),
      image: form.image.trim(),
      id: editingId ?? Date.now(),
    };

    if (!car.brand || !car.model || !Number.isFinite(car.price) || car.price <= 0) {
      setError("أدخل الماركة والموديل وسعرًا صحيحًا أكبر من صفر.");
      return;
    }

    setCars(
      editingId
        ? cars.map((item) => (String(item.id) === String(editingId) ? car : item))
        : [car, ...cars],
    );
    resetForm();
  };

  const editCar = (car) => {
    setForm({ ...createEmptyCar(), ...car, image: car.image || "" });
    setEditingId(car.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCar = (car) => {
    if (!window.confirm(`هل تريد حذف ${car.brand} ${car.model}؟`)) return;
    setCars(cars.filter((item) => String(item.id) !== String(car.id)));
    setFavorites(favorites.filter((id) => String(id) !== String(car.id)));
    setCompare(compare.filter((id) => String(id) !== String(car.id)));
    setReviews(reviews.filter((review) => String(review.carId) !== String(car.id)));
  };

  return (
    <main className="admin-page">
      <Seo title="إدارة السيارات | معرض النخبة" description="إضافة وتعديل السيارات في بيانات هذا المتصفح." />
      <header className="admin-heading">
        <h1>إدارة السيارات</h1>
        <p>أضف السيارات وعدّلها أو احذفها من قائمة المعرض على هذا الجهاز.</p>
      </header>
      <p className="admin-local-notice" role="note">
        تنبيه: هذه لوحة محلية تجريبية بلا تسجيل دخول أو قاعدة بيانات. التغييرات تظهر فقط في هذا المتصفح، ولا تستخدمها لإدارة موقع منشور.
      </p>

      <form className="admin-form" onSubmit={saveCar}>
        <h2>{editingId ? "تعديل سيارة" : "إضافة سيارة جديدة"}</h2>
        <div className="admin-fields">
          <label>الماركة<input name="brand" value={form.brand} onChange={updateField} required /></label>
          <label>الموديل<input name="model" value={form.model} onChange={updateField} required /></label>
          <label>سنة الصنع<input name="year" type="number" min="1900" max="2100" value={form.year} onChange={updateField} required /></label>
          <label>السعر بالجنيه<input name="price" type="number" min="1" value={form.price} onChange={updateField} required /></label>
          <label>الحالة
            <select name="cond" value={form.cond} onChange={updateField}>
              <option>جديدة</option><option>مستعملة</option><option>كسر زيرو</option>
            </select>
          </label>
          <label>نوع الوقود<input name="fuel" value={form.fuel} onChange={updateField} /></label>
          <label>ناقل الحركة<input name="gear" value={form.gear} onChange={updateField} /></label>
          <label>المسافة المقطوعة (كم)<input name="km" type="number" min="0" value={form.km} onChange={updateField} /></label>
          <label>قوة المحرك (حصان)<input name="hp" type="number" min="0" value={form.hp} onChange={updateField} /></label>
          <label className="admin-image-field">مسار الصورة (مثال: /Cars/bmw.jpeg)<input name="image" value={form.image} onChange={updateField} /></label>
          <label className="admin-hot-field"><input name="hot" type="checkbox" checked={form.hot} onChange={updateField} /> سيارة مميزة</label>
        </div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit">{editingId ? "حفظ التعديلات" : "إضافة السيارة"}</button>
          {editingId && <button type="button" className="admin-secondary" onClick={resetForm}>إلغاء</button>}
        </div>
      </form>

      <section className="admin-inventory" aria-labelledby="admin-inventory-title">
        <h2 id="admin-inventory-title">السيارات الحالية ({cars.length})</h2>
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              <img src={carImage(car)} alt="" />
              <div className="admin-car-info">
                <strong>{car.brand} {car.model}</strong>
                <span>{car.year} · {money(car.price)}</span>
              </div>
              <div className="admin-car-actions">
                <button type="button" onClick={() => editCar(car)}>تعديل</button>
                <button type="button" className="admin-delete" onClick={() => deleteCar(car)}>حذف</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
