import { Link } from "react-router-dom";
import { useInventoryStore } from "../inventory-store-context.js";
import { carImage } from "../placeholder.js";
import { money } from "../data.js";
import CarActions from "../components/CarActions.jsx";
import Seo from "../components/Seo.jsx";
import "./saved-cars.css";

export default function Favorites() {
  const { cars, favorites } = useInventoryStore();
  const favoriteCars = cars.filter((car) =>
    favorites.some((id) => String(id) === String(car.id)),
  );

  return (
    <main className="saved-cars">
      <Seo title="سياراتي المفضلة | معرض النخبة" description="السيارات التي أضفتها إلى قائمتك المفضلة." />
      <header className="saved-cars-heading">
        <h1>سياراتي المفضلة</h1>
        <p>السيارات التي حفظتها على هذا الجهاز.</p>
      </header>
      {favoriteCars.length ? (
        <ul className="saved-cars-grid">
          {favoriteCars.map((car) => (
            <li className="saved-car" key={car.id}>
              <Link to={`/inventory/${car.id}`} className="saved-car-link">
                <img src={carImage(car)} alt={`${car.brand} ${car.model}`} />
                <div>
                  <h2>{car.brand} {car.model}</h2>
                  <p>{car.year} · {car.cond}</p>
                  <strong>{money(car.price)}</strong>
                </div>
              </Link>
              <CarActions car={car} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="saved-cars-empty">
          <p>لم تضف أي سيارة للمفضلة حتى الآن.</p>
          <Link className="saved-cars-button" to="/inventory">تصفح السيارات</Link>
        </div>
      )}
    </main>
  );
}
