import { useState } from "react";
import { useInventoryStore } from "../inventory-store-context.js";
import "./car-actions.css";

export default function CarActions({ car }) {
  const { favorites, setFavorites, compare, setCompare } = useInventoryStore();
  const [message, setMessage] = useState("");
  const key = String(car.id);
  const isFavorite = favorites.some((id) => String(id) === key);
  const isCompared = compare.some((id) => String(id) === key);

  const toggleFavorite = () => {
    setFavorites(
      isFavorite
        ? favorites.filter((id) => String(id) !== key)
        : [...favorites, car.id],
    );
    setMessage("");
  };

  const toggleCompare = () => {
    if (isCompared) {
      setCompare(compare.filter((id) => String(id) !== key));
      setMessage("");
      return;
    }

    if (compare.length >= 3) {
      setMessage("يمكنك مقارنة ٣ سيارات كحد أقصى.");
      return;
    }

    setCompare([...compare, car.id]);
    setMessage("");
  };

  return (
    <div className="car-actions">
      <button type="button" onClick={toggleFavorite} aria-pressed={isFavorite}>
        {isFavorite ? "♥ في المفضلة" : "♡ أضف للمفضلة"}
      </button>
      <button type="button" onClick={toggleCompare} aria-pressed={isCompared}>
        {isCompared ? "إزالة من المقارنة" : "＋ قارن"}
      </button>
      {message && <span className="car-actions-message" role="status">{message}</span>}
    </div>
  );
}
