import { ColorsOptions } from "./color/inputs/ColorsOptions";
import { InputsValues } from "./color/inputs/InputsValues";
import { PanelColor } from "./color/colors/PanelColor";
import { PaintButton } from "./buttons/PaintButton";
import { useColors } from "../hooks/useColors";

type Props = {
  brushColor: string;
  setBrushColor: (c: string) => void;
  paintingMode: boolean;
  setPaintingMode: (mode: boolean) => void;
  setIsUpdatingFromProp?: (value: boolean) => void;
};

export default function ColorCanvas({
  brushColor,
  setBrushColor,
  paintingMode,
  setPaintingMode,
}: Props) {
  const {
    handleHexInputChange,
    handleRgbInputChange,
    handleHsvInputChange,
    handleBrightnessInputChange,
    handleHueBarTouchStart,
    handleColorAreaTouchStart,
    handleColorAreaMouseDown,
    handleHueBarMouseDown,
    setIsUpdatingFromProp,
    hueBarRef,
    colorAreaRef,
    hexInput,
    hue,
    saturation,
    value,
    rgbInputs,
    hsvInputs,
  } = useColors(brushColor, setBrushColor);
  return (
    <div className="space-y-4">
      {/* Botón de modo pintura */}
      <div className="flex items-center gap-4"></div>
      <PaintButton
        paintingMode={paintingMode}
        setPaintingMode={setPaintingMode}
      />
      {/* Selector de color principal */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex gap-4">
          <PanelColor
            colorAreaRef={colorAreaRef}
            handleColorAreaMouseDown={handleColorAreaMouseDown}
            hueBarRef={hueBarRef}
            handleHueBarMouseDown={handleHueBarMouseDown}
            handleColorAreaTouchStart={handleColorAreaTouchStart}
            handleHueBarTouchStart={handleHueBarTouchStart}
            hue={hue}
            value={value}
            saturation={saturation}
          />
        </div>

        {/* Panel de información del color */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            {/* Preview del color */}
            <div
              className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-inner flex-shrink-0"
              style={{ backgroundColor: brushColor }}
            />
            {/* Valores del color */}
            <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
              <InputsValues
                hexInput={hexInput}
                rgbInputs={rgbInputs}
                handleHexInputChange={handleHexInputChange}
                handleRgbInputChange={handleRgbInputChange}
                handleHsvInputChange={handleHsvInputChange}
                handleBrightnessInputChange={handleBrightnessInputChange}
                hsvInputs={hsvInputs}
                hue={hue}
                value={value}
                saturation={saturation}
              />
            </div>
          </div>
          <ColorsOptions
            hue={hue}
            saturation={saturation}
            value={value}
            setIsUpdatingFromProp={setIsUpdatingFromProp}
            setBrushColor={setBrushColor}
          />
        </div>
      </div>
    </div>
  );
}
