import { hsvToRgb } from "../colors/hsvToRgb";
import { rgbToHex } from "../colors/rgbToHex";

type ColorsOptionsProps = {
  hue: number;
  saturation: number;
  value: number;
  setBrushColor: (color: string) => void;
  setIsUpdatingFromProp: (updating: boolean) => void;
};

export const ColorsOptions = ({
  hue,
  saturation,
  value,
  setBrushColor,
  setIsUpdatingFromProp,
}: ColorsOptionsProps) => {
  return (
    <div className="flex gap-2 items-center">
      {/* Más claro 2 */}
      <div
        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
        style={{
          backgroundColor: (() => {
            const rgb = hsvToRgb(
              hue,
              saturation * 0.3,
              Math.min(1, value + 0.4)
            );
            return rgbToHex(rgb.r, rgb.g, rgb.b);
          })(),
        }}
        onClick={() => {
          const rgb = hsvToRgb(hue, saturation * 0.3, Math.min(1, value + 0.4));
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          setIsUpdatingFromProp(true);
          setBrushColor(hex);
        }}
      />

      {/* Más claro 1 */}
      <div
        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
        style={{
          backgroundColor: (() => {
            const rgb = hsvToRgb(
              hue,
              saturation * 0.6,
              Math.min(1, value + 0.2)
            );
            return rgbToHex(rgb.r, rgb.g, rgb.b);
          })(),
        }}
        onClick={() => {
          const rgb = hsvToRgb(hue, saturation * 0.6, Math.min(1, value + 0.2));
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          setIsUpdatingFromProp(true);
          setBrushColor(hex);
        }}
      />

      {/* Color de referencia (centro) - mantiene el color base */}
      <div
        className="w-11 h-11 rounded-full border-4 border-gray-300 shadow-lg cursor-pointer hover:scale-110 transition-transform"
        style={{
          backgroundColor: (() => {
            const rgb = hsvToRgb(hue, saturation, value);
            return rgbToHex(rgb.r, rgb.g, rgb.b);
          })(),
        }}
        onClick={() => {
          const rgb = hsvToRgb(hue, saturation, value);
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          setIsUpdatingFromProp(true);
          setBrushColor(hex);
        }}
      />

      {/* Más oscuro 1 */}
      <div
        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
        style={{
          backgroundColor: (() => {
            const rgb = hsvToRgb(
              hue,
              Math.min(1, saturation + 0.2),
              value * 0.7
            );
            return rgbToHex(rgb.r, rgb.g, rgb.b);
          })(),
        }}
        onClick={() => {
          const rgb = hsvToRgb(hue, Math.min(1, saturation + 0.2), value * 0.7);
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          setIsUpdatingFromProp(true);
          setBrushColor(hex);
        }}
      />

      {/* Más oscuro 2 */}
      <div
        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
        style={{
          backgroundColor: (() => {
            const rgb = hsvToRgb(
              hue,
              Math.min(1, saturation + 0.4),
              value * 0.4
            );
            return rgbToHex(rgb.r, rgb.g, rgb.b);
          })(),
        }}
        onClick={() => {
          const rgb = hsvToRgb(hue, Math.min(1, saturation + 0.4), value * 0.4);
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          setIsUpdatingFromProp(true);
          setBrushColor(hex);
        }}
      />
    </div>
  );
};
