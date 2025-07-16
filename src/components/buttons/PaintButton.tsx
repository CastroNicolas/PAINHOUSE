type PaintButtonProps = {
  paintingMode: boolean;
  setPaintingMode: (mode: boolean) => void;
};

export const PaintButton = ({
  paintingMode,
  setPaintingMode,
}: PaintButtonProps) => {
  return (
    <button
      className={`px-4 py-3 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg font-medium transition-colors ${
        paintingMode
          ? "bg-red-500 text-white shadow-lg"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={() => setPaintingMode(!paintingMode)}
    >
      {paintingMode ? "🎨 Pintando..." : "Activar pincel"}
    </button>
  );
};
