import { useState } from "react";
import ModelViewer from "./Views/ModelViewer";
import ColorCanvas from "./components/color/ColorCanvas";

const models = {
  house: "/models/house.glb",
  room: "/models/room.glb",
};

export default function App() {
  const [brushColor, setBrushColor] = useState("#FF5733");
  const [paintingMode, setPaintingMode] = useState(false);
  const [currentModel, setCurrentModel] = useState<"house" | "room">("house");

  return (
    <div className="h-screen flex">
      {/* Panel izquierdo - Controles */}
      <div className="w-1/2 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">
          Arquitecto 3D – Pincel Interactivo
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentModel("house")}
            className={`px-4 py-2 rounded ${
              currentModel === "house"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Exterior
          </button>
          <button
            onClick={() => setCurrentModel("room")}
            className={`px-4 py-2 rounded ${
              currentModel === "room"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Interior
          </button>
        </div>

        <ColorCanvas
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          paintingMode={paintingMode}
          setPaintingMode={setPaintingMode}
        />
      </div>

      {/* Panel derecho - Visor 3D */}
      <div className="w-1/2 h-full">
        <ModelViewer
          modelUrl={models[currentModel]}
          brushColor={brushColor}
          paintingMode={paintingMode}
        />
      </div>
    </div>
  );
}
