import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./Views/LandingPage";
import { PaintModel } from "./Views/PaintModel";
export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<LandingPage />} />
      <Route path="/paintModels" element={<PaintModel />} />
    </Routes>
  );
}
