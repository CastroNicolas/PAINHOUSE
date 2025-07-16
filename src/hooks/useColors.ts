import { useEffect, useRef, useState } from "react";
import { hexToRgb } from "../components/color/colors/hexToRgb";
import { rgbToHsv } from "../components/color/colors/rgbToHsv";
import { hsvToRgb } from "../components/color/colors/hsvToRgb";
import { isValidHex, rgbToHex } from "../components/color/colors/rgbToHex";

export const useColors = (
  brushColor: string,
  setBrushColor: (c: string) => void
) => {
  // Estados para el color actual
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [value, setValue] = useState(1);
  // Estados para el arrastre de color y tono
  const [isDraggingColor, setIsDraggingColor] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  // Estados para los inputs editables
  const [hexInput, setHexInput] = useState("");
  const [rgbInputs, setRgbInputs] = useState({ r: "", g: "", b: "" });
  const [hsvInputs, setHsvInputs] = useState({ h: "", s: "", v: "" });
  const [brightness, setBrightness] = useState(1);

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
    setHsvInputs({
      h: hsv.h.toFixed(0),
      s: hsv.s.toFixed(2),
      v: hsv.v.toFixed(2),
    });
    setBrightness(Number(hsv.v.toFixed(2)));
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
      const rgb = hexToRgb(value);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setValue(hsv.v);
      setRgbInputs({
        r: rgb.r.toString(),
        g: rgb.g.toString(),
        b: rgb.b.toString(),
      });

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
      const hsv = rgbToHsv(r, g, b);

      // ✅ Actualiza estados inmediatamente
      setHue(hsv.h);
      setSaturation(hsv.s);
      setValue(hsv.v);
      setHexInput(hex.toUpperCase());

      setIsUpdatingFromProp(true);
      setBrushColor(hex);
    }
  };
  const handleHsvInputChange = (component: "h" | "s" | "v", value: string) => {
    // Solo números y decimales
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setHsvInputs((prev) => ({ ...prev, [component]: value }));

    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;

    // Limitar rangos
    if (component === "h") {
      if (numValue > 360) numValue = 360;
    } else {
      if (numValue > 1) numValue = 1;
    }

    // Actualizar estado interno
    if (component === "h") setHue(numValue);
    if (component === "s") setSaturation(numValue);
    if (component === "v") {
      setValue(numValue);
      setBrightness(numValue); // sincronizamos brillo con V
    }

    // Convertimos a RGB
    const rgb = hsvToRgb(
      component === "h" ? numValue : hue,
      component === "s" ? numValue : saturation,
      component === "v" ? numValue : value
    );

    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    setRgbInputs({
      r: rgb.r.toString(),
      g: rgb.g.toString(),
      b: rgb.b.toString(),
    });
    setHexInput(hex.toUpperCase());

    setIsUpdatingFromProp(true);
    setBrushColor(hex);
  };

  const handleBrightnessInputChange = (newValue: string) => {
    if (newValue && !/^\d*\.?\d*$/.test(newValue)) return;

    setBrightness(parseFloat(newValue));

    let numValue = parseFloat(newValue);
    if (isNaN(numValue)) numValue = 0;
    numValue = Math.max(0, Math.min(numValue / 100, 1));

    setValue(numValue);
    setHsvInputs((prev) => ({ ...prev, v: newValue }));

    const rgb = hsvToRgb(hue, saturation, numValue);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    setRgbInputs({
      r: rgb.r.toString(),
      g: rgb.g.toString(),
      b: rgb.b.toString(),
    });
    setHexInput(hex.toUpperCase());

    setIsUpdatingFromProp(true);
    setBrushColor(hex);
  };

  const handleColorAreaTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDraggingColor(true);
  };

  const handleHueBarTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDraggingHue(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingColor) {
        updateColorFromPosition(e);
      } else if (isDraggingHue) {
        updateHueFromPosition(e);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (isDraggingColor) {
        updateColorFromPosition(touch as any);
      } else if (isDraggingHue) {
        updateHueFromPosition(touch as any);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingColor(false);
      setIsDraggingHue(false);
    };

    if (isDraggingColor || isDraggingHue) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDraggingColor, isDraggingHue]);

  return {
    handleHexInputChange,
    handleRgbInputChange,
    handleHsvInputChange,
    handleBrightnessInputChange,
    handleHueBarTouchStart,
    handleColorAreaTouchStart,
    handleColorAreaMouseDown,
    handleHueBarMouseDown,
    hueBarRef,
    colorAreaRef,
    hexInput,
    hue,
    saturation,
    value,
    rgbInputs,
    hsvInputs,
    setIsUpdatingFromProp,
  };
};
