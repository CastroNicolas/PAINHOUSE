import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Mesh,
  Color,
  MeshStandardMaterial,
  DoubleSide,
  Raycaster,
  Vector2,
} from "three";
import { useEffect, useRef, useState } from "react";

type Props = {
  modelUrl: string;
  brushColor: string;
  paintingMode: boolean;
};

function PaintableModel({ modelUrl, brushColor, paintingMode }: Props) {
  const { scene } = useGLTF(modelUrl) as any;
  const { camera, gl } = useThree();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const [meshes, setMeshes] = useState<Mesh[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Efecto separado SOLO para inicializar el modelo (una sola vez)
  useEffect(() => {
    if (isInitialized) return; // Si ya se inicializó, no hacer nada

    const foundMeshes: Mesh[] = [];

    scene.traverse((child: any) => {
      if (child.isMesh) {
        // Clonar material para cada mesh para evitar modificar el original
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat: any) => mat.clone());
        } else {
          child.material = child.material.clone();
        }

        // Guardar color original
        if (Array.isArray(child.material)) {
          child.userData.originalColors = child.material.map((mat: any) =>
            mat.color?.clone()
          );
        } else {
          child.userData.originalColor = child.material.color?.clone();
        }

        // Configurar material para pintura Y brillo uniforme
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat: any) => {
          if (mat) {
            mat.side = DoubleSide;
            mat.visible = true;
            // Asegurar que el material sea opaco para evitar mezclas
            mat.transparent = false;
            mat.opacity = 1.0;

            // CONFIGURACIÓN PARA BRILLO UNIFORME
            // Ajustar roughness para controlar el brillo (0 = muy brillante, 1 = mate)
            mat.roughness = 0.3; // Ajusta este valor entre 0-1 según el brillo deseado

            // Ajustar metalness si quieres un efecto más metálico
            mat.metalness = 0.1; // Ajusta este valor entre 0-1

            // FORZAR COLOR BLANCO AL INICIAR (SOLO LA PRIMERA VEZ)
            mat.color = new Color(0xffffff); // Color blanco puro

            // Asegurar que el material responda bien a la luz
            mat.needsUpdate = true;
          }
        });

        foundMeshes.push(child);
        console.log(
          "Mesh encontrado:",
          child.name || "sin nombre",
          child.material.type
        );
      }
    });

    setMeshes(foundMeshes);
    setIsInitialized(true); // Marcar como inicializado
  }, [scene, isInitialized]);

  // Efecto separado SOLO para cambiar el cursor
  useEffect(() => {
    document.body.style.cursor = paintingMode ? "crosshair" : "default";

    return () => {
      document.body.style.cursor = "default";
    };
  }, [paintingMode]);

  useEffect(() => {
    if (!paintingMode || meshes.length === 0) return;

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();

      // Calcular coordenadas normalizadas del mouse
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Configurar raycaster
      raycaster.current.setFromCamera(mouse.current, camera);

      // Buscar intersecciones con TODOS los meshes
      const intersects = raycaster.current.intersectObjects(meshes, false);

      console.log("Intersecciones encontradas:", intersects.length);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const mesh = intersection.object as Mesh;

        console.log("Objeto intersectado:", mesh.name || "sin nombre");
        console.log("Pintando con color:", brushColor);

        // Aplicar color completamente nuevo sin mezclar, manteniendo propiedades de brillo
        if (mesh.material) {
          const newColor = new Color(brushColor);

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: any) => {
              if (mat instanceof MeshStandardMaterial) {
                // REEMPLAZAR completamente el color pero mantener propiedades de brillo
                mat.color.copy(newColor);
                mat.roughness = 0.3; // Mantener consistencia en el brillo
                mat.metalness = 0.1; // Mantener consistencia en el metalness
                mat.needsUpdate = true;
              }
            });
          } else if (mesh.material instanceof MeshStandardMaterial) {
            // REEMPLAZAR completamente el color pero mantener propiedades de brillo
            mesh.material.color.copy(newColor);
            mesh.material.roughness = 0.3; // Mantener consistencia en el brillo
            mesh.material.metalness = 0.1; // Mantener consistencia en el metalness
            mesh.material.needsUpdate = true;
          }
        }
      } else {
        console.log("No se encontraron intersecciones");
      }
    };

    // Agregar event listener al canvas específico
    gl.domElement.addEventListener("click", handleCanvasClick);

    return () => {
      gl.domElement.removeEventListener("click", handleCanvasClick);
    };
  }, [paintingMode, meshes, brushColor, camera, gl]);

  return <primitive object={scene} />;
}

export default function ModelViewer({
  modelUrl,
  brushColor,
  paintingMode,
}: Props) {
  // Generar una key única para cada modelo para forzar re-render completo
  const canvasKey = `canvas-${modelUrl}`;

  return (
    <Canvas
      key={canvasKey} // Key única fuerza instancias separadas
      style={{ height: "100%", width: "100%" }}
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      {/* ILUMINACIÓN MEJORADA PARA BRILLO UNIFORME */}
      <ambientLight intensity={0.6} /> {/* Luz ambiente más suave */}
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, 10, -5]} intensity={0.4} />{" "}
      {/* Luz adicional desde el otro lado */}
      <pointLight position={[10, 10, 10]} intensity={0.3} />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />{" "}
      {/* Luz puntual adicional */}
      <PaintableModel
        modelUrl={modelUrl}
        brushColor={brushColor}
        paintingMode={paintingMode}
      />
      {/* OrbitControls con enableDamping para mejor UX */}
      <OrbitControls
        enableDamping={true}
        dampingFactor={0.05}
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
      />
    </Canvas>
  );
}
