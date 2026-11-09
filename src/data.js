export const WA = "201000000000"; // غيّره لرقمك بصيغة دولية بدون +
export const CARS = [
  { id: 1, brand: "مرسيدس", model: "S-Class", year: 2019, price: 2650000, fuel: "بنزين", gear: "أوتوماتيك", cond: "كسر زيرز", km: 0, hp: 204, color: "#8b8d94", hot: true , image: "/Cars/masids.jpeg" },
  { id: 2, brand: "B M W", model: "", year: 2023, price: 3900000, fuel: "بنزين", gear: "أوتوماتيك", cond: "مستعملة", km: 21000, hp: 340, color: "#1c3a5c", hot: true, image: "/Cars/bmww.jpeg" },
  { id: 3, brand: "تويوتا", model: " كورولا 2026", year: 2026, price: 1350000, fuel: "هايبرد", gear: "أوتوماتيك", cond: "جديدة", km: 0, hp: 140, color: "#c9ccd1", hot: true, image: "/Cars/crolla.jpeg" },
  { id: 4, brand: "هيونداي", model: "توسان", year: 2022, price: 1180000, fuel: "بنزين", gear: "أوتوماتيك", cond: "مستعملة", km: 48000, hp: 156, color: "#7a1a1f", image: "/Cars/hoindai.webp" },
  { id: 5, brand: "كيا", model: "سبورتاج", year: 2024, price: 1520000, fuel: "بنزين", gear: "أوتوماتيك", cond: "جديدة", km: 0, hp: 178, color: "#2f3b34", hot: true, image: "/Cars/kia.jpeg" },
  { id: 6, brand: "تيسلا", model: "", year: 2024, price: 2300000, fuel: "كهرباء", gear: "أوتوماتيك", cond: "جديدة", km: 0, hp: 283, color: "#e8e8ea" , image: "/Cars/tesla.jpeg" },
  { id: 7, brand: "نيسان", model: "صني", year: 2021, price: 540000, fuel: "بنزين", gear: "يدوي", cond: "مستعملة", km: 67000, hp: 117, color: "#5b6068", image: "/Cars/nisan.png" },
  { id: 8, brand: "أودي", model: "A6", year: 2023, price: 3150000, fuel: "بنزين", gear: "أوتوماتيك", cond: "مستعملة", km: 30000, hp: 245, color: "#111111", image: "/Cars/audi.png" },
  { id: 9, brand: "شيفروليه", model: "أوبترا", year: 2022, price: 610000, fuel: "بنزين", gear: "أوتوماتيك", cond: "مستعملة", km: 39000, hp: 109, color: "#a31621", image: "/Cars/shadrole.jpeg" },
];
export const fmt = (n) => n.toLocaleString("ar-EG");
export const money = (n) => fmt(n) + " ج.م";
export const uniq = (k) => [...new Set(CARS.map((c) => c[k]))];
export const waLink = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;