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
  const { camera, gl, size } = useThree();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const [meshes, setMeshes] = useState<Mesh[]>([]);

  useEffect(() => {
    // Change cursor style when painting mode is active
    document.body.style.cursor = paintingMode ? "crosshair" : "default";

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

        // Configurar material para pintura
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

    return () => {
      document.body.style.cursor = "default";
    };
  }, [scene, paintingMode]);

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

        // Aplicar color completamente nuevo sin mezclar
        if (mesh.material) {
          const newColor = new Color(brushColor);

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: any) => {
              if (mat instanceof MeshStandardMaterial) {
                // REEMPLAZAR completamente el color
                mat.color.copy(newColor);
                mat.needsUpdate = true;
              }
            });
          } else if (mesh.material instanceof MeshStandardMaterial) {
            // REEMPLAZAR completamente el color
            mesh.material.color.copy(newColor);
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[10, 10, 10]} />
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
