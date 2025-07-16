import { useState } from "react";
import ModelViewer from "./Views/ModelViewer";
import ColorCanvas from "./Views/ColorCanvas";
import { useModels } from "./hooks/useModels";
import { SelectModels } from "./components/models/SelectModels";

export default function App() {
  const [brushColor, setBrushColor] = useState("#FF5733");
  const [paintingMode, setPaintingMode] = useState(false);
  const {
    currentModel,
    selectedArea,
    setSelectedArea,
    getCameraPosition,
    getCurrentModelUrl,
    handleModelChange,
  } = useModels();

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[50vh] lg:max-h-full">
        {/* Panel izquierdo - Control de modelos */}
        <SelectModels
          currentModel={currentModel}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          handleModelChange={handleModelChange}
        />
        {/* Panel izquierdo - Pincel de color */}
        <ColorCanvas
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          paintingMode={paintingMode}
          setPaintingMode={setPaintingMode}
        />
      </div>
      {/* Panel derecho - Visor 3D */}
      <div className="w-full lg:w-1/2 flex-1 h-[50vh] lg:h-full">
        <ModelViewer
          modelUrl={getCurrentModelUrl()}
          brushColor={brushColor}
          paintingMode={paintingMode}
          cameraPosition={getCameraPosition()}
        />
      </div>
    </div>
  );
}
