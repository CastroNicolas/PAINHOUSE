import { useState } from "react";

export const models = {
  house: "/models/house.glb",
  room: "/models/room.glb",
  kitchen: "/models/kitchen.glb",
  livingroom: "/models/livingroom.glb",
  bathroom: "/models/bathroom.glb",
};
export const cameraPositions: Record<string, [number, number, number]> = {
  house: [0, 1, 3],
  room: [0, 1.5, 5],
  kitchen: [1, 1, -4],
  livingroom: [5, 2, 6],
  bathroom: [3, 2, 10],
};

type ModelType = "house" | "room";
type AreaType = "kitchen" | "livingroom" | "bathroom" | "room" | null;

export const useModels = () => {
  const [currentModel, setCurrentModel] = useState<ModelType>("house");
  const [selectedArea, setSelectedArea] = useState<AreaType>(null);
  const [brushColor, setBrushColor] = useState("#FF5733");
  const [paintingMode, setPaintingMode] = useState(false);

  const getCameraPosition = (): [number, number, number] => {
    if (currentModel === "room" && selectedArea) {
      return cameraPositions[selectedArea] || [0, 2, 5];
    }
    return cameraPositions[currentModel] || [0, 2, 5];
  };
  // Función para obtener el modelo actual basado en la selección
  const getCurrentModelUrl = () => {
    if (currentModel === "room" && selectedArea) {
      // Si tienes modelos específicos para cada área, úsalos
      return models[selectedArea] || models.house;
    }
    return models[currentModel];
  };

  // Función para manejar el cambio de modelo principal
  const handleModelChange = (model: ModelType) => {
    setCurrentModel(model);
    // Resetear área seleccionada cuando cambiamos de modelo principal
    if (model === "room") {
      setSelectedArea(null);
    }
  };

  return {
    currentModel,
    selectedArea,
    setSelectedArea,
    getCameraPosition,
    getCurrentModelUrl,
    handleModelChange,
    brushColor,
    setBrushColor,
    paintingMode,
    setPaintingMode,
  };
};
