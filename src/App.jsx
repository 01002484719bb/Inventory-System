import { useState, useEffect } from 'react';
import './App.css';
import Product from './components/Product';

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13.5h7V20H4zm9-11h7v9h-7zM4 4h7v6H4zm9 9h7v7h-7z" />
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5v10.5a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1V9.5zm2 .8V18h2v-6h10v6h2v-7.7L12 5.8 5 10.3z" />
    </svg>
  );
}

function InventoryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2zm0 2.2L5 7.2v9.6l7 3.8 7-3.8V7.2l-7-3zm-1 3.8h2v4h4v2h-4v4h-2v-4H7v-2h4z" />
    </svg>
  );
}

function SalesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a7 7 0 0 1 7 7c0 4.4-5.2 10.3-6.3 11.6a1 1 0 0 1-1.4 0C10.2 19.3 5 13.4 5 9a7 7 0 0 1 7-7zm0 4.4A2.6 2.6 0 1 0 12 11.6 2.6 2.6 0 0 0 12 6.4z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 16.5l6-6 4 4 7-9v12.5H4v-1.5z" />
    </svg>
  );
}

function CreditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9zm2.5-.5a.5.5 0 0 0-.5.5v9c0 .3.2.5.5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13zm2 5h9v2h-9v-2z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.8l4.4 4.4 1.4-1.4-4.4-4.4A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" />
    </svg>
  );
}

