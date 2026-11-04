
function Product({ name, costPrice, price, quantity, onDelete, onEdit }) {
  return (
    <div className="product-card">
      <div className="product-card__header">
        <span className="product-tag">منتج</span>
        <h2>{name}</h2>
      </div>

      <div className="product-info">
        <p><span>السعر:</span> {price} جنيه</p>
        <p><span>سعر الشراء:</span> {costPrice} جنيه</p>
        <p><span>الكمية:</span> {quantity}</p>
      </div>

      <div className="product-actions">
        <button className="edit-btn" onClick={onEdit}>تعديل</button>
        <button className="delete-btn" onClick={onDelete}>حذف</button>
      </div>
    </div>
  );
}

export default Product;