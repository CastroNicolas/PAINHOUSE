type SelectModelsProps = {
  currentModel: "house" | "room";
  handleModelChange: (model: "house" | "room") => void;
  selectedArea: "kitchen" | "livingroom" | "bathroom" | "room" | null;
  setSelectedArea: (
    area: "kitchen" | "livingroom" | "bathroom" | "room" | null
  ) => void;
};

export const SelectModels = ({
  currentModel,
  handleModelChange,
  selectedArea,
  setSelectedArea,
}: SelectModelsProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Diseña en 3D – Pincel Interactivo</h1>
      {/* Selector de modelo principal */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Modelo Principal
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleModelChange("house")}
            className={`px-4 py-2 rounded transition-colors ${
              currentModel === "house"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Exterior
          </button>
          <button
            onClick={() => handleModelChange("room")}
            className={`px-4 py-2 rounded transition-colors ${
              currentModel === "room"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Interior
          </button>
        </div>
      </div>

      {/* Selector de áreas (solo visible cuando está seleccionado "Interior") */}
      {currentModel === "room" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Áreas del Interior
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setSelectedArea(selectedArea === "kitchen" ? null : "kitchen")
              }
              className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                selectedArea === "kitchen"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <span>🍳</span>
              <span>Cocina</span>
            </button>

            <button
              onClick={() =>
                setSelectedArea(
                  selectedArea === "livingroom" ? null : "livingroom"
                )
              }
              className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                selectedArea === "livingroom"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              <span>🛋️</span>
              <span>livingroom</span>
            </button>

            <button
              onClick={() =>
                setSelectedArea(selectedArea === "bathroom" ? null : "bathroom")
              }
              className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                selectedArea === "bathroom"
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-cyan-300 hover:bg-cyan-50"
              }`}
            >
              <span>🚿</span>
              <span>Baño</span>
            </button>

            <button
              onClick={() =>
                setSelectedArea(selectedArea === "room" ? null : "room")
              }
              className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                selectedArea === "room"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <span>🛏️</span>
              <span>Habitación</span>
            </button>
          </div>

          {/* Indicador de área seleccionada */}
          {selectedArea && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Área seleccionada:</span>
                {selectedArea === "kitchen" && " 🍳 Cocina"}
                {selectedArea === "livingroom" && " 🛋️ livingroom"}
                {selectedArea === "bathroom" && " 🚿 Baño"}
                {selectedArea === "room" && " 🛏️ Habitación"}
              </p>
              <button
                onClick={() => setSelectedArea(null)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Limpiar selección
              </button>
            </div>
          )}
        </div>
      )}

      {/* Información del modelo actual */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Modelo actual:</span>
          {currentModel === "house" ? "Exterior" : "Interior"}
          {selectedArea && (
            <>
              {" → "}
              {selectedArea === "kitchen" && "Cocina"}
              {selectedArea === "livingroom" && "livingroom"}
              {selectedArea === "bathroom" && "Baño"}
              {selectedArea === "room" && "Habitación"}
            </>
          )}
        </p>
      </div>
    </div>
  );
};
