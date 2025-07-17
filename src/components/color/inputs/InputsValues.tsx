export type InputsValuesProps = {
  hexInput: string;
  rgbInputs: { r: string; g: string; b: string };
  hsvInputs: { h: string; s: string; v: string };
  hue: number;
  saturation: number;
  value: number;
  handleHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRgbInputChange: (component: "r" | "g" | "b", value: string) => void;
  handleHsvInputChange: (component: "h" | "s" | "v", value: string) => void;
  handleBrightnessInputChange: (value: string) => void;
};

export const InputsValues = ({
  hexInput,
  rgbInputs,
  // hsvInputs,
  handleHexInputChange,
  handleRgbInputChange,
  // handleHsvInputChange,
  handleBrightnessInputChange,
  hue,
  value,
  saturation,
}: InputsValuesProps) => {
  return (
    <>
      <div className="flex items-center gap-2">
        {/* Input HEX */}
        <span className="text-gray-600 font-medium">HEX:</span>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInputChange}
          className="font-mono text-[10px] sm:text-xs px-2 py-1 border rounded w-full"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {/* Inputs RGB */}
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-medium">RGB:</span>
        <div className="flex gap-1 flex-1">
          <input
            type="text"
            value={rgbInputs.r}
            onChange={(e) => handleRgbInputChange("r", e.target.value)}
            className="font-mono text-[10px] sm:text-xs  border rounded w-full"
            placeholder="0"
            maxLength={3}
          />
          <input
            type="text"
            value={rgbInputs.g}
            onChange={(e) => handleRgbInputChange("g", e.target.value)}
            className="font-mono text-[10px] sm:text-xs  border rounded w-full"
            placeholder="0"
            maxLength={3}
          />
          <input
            type="text"
            value={rgbInputs.b}
            onChange={(e) => handleRgbInputChange("b", e.target.value)}
            className="font-mono text-[10px] sm:text-xs border rounded w-full"
            placeholder="0"
            maxLength={3}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2">HSV:</span>
        <span className="ml-2 font-mono">
          {Math.round(hue)}°, {Math.round(saturation * 100)}%,{" "}
          {Math.round(value * 100)}%
          {/* <div className="flex gap-1 flex-1">
          <input
            type="text"
            value={rgbInputs.r}
            onChange={(e) => handleRgbInputChange("r", e.target.value)}
            className="font-mono text-[10px] sm:text-xs  border rounded w-full"
            placeholder="0"
            maxLength={3}
          />
          °,
          <input
            type="text"
            value={rgbInputs.g}
            onChange={(e) => handleRgbInputChange("g", e.target.value)}
            className="font-mono text-[10px] sm:text-xs  border rounded w-full"
            placeholder="0"
            maxLength={3}
          />
          %,
          <input
            type="text"
            value={rgbInputs.b}
            onChange={(e) => handleRgbInputChange("b", e.target.value)}
            className="font-mono text-[10px] sm:text-xs border rounded w-full"
            placeholder="0"
            maxLength={3}
          />
        </div> */}
        </span>
      </div>
      <div>
        <span className="text-gray-600 font-medium">Brillo:</span>
        <span className="ml-2">{Math.round(value * 100)}%</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value * 100}
          onChange={(e) => handleBrightnessInputChange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        ></input>
      </div>
    </>
  );
};