const navItems = [
  { label: 'لوحة القيادة', href: '#dashboard', icon: <DashboardIcon /> },
  { label: 'المخزون', href: '#inventory', icon: <InventoryIcon /> },
  { label: 'المبيعات', href: '#sales', icon: <SalesIcon /> },
  { label: 'التقارير', href: '#reports', icon: <TrendIcon /> },
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    document.body.classList.toggle('theme-dark', isDarkMode);
    document.body.classList.toggle('theme-light', !isDarkMode);
  }, [isDarkMode]);

  const [products, setProducts] = useState(() => {

    
    const savedProducts = localStorage.getItem("products");

     if (savedProducts) {
      return JSON.parse(savedProducts);
    }
  
    return [
      { id: 1, name: "فراخ بيضاء", price: 90, quantity: 50 },
      { id: 2, name: "أرز", price: 24, quantity: 100 },
      { id: 3, name: "سكر", price: 35, quantity: 70 },
    ];
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("5");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [saleProductId, setSaleProductId] = useState("");
const [saleQuantity, setSaleQuantity] = useState("");
const [sales, setSales] = useState(() => {
  const savedSales = localStorage.getItem("sales");
  return savedSales ? JSON.parse(savedSales) : [];
});

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [products, sales]);

  // إضافة منتج
  function addProduct() {
    if (!name.trim() || !costPrice || !price || !quantity || minQuantity === "" || Number(minQuantity) < 0) {
      alert("من فضلك أدخل جميع البيانات");
      return;
    }
  
    const newProduct = {
      id: Date.now(),
      name,
      costPrice: Number(costPrice),
      price: Number(price),
      quantity: Number(quantity),
      minQuantity: Number(minQuantity)
    };
  
    setProducts([...products, newProduct]);
  
    setName("");
    setCostPrice("");
    setPrice("");
    setQuantity("");
    setMinQuantity("5");
  }

  // حذف منتج
  function deleteProduct(id) {
    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    setProducts(updatedProducts);
  }

  // اختيار منتج للتعديل
  function editProduct(product) {
    setName(product.name);
    setCostPrice(String(product.costPrice || 0));
    setPrice(String(product.price));
    setQuantity(String(product.quantity));
    setMinQuantity(String(product.minQuantity ?? 5));
    setEditId(product.id);
  }

  // حفظ التعديل
  function updateProduct() {
    if (!name.trim() || price === "" || quantity === "" || minQuantity === "" || Number(minQuantity) < 0) {
      alert("من فضلك أدخل جميع البيانات");
      return;
    }

    if (Number(price) <= 0 || Number(quantity) < 0) {
      alert("السعر لازم يكون أكبر من صفر والكمية لا تقل عن صفر");
      return;
    }
 
    const updatedProducts = products.map((product) => {
      if (product.id === editId) {
        return {
          ...product,
          name,
          costPrice: Number(costPrice),
          price: Number(price),
          quantity: Number(quantity),
          minQuantity: Number(minQuantity)
        };
      }

      return product;
    });

    setProducts(updatedProducts);

    setEditId(null);
    setName("");
    setCostPrice("");
    setPrice("");
    setQuantity("");
    setMinQuantity("5");
  }


  const totalStockValue = products.reduce((total, product) => {
    return total + ((Number(product.costPrice) || 0) * product.quantity);
  }, 0);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.quantity) <= Number(product.minQuantity ?? 5)
  );

  function exportBackup() {
    const backup = {
      exportedAt: new Date().toISOString(),
      products,
      sales
    };
    const backupFile = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(backupFile);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = `inventory-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
  }



  function handleSale() {
    if (!saleProductId || !saleQuantity || Number(saleQuantity) <= 0) {
      alert("من فضلك اختر المنتج وأدخل كمية صحيحة");
      return;
    }
  
    const selectedProduct = products.find(
      (product) => product.id === Number(saleProductId)
    );
  
    if (!selectedProduct) {
      alert("المنتج غير موجود");
      return;
    }
  
    if (Number(saleQuantity) > selectedProduct.quantity) {
      alert("الكمية المطلوبة أكبر من المخزون المتاح");
      return;
    }
  
    const updatedProducts = products.map((product) => {
      if (product.id === Number(saleProductId)) {
        return {
          ...product,
          quantity: product.quantity - Number(saleQuantity)
        };
      }
  
      return product;
    });
  
    const newSale = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: Number(saleQuantity),
      costPrice: Number(selectedProduct.costPrice) || 0,
      price: selectedProduct.price,
      costTotal: (Number(selectedProduct.costPrice) || 0) * Number(saleQuantity),
      total: selectedProduct.price * Number(saleQuantity),
      date: new Date().toLocaleString("ar-EG")
    };

    setProducts(updatedProducts);
    setSales([...sales, newSale]);

    setSaleProductId("");
    setSaleQuantity("");

    alert("تم تسجيل البيع بنجاح");
  }

  function deleteSale(saleId) {
    const saleToDelete = sales.find((sale) => sale.id === saleId);
    if (!saleToDelete) return;

    const restoredProducts = products.map((product) => {
      if (product.id === saleToDelete.productId) {
        return {
          ...product,
          quantity: product.quantity + saleToDelete.quantity
        };
      }
      return product;
    });

    setProducts(restoredProducts);
    setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
  }

  const totalSales = sales.reduce((total, sale) => {
    return total + sale.total;
  }, 0);

  const totalCost = sales.reduce((total, sale) => {
    return total + (Number(sale.costTotal) || 0);
  }, 0);

  const grossProfit = totalSales - totalCost;


  return (
    <div className="app-shell">
      <header className="top-header" id="dashboard">
        <div className="brand-group">
          <div className="logo-mark">
            <WarehouseIcon />
          </div>
          <div>
            <p className="eyebrow">Enterprise Dashboard</p>
            <h1>نظام إدارة المخزون والمبيعات</h1>
          </div>
        </div>

        <nav className="main-nav" aria-label="التنقل الرئيسي">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            aria-label={isDarkMode ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع الداكن'}
            title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="nav-cta" type="button" onClick={exportBackup}>
            تنزيل نسخة احتياطية
          </button>
        </div>
      </header>

      <section className="stats-grid" aria-label="ملخص الحسابات">
        <div className="total-container stock-card">
          <span className="card-icon"><WarehouseIcon /></span>
          <h2>إجمالي قيمة المخزون</h2>
          <h3>{totalStockValue.toLocaleString("en-US")} جنيه</h3>
        </div>

        <div className="total-container sales-card">
          <span className="card-icon"><CreditIcon /></span>
          <h2>إجمالي المبيعات</h2>
          <h3>{totalSales.toLocaleString("en-US")} جنيه</h3>
        </div>

        <div className="total-container cost-card">
          <span className="card-icon"><SalesIcon /></span>
          <h2>تكلفة البضاعة المباعة</h2>
          <h3>{totalCost.toLocaleString("en-US")} جنيه</h3>
        </div>

        <div className="total-container profit-card">
          <span className="card-icon"><TrendIcon /></span>
          <h2>مجمل الربح</h2>
          <h3>{grossProfit.toLocaleString("en-US")} جنيه</h3>
        </div>
      </section>

      <section className="panel low-stock-panel" aria-live="polite" aria-label="تنبيهات المخزون المنخفض">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <span className="mini-icon"><InventoryIcon /></span>
            <h2>تنبيهات المخزون المنخفض</h2>
          </div>
          <span className="low-stock-count">{lowStockProducts.length} منتجات</span>
        </div>
        {lowStockProducts.length > 0 ? (
          <div className="low-stock-list">
            {lowStockProducts.map((product) => (
              <div className="low-stock-item" key={product.id}>
                <strong>{product.name}</strong>
                <span>المتاح: {product.quantity} | الحد الأدنى: {product.minQuantity ?? 5}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="low-stock-empty">كل المنتجات أعلى من حد المخزون الأدنى.</p>
        )}
      </section>

      <div className="content-grid">
        <section className="panel sales-panel" id="sales">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <span className="mini-icon"><SalesIcon /></span>
              <h2>تسجيل عملية بيع</h2>
            </div>
          </div>

          <div className="form-block">
            <select
              value={saleProductId}
              onChange={(e) => setSaleProductId(e.target.value)}
            >
              <option value="">اختر المنتج</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - المتاح: {product.quantity}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="الكمية المباعة"
              value={saleQuantity}
              onChange={(e) => setSaleQuantity(e.target.value)}
            />

            <button className="primary-btn" onClick={handleSale}>
              تسجيل البيع
            </button>
          </div>
        </section>

        <section className="panel product-panel" id="inventory">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <span className="mini-icon"><InventoryIcon /></span>
              <h2>{editId !== null ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
            </div>
          </div>

          <div className="form-block">
            <input
              type="text"
              placeholder="اسم المنتج"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="سعر شراء الوحدة"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="السعر"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="الكمية"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              type="number"
              min="0"
              placeholder="حد التنبيه للمخزون"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
            />

            <button
              type="button"
              className="primary-btn"
              onClick={editId !== null ? updateProduct : addProduct}
            >
              {editId !== null ? "حفظ التعديل" : "إضافة المنتج"}
            </button>
          </div>
        </section>
      </div>

      <section className="panel sales-history-panel" id="reports">
        <div className="panel-header history-header">
          <div className="panel-title-wrap">
            <span className="mini-icon"><TrendIcon /></span>
            <h2>سجل المبيعات</h2>
          </div>
          <div className="history-total">
            إجمالي المبيعات: {totalSales.toLocaleString("en-US")} جنيه
          </div>
        </div>

        <div className="search-container">
          <span className="search-icon"><SearchIcon /></span>
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>سعر الوحدة</th>
                <th>الإجمالي</th>
                <th>التاريخ</th>
                <th>الإجراء</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.price} جنيه</td>
                  <td>{sale.total} جنيه</td>
                  <td>{sale.date}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteSale(sale.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && <p className="empty-state">لا توجد عمليات بيع حتى الآن</p>}
      </section>

      <div className="products-container" aria-label="قائمة المنتجات">
        {filteredProducts.map((product) => (
          <Product
            key={product.id}
            name={product.name}
            costPrice={product.costPrice}
            price={product.price}
            quantity={product.quantity}
            onDelete={() => deleteProduct(product.id)}
            onEdit={() => editProduct(product)}
          />
        ))}
      </div>

      <footer className="app-footer">
        <div><strong>Create by:</strong> Abdulrahman Matar</div>
        <div><strong>Phone:</strong> 01274517670</div>
        <div><strong>Email:</strong> abdulrahman63bb@gmail.com</div>
      </footer>
    </div>
  );
}

export default App;
