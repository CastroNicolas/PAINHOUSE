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
import jsPDF from "jspdf";

// --- Props generales ---
type Props = {
  modelUrl: string;
  brushColor: string;
  paintingMode: boolean;
  meshes: Mesh[];
  setMeshes: React.Dispatch<React.SetStateAction<Mesh[]>>;
};

// --- Modelo pintable ---
function PaintableModel({
  modelUrl,
  brushColor,
  paintingMode,
  meshes,
  setMeshes,
}: Props) {
  const { scene } = useGLTF(modelUrl) as any;
  const { camera, gl } = useThree();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const foundMeshes: Mesh[] = [];

    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat: any) => mat.clone());
        } else {
          child.material = child.material.clone();
        }

        if (Array.isArray(child.material)) {
          child.userData.originalColors = child.material.map((mat: any) =>
            mat.color?.clone()
          );
        } else {
          child.userData.originalColor = child.material.color?.clone();
        }

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat: any) => {
          if (mat) {
            mat.side = DoubleSide;
            mat.visible = true;
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.roughness = 0.3;
            mat.metalness = 0.1;
            mat.color = new Color(0xffffff);
            mat.needsUpdate = true;
          }
        });

        foundMeshes.push(child);
      }
    });

    setMeshes(foundMeshes);
    setIsInitialized(true);
  }, [scene, isInitialized, setMeshes]);

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

      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      const intersects = raycaster.current.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const mesh = intersection.object as Mesh;

        const newColor = new Color(brushColor);

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: any) => {
            if (mat instanceof MeshStandardMaterial) {
              mat.color.copy(newColor);
              mat.roughness = 0.3;
              mat.metalness = 0.1;
              mat.needsUpdate = true;
            }
          });
        } else if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material.color.copy(newColor);
          mesh.material.roughness = 0.3;
          mesh.material.metalness = 0.1;
          mesh.material.needsUpdate = true;
        }
      }
    };

    gl.domElement.addEventListener("click", handleCanvasClick);
    return () => {
      gl.domElement.removeEventListener("click", handleCanvasClick);
    };
  }, [paintingMode, meshes, brushColor, camera, gl]);

  return <primitive object={scene} />;
}

// --- Captura de contexto de render ---
function CaptureController({ onReady }: { onReady: Function }) {
  const { gl, camera, scene } = useThree();

  useEffect(() => {
    onReady({ gl, camera, scene });
  }, [gl, camera, scene]);

  return null;
}

// --- Componente principal ---
export default function ModelViewer({
  modelUrl,
  brushColor,
  paintingMode,
}: {
  modelUrl: string;
  brushColor: string;
  paintingMode: boolean;
}) {
  const threeRef = useRef<{ gl: any; camera: any; scene: any } | null>(null);
  const [meshes, setMeshes] = useState<Mesh[]>([]);

  const angles = [
    { name: "Frontal", position: [0, 0, 5] },
    { name: "Trasera", position: [0, 0, -5] },
    { name: "Izquierda", position: [-5, 0, 0] },
    { name: "Derecha", position: [5, 0, 0] },
  ];

  const captureViewsToPDF = async () => {
    const refs = threeRef.current;
    if (!refs?.gl || !refs?.camera || !refs?.scene) {
      alert("No se pudo acceder a la cámara o al renderer.");
      return;
    }

    const { gl, camera, scene } = refs;
    const images: string[] = [];

    for (const { position } of angles) {
      camera.position.set(...position);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      gl.render(scene, camera);

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          const image = gl.domElement.toDataURL("image/png");
          images.push(image);
          resolve(null);
        });
      });
    }

    const pdf = new jsPDF();
    const imgW = 100;
    const imgH = 100;
    const padding = 5;

    pdf.addImage(images[0], "PNG", padding, padding, imgW, imgH);
    pdf.addImage(images[1], "PNG", padding + imgW + 5, padding, imgW, imgH);
    pdf.addImage(images[2], "PNG", padding, padding + imgH + 5, imgW, imgH);
    pdf.addImage(
      images[3],
      "PNG",
      padding + imgW + 5,
      padding + imgH + 5,
      imgW,
      imgH
    );

    // Colores utilizados
    const usedColors = new Set<string>();
    meshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      materials.forEach((mat: any) => {
        if (mat && mat.color) {
          const hex = `#${mat.color.getHexString().toUpperCase()}`;
          usedColors.add(hex);
        }
      });
    });

    pdf.setFontSize(14);
    let y = 2 * (imgH + padding) + 10;
    y += 8;
    pdf.text("Colores utilizados:", padding, y);
    [...usedColors].forEach((color) => {
      y += 7;
      pdf.text(`- ${color}`, padding + 5, y);
    });

    pdf.save("modelo_3D_vistas.pdf");
  };

  const canvasKey = `canvas-${modelUrl}`;

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <Canvas
        key={canvasKey}
        style={{ height: "100%", width: "100%" }}
        camera={{ position: [0, 2, 5], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 10, -5]} intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />

        <PaintableModel
          modelUrl={modelUrl}
          brushColor={brushColor}
          paintingMode={paintingMode}
          meshes={meshes}
          setMeshes={setMeshes}
        />

        <CaptureController onReady={(refs: any) => (threeRef.current = refs)} />

        <OrbitControls
          enableDamping={true}
          dampingFactor={0.05}
          enableZoom={true}
          enableRotate={true}
          enablePan={true}
        />
      </Canvas>

      <button
        onClick={captureViewsToPDF}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          padding: "8px 12px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Descargar PDF
      </button>
    </div>
  );
}
