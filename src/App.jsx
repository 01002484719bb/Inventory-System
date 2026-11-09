import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import IntroCarModel from "./components/IntroCarModel.jsx";
import Home from "./pages/Home.jsx";
import Inventory from "./pages/Inventory.jsx";
import CarDetails from "./pages/CarDetails.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import Favorites from "./pages/Favorites.jsx";
import Compare from "./pages/Compare.jsx";
import Admin from "./pages/Admin.jsx";
import { InventoryProvider } from "./InventoryStore.jsx";


export default function App() {
  return (
    <>
        <IntroCarModel />
      <InventoryProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<CarDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </InventoryProvider>
    </>
  );
}