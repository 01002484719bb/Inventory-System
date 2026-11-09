import { Link } from "react-router-dom";
import { useInventoryStore } from "../inventory-store-context.js";
import { carImage } from "../placeholder.js";
import { money } from "../data.js";
import Seo from "../components/Seo.jsx";
import "./saved-cars.css";

const specs = [
  ["السعر", (car) => money(car.price)],
  ["الماركة والموديل", (car) => `${car.brand} ${car.model}`],
  ["سنة الصنع", (car) => car.year],
  ["الحالة", (car) => car.cond],
  ["المسافة المقطوعة", (car) => `${Number(car.km).toLocaleString("ar-EG")} كم`],
  ["الوقود", (car) => car.fuel],
  ["ناقل الحركة", (car) => car.gear],
  ["قوة المحرك", (car) => `${car.hp} حصان`],
];

export default function Compare() {
  const { cars, compare, setCompare } = useInventoryStore();
  const comparedCars = compare
    .map((id) => cars.find((car) => String(car.id) === String(id)))
    .filter(Boolean);

  const removeCar = (id) =>
    setCompare(compare.filter((carId) => String(carId) !== String(id)));

  return (
    <main className="saved-cars">
      <Seo title="مقارنة السيارات | معرض النخبة" description="قارن مواصفات وأسعار السيارات التي اخترتها." />
      <header className="saved-cars-heading">
        <h1>مقارنة السيارات</h1>
        <p>اختر حتى ٣ سيارات من المعرض لمقارنة مواصفاتها.</p>
      </header>
      {comparedCars.length ? (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">المواصفة</th>
                {comparedCars.map((car) => (
                  <th scope="col" key={car.id}>
                    <Link to={`/inventory/${car.id}`} className="compare-car">
                      <img src={carImage(car)} alt="" />
                      <span>{car.brand} {car.model}</span>
                    </Link>
                    <button type="button" onClick={() => removeCar(car.id)}>إزالة</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map(([label, getValue]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {comparedCars.map((car) => <td key={car.id}>{getValue(car) || "—"}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="saved-cars-empty">
          <p>لم تختر سيارات للمقارنة بعد.</p>
          <Link className="saved-cars-button" to="/inventory">اختيار سيارات</Link>
        </div>
      )}
    </main>
  );
}
