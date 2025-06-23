import { useState, useRef, useEffect } from "react";

type Props = {
  brushColor: string;
  setBrushColor: (c: string) => void;
  paintingMode: boolean;
  setPaintingMode: (mode: boolean) => void;
};

// Función para convertir HSV a RGB
function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

// Función para convertir RGB a HSV
function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s, v };
}

// Función para convertir RGB a hex
function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Función para convertir hex a RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Función para validar formato hexadecimal
function isValidHex(hex: string): boolean {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

export default function ColorCanvas({
  brushColor,
  setBrushColor,
  paintingMode,
  setPaintingMode,
}: Props) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [value, setValue] = useState(1);
  const [isDraggingColor, setIsDraggingColor] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  // Estados para los inputs editables
  const [hexInput, setHexInput] = useState("");
  const [rgbInputs, setRgbInputs] = useState({ r: "", g: "", b: "" });
  const [isUpdatingFromProp, setIsUpdatingFromProp] = useState(false);

  const colorAreaRef = useRef<HTMLDivElement>(null);
  const hueBarRef = useRef<HTMLDivElement>(null);

  // Inicializar valores desde brushColor
  useEffect(() => {
    if (isUpdatingFromProp) return;

    const rgb = hexToRgb(brushColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    // Agregar validación para evitar actualizaciones cíclicas
    if (
      Math.abs(hsv.h - hue) > 1 ||
      Math.abs(hsv.s - saturation) > 0.01 ||
      Math.abs(hsv.v - value) > 0.01
    ) {
      setHue(hsv.h);
      setSaturation(hsv.s);
      setValue(hsv.v);
    }

    // Actualizar inputs
    setHexInput(brushColor.toUpperCase());
    setRgbInputs({
      r: rgb.r.toString(),
      g: rgb.g.toString(),
      b: rgb.b.toString(),
    });
  }, [brushColor]);

  // Actualizar color desde HSV
  useEffect(() => {
    if (isUpdatingFromProp) {
      setIsUpdatingFromProp(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      const rgb = hsvToRgb(hue, saturation, value);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setBrushColor(hex);
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [hue, saturation, value, setBrushColor]);

  const updateColorFromPosition = (e: React.MouseEvent | MouseEvent) => {
    if (!colorAreaRef.current || !isDraggingColor) return;

    const rect = colorAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSaturation = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.max(0, Math.min(1, 1 - y / rect.height));

    setSaturation(newSaturation);
    setValue(newValue);
  };

  const updateHueFromPosition = (e: React.MouseEvent | MouseEvent) => {
    if (!hueBarRef.current || !isDraggingHue) return;

    const rect = hueBarRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const newHue = Math.max(0, Math.min(360, (y / rect.height) * 360));

    setHue(newHue);
  };

  const handleColorAreaMouseDown = (e: React.MouseEvent) => {
    setIsDraggingColor(true);
    updateColorFromPosition(e);
  };

  const handleHueBarMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true);
    updateHueFromPosition(e);
  };

  // Manejar cambio en input HEX
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Agregar # si no está presente
    if (value && !value.startsWith("#")) {
      value = "#" + value;
    }

    setHexInput(value);

    // Validar y aplicar color
    if (isValidHex(value)) {
      setIsUpdatingFromProp(true);
      setBrushColor(value);
    }
  };

  // Manejar cambio en inputs RGB
  const handleRgbInputChange = (component: "r" | "g" | "b", value: string) => {
    // Solo permitir números
    if (value && !/^\d+$/.test(value)) return;

    const numValue = parseInt(value) || 0;

    // Limitar a rango 0-255
    if (numValue > 255) return;

    const newRgbInputs = { ...rgbInputs, [component]: value };
    setRgbInputs(newRgbInputs);

    // Si todos los valores son válidos, actualizar color
    const r = parseInt(newRgbInputs.r) || 0;
    const g = parseInt(newRgbInputs.g) || 0;
    const b = parseInt(newRgbInputs.b) || 0;

    if (r <= 255 && g <= 255 && b <= 255) {
      const hex = rgbToHex(r, g, b);
      setIsUpdatingFromProp(true);
      setBrushColor(hex);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingColor) {
        updateColorFromPosition(e);
      } else if (isDraggingHue) {
        updateHueFromPosition(e);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingColor(false);
      setIsDraggingHue(false);
    };

    if (isDraggingColor || isDraggingHue) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingColor, isDraggingHue]);

  // const currentRgb = hsvToRgb(hue, saturation, value);

  return (
    <div className="space-y-4">
      {/* Botón de modo pintura */}
      <div className="flex items-center gap-4">
        <button
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            paintingMode
              ? "bg-red-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setPaintingMode(!paintingMode)}
        >
          {paintingMode ? "🎨 Pintando..." : "Activar pincel"}
        </button>
      </div>

      {/* Selector de color principal */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex gap-4">
          {/* Área de color principal */}
          <div className="flex-1">
            <div
              ref={colorAreaRef}
              className="w-full h-48 rounded cursor-crosshair relative select-none border"
              style={{
                background: `linear-gradient(to right, white, hsl(${hue}, 100%, 50%)), linear-gradient(to top, black, transparent)`,
              }}
              onMouseDown={handleColorAreaMouseDown}
            >
              {/* Indicador de posición */}
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${saturation * 100}%`,
                  top: `${(1 - value) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
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
              {/* Input HEX */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">HEX:</span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  className="font-mono text-xs px-2 py-1 border rounded flex-1 uppercase"
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
                    className="font-mono text-xs px-1 py-1 border rounded w-12 text-center"
                    placeholder="0"
                    maxLength={3}
                  />
                  <input
                    type="text"
                    value={rgbInputs.g}
                    onChange={(e) => handleRgbInputChange("g", e.target.value)}
                    className="font-mono text-xs px-1 py-1 border rounded w-12 text-center"
                    placeholder="0"
                    maxLength={3}
                  />
                  <input
                    type="text"
                    value={rgbInputs.b}
                    onChange={(e) => handleRgbInputChange("b", e.target.value)}
                    className="font-mono text-xs px-1 py-1 border rounded w-12 text-center"
                    placeholder="0"
                    maxLength={3}
                  />
                </div>
              </div>

              <div>
                <span className="text-gray-600 font-medium">HSV:</span>
                <span className="ml-2 font-mono">
                  {Math.round(hue)}°, {Math.round(saturation * 100)}%,{" "}
                  {Math.round(value * 100)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Brillo:</span>
                <span className="ml-2">{Math.round(value * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
