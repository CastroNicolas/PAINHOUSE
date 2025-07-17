type PanelColorProps = {
  colorAreaRef: React.RefObject<HTMLDivElement | null>;
  hueBarRef: React.RefObject<HTMLDivElement | null>;
  handleColorAreaMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleHueBarMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleColorAreaTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleHueBarTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  hue: number;
  value: number;
  saturation: number;
};
export const PanelColor = ({
  colorAreaRef,
  hueBarRef,
  handleColorAreaMouseDown,
  handleHueBarMouseDown,
  handleColorAreaTouchStart,
  handleHueBarTouchStart,
  hue,
  value,
  saturation,
}: PanelColorProps) => {
  return (
    //  Área de color principal
    <>
      <div className="flex-1">
        <div
          ref={colorAreaRef}
          className="w-full h-36 sm:h-48 rounded cursor-crosshair relative select-none border"
          style={{
            background: `linear-gradient(to right, white, hsl(${hue}, 100%, 50%)), linear-gradient(to top, black, transparent)`,
          }}
          onMouseDown={handleColorAreaMouseDown}
          onTouchStart={handleColorAreaTouchStart}
        >
          {/* Indicador de posición */}
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
            style={{
              left: `${saturation * 100}%`,
              top: `${(1 - value) * 100}%`,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>

      {/* Barra de tono vertical */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={hueBarRef}
          className="w-6 h-48 rounded cursor-crosshair relative select-none border"
          style={{
            background:
              "linear-gradient(to bottom, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
          }}
          onMouseDown={handleHueBarMouseDown}
          onTouchStart={handleHueBarTouchStart}
        >
          {/* Indicador de tono */}
          <div
            className="absolute w-6 h-2 border-2 border-white shadow-lg pointer-events-none"
            style={{
              top: `${(hue / 360) * 100}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>
    </>
  );
};
