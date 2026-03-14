import { Routes, Route } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Dashboard from "@/pages/Dashboard";
import Devices from "@/pages/Devices";
import Sales from "@/pages/Sales";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="devices" element={<Devices />} />
        <Route path="sales" element={<Sales />} />
      </Route>
    </Routes>
  );
}
