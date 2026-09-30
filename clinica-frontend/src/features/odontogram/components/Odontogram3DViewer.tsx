import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RotateCcw,
  Play,
  Pause,
  Sun,
  Eye,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  RefreshCw,
  Compass
} from 'lucide-react';

interface Odontogram3DViewerProps {
  modelUrl: string;
  selectedToothName?: string | null;
  onToothSelect?: (toothName: string) => void;
}

export const Odontogram3DViewer: React.FC<Odontogram3DViewerProps> = ({
  modelUrl,
  selectedToothName,
  onToothSelect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const loadedModelRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false); // Default off so model stays steady
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightPreset, setLightPreset] = useState<'studio' | 'bright' | 'dramatic'>('studio');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Model rotation offsets (frontal view with teeth facing camera directly)
  const [rotationX, setRotationX] = useState<number>(0);
  const [rotationY, setRotationY] = useState<number>(0);
  const [rotationZ, setRotationZ] = useState<number>(0);

  // Lights reference
  const dirLight1Ref = useRef<THREE.DirectionalLight | null>(null);
  const dirLight2Ref = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Listen to native browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = Boolean(document.fullscreenElement);
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#001C3D');

    // CAMERA (near=0.1, far=2000 to prevent near/far clipping)
    const width = mountNode.clientWidth || window.innerWidth;
    const height = mountNode.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 11);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;

    // Clear element & attach canvas
    mountNode.innerHTML = '';
    mountNode.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 60;
    controls.minDistance = 2;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 1.8;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // LIGHTING SETUP (High-Definition Clinical & Dental Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Lower ambient for deeper interdental shadows
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.8); // Key light for tooth surface contrast
    dirLight1.position.set(12, 18, 15);
    dirLight1.castShadow = true;
    scene.add(dirLight1);
    dirLight1Ref.current = dirLight1;

    const dirLight2 = new THREE.DirectionalLight(0x00c2e0, 1.2); // Cyan rim light
    dirLight2.position.set(-15, -10, 15);
    scene.add(dirLight2);
    dirLight2Ref.current = dirLight2;

    const topLight = new THREE.DirectionalLight(0xffffff, 1.5); // Top accent light for biting edges (cusps)
    topLight.position.set(0, 15, 10);
    scene.add(topLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x001c3d, 0.7);
    scene.add(hemiLight);

    // GRID HELPER (CYAN BRAND STYLE)
    const gridHelper = new THREE.GridHelper(30, 30, 0x00c2e0, 0x0840a8);
    gridHelper.position.y = -4;
    (gridHelper.material as THREE.Material).opacity = 0.2;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // LOAD GLTF MODEL
    setIsLoading(true);
    setLoadProgress(0);
    setLoadError(null);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (loadedModelRef.current) {
          scene.remove(loadedModelRef.current);
        }

        const root = gltf.scene;
        loadedModelRef.current = root;

        // Apply initial orientation for CAD dental scans
        root.rotation.x = rotationX;
        root.rotation.y = rotationY;
        root.rotation.z = rotationZ;

        // Traverse meshes and configure materials & shadows
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((mat) => {
                mat.side = THREE.DoubleSide; // Render both front & back faces
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.color.setHex(0xf8fafc); // Bright clean dental enamel ivory tone
                  mat.roughness = 0.22;       // Natural enamel sheen
                  mat.metalness = 0.08;       // Contrast reflectivity
                  mat.wireframe = isWireframe;
                }
              });
            }
          }
        });

        // 1. Calculate bounding box of raw geometry (after rotation)
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // 2. Scale model to fit field of view prominently
        if (maxDim > 0) {
          const targetSize = 7.0; // Increased scale for maximum visibility
          const scaleFactor = targetSize / maxDim;
          root.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }

        // 3. Re-calculate bounding box AFTER scaling to center at (0, 0, 0)
        box.setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        root.position.x -= center.x;
        root.position.y -= center.y;
        root.position.z -= center.z;

        scene.add(root);

        // Adjust camera & target
        camera.position.set(0, 0, 11);
        controls.target.set(0, 0, 0);
        controls.update();

        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(percent);
        }
      },
      (error) => {
        console.error('Error loading 3D GLTF model:', error);
        setLoadError('Error al cargar el modelo 3D GLB.');
        setIsLoading(false);
      }
    );

    // ANIMATION LOOP
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || mountNode.clientWidth || window.innerWidth;
        const h = entry.contentRect.height || mountNode.clientHeight || window.innerHeight;
        if (w > 0 && h > 0 && rendererRef.current && cameraRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(mountNode);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [modelUrl]);

  // Handle Model Rotation Updates
  useEffect(() => {
    if (loadedModelRef.current) {
      loadedModelRef.current.rotation.x = rotationX;
      loadedModelRef.current.rotation.y = rotationY;
      loadedModelRef.current.rotation.z = rotationZ;

      // Re-center after rotation
      if (sceneRef.current) {
        const box = new THREE.Box3().setFromObject(loadedModelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        loadedModelRef.current.position.x -= center.x;
        loadedModelRef.current.position.y -= center.y;
        loadedModelRef.current.position.z -= center.z;
      }
    }
  }, [rotationX, rotationY, rotationZ]);

  // Handle AutoRotate change
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Handle Wireframe toggle
  useEffect(() => {
    if (loadedModelRef.current) {
      loadedModelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.wireframe = isWireframe;
              }
            });
          }
        }
      });
    }
  }, [isWireframe]);

  // Handle Light Presets
  useEffect(() => {
    if (!ambientLightRef.current || !dirLight1Ref.current || !dirLight2Ref.current) return;
    if (lightPreset === 'studio') {
      ambientLightRef.current.intensity = 1.6;
      dirLight1Ref.current.intensity = 2.5;
      dirLight2Ref.current.intensity = 1.5;
    } else if (lightPreset === 'bright') {
      ambientLightRef.current.intensity = 2.4;
      dirLight1Ref.current.intensity = 3.2;
      dirLight2Ref.current.intensity = 2.2;
    } else if (lightPreset === 'dramatic') {
      ambientLightRef.current.intensity = 0.6;
      dirLight1Ref.current.intensity = 3.8;
      dirLight2Ref.current.intensity = 0.6;
    }
  }, [lightPreset]);

  // Raycasting on Click
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !loadedModelRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(loadedModelRef.current.children, true);

    if (intersects.length > 0) {
      const hitObject = intersects[0].object;
      const toothName = hitObject.name || `Pieza #${hitObject.id}`;

      if (onToothSelect) {
        onToothSelect(toothName);
      }
    }
  };

  const handleResetCamera = () => {
    setRotationX(0);
    setRotationY(0);
    setRotationZ(0);
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 0, 11);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const setPresetView = (view: 'frontal' | 'oclusal' | 'lateral_izq' | 'lateral_der') => {
    if (!cameraRef.current || !controlsRef.current) return;
    controlsRef.current.target.set(0, 0, 0);

    if (view === 'frontal') {
      cameraRef.current.position.set(0, 0, 11);
    } else if (view === 'oclusal') {
      cameraRef.current.position.set(0, 11, 0.1);
    } else if (view === 'lateral_izq') {
      cameraRef.current.position.set(-11, 0, 0);
    } else if (view === 'lateral_der') {
      cameraRef.current.position.set(11, 0, 0);
    }
    controlsRef.current.update();
  };

  const rotateModelX90 = () => {
    setRotationX((prev) => prev + Math.PI / 2);
  };

  const rotateModelY90 = () => {
    setRotationY((prev) => prev + Math.PI / 2);
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.85);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.15);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#F4F9FF] dark:bg-[#001C3D] select-none transition-all duration-300 flex flex-col overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none border-none p-0'
          : 'relative w-full h-[calc(100vh-230px)] min-h-[620px] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-2xl shadow-[#001C3D]/80'
      }`}
    >
      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-[#F4F9FF] dark:bg-[#001C3D]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-[#0840A8] dark:text-white space-y-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#0840A8]/15 dark:border-[#0077D4]/30 border-t-[#00C2E0] animate-spin" />
            <Sparkles className="text-[#0077D4] dark:text-[#00C2E0] animate-pulse" size={24} />
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-sm font-bold text-[#0840A8] dark:text-white tracking-wide">Cargando Odontograma 3D</h4>
            <p className="text-xs text-[#0077D4] dark:text-blue-200/70 font-mono">Procesando modelo tridimensional... {loadProgress}%</p>
          </div>
          <div className="w-64 h-2 bg-white dark:bg-[#002D5E] rounded-full overflow-hidden border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
            <div
              className="h-full bg-gradient-to-r from-[#0077D4] to-[#00C2E0] transition-all duration-300 rounded-full"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ERROR OVERLAY */}
      {loadError && (
        <div className="absolute inset-0 z-20 bg-rose-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-[#0840A8] dark:text-white text-center space-y-3">
          <AlertCircle className="text-rose-400" size={40} />
          <h4 className="text-base font-bold text-[#0840A8] dark:text-white">{loadError}</h4>
          <p className="text-xs text-rose-200/80 max-w-md">
            No se pudo leer el archivo GLB en <code className="font-mono text-cyan-300">{modelUrl}</code>.
          </p>
        </div>
      )}

      {/* TOP TOOLBAR OVERLAY */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* MODEL TITLE BADGE & PRESET VIEWS */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#002D5E]/85 backdrop-blur-md border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0840A8] dark:text-white flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C2E0] animate-pulse" />
            <span className="text-xs font-extrabold tracking-wide text-[#0840A8] dark:text-white">
              {isFullscreen ? 'ODONTOGRAMA 3D - MODO PANTALLA COMPLETA 100%' : 'VISOR 3D ODONTOLÓGICO'}
            </span>
          </div>

          {/* PRESET VIEW BUTTONS */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#002D5E]/85 backdrop-blur-md border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg text-xs font-bold text-[#0840A8] dark:text-white">
            <button
              onClick={() => setPresetView('frontal')}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#0077D4] hover:text-[#0840A8] dark:text-white cursor-pointer transition-all"
            >
              Frontal
            </button>
            <button
              onClick={() => setPresetView('oclusal')}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#0077D4] hover:text-[#0840A8] dark:text-white cursor-pointer transition-all"
            >
              Oclusal
            </button>
            <button
              onClick={() => setPresetView('lateral_izq')}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#0077D4] hover:text-[#0840A8] dark:text-white cursor-pointer transition-all hidden sm:inline"
            >
              Lat. Izq
            </button>
            <button
              onClick={() => setPresetView('lateral_der')}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#0077D4] hover:text-[#0840A8] dark:text-white cursor-pointer transition-all hidden sm:inline"
            >
              Lat. Der
            </button>
          </div>
        </div>

        {/* QUICK CONTROLS */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-[#002D5E]/85 backdrop-blur-md border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg">
          <button
            onClick={rotateModelX90}
            title="Girar modelo 90° (Eje X)"
            className="p-2.5 rounded-lg bg-white/10 hover:bg-[#0077D4] text-[#0840A8] dark:text-white cursor-pointer transition-all flex items-center gap-1 text-[11px] font-bold"
          >
            <RefreshCw size={14} />
            <span className="text-[10px]">Rotar X</span>
          </button>

          <button
            onClick={rotateModelY90}
            title="Girar modelo 90° (Eje Y)"
            className="p-2.5 rounded-lg bg-white/10 hover:bg-[#0077D4] text-[#0840A8] dark:text-white cursor-pointer transition-all flex items-center gap-1 text-[11px] font-bold"
          >
            <Compass size={14} />
            <span className="text-[10px]">Rotar Y</span>
          </button>

          <div className="w-px h-5 bg-[#00C2E0]/30 mx-0.5" />

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title={isAutoRotate ? 'Pausar rotación' : 'Activar rotación automática'}
            className={`p-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isAutoRotate
                ? 'bg-[#0077D4] text-[#0840A8] dark:text-white'
                : 'bg-white/10 text-[#0077D4] dark:text-blue-200 hover:text-[#0840A8] dark:text-white'
            }`}
          >
            {isAutoRotate ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            title="Alternar estructura alámbrica"
            className={`p-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isWireframe
                ? 'bg-[#00C2E0] text-[#001C3D]'
                : 'bg-white/10 text-[#0077D4] dark:text-blue-200 hover:text-[#0840A8] dark:text-white'
            }`}
          >
            <Layers size={15} />
          </button>

          <button
            onClick={() =>
              setLightPreset((prev) =>
                prev === 'studio' ? 'bright' : prev === 'bright' ? 'dramatic' : 'studio'
              )
            }
            title={`Iluminación: ${lightPreset}`}
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#0077D4] dark:text-[#00C2E0] cursor-pointer transition-all flex items-center gap-1.5 text-[11px] font-bold"
          >
            <Sun size={15} />
            <span className="capitalize text-[10px] hidden sm:inline">{lightPreset}</span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Restablecer vista inicial"
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white cursor-pointer transition-all"
          >
            <RotateCcw size={15} />
          </button>

          <div className="w-px h-5 bg-[#00C2E0]/30 mx-0.5" />

          <button
            onClick={handleZoomIn}
            title="Acercar (+)"
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white cursor-pointer transition-all"
          >
            <ZoomIn size={15} />
          </button>

          <button
            onClick={handleZoomOut}
            title="Alejar (-)"
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white cursor-pointer transition-all"
          >
            <ZoomOut size={15} />
          </button>

          <div className="w-px h-5 bg-[#00C2E0]/30 mx-0.5" />

          {/* FULLSCREEN TOGGLE BUTTON */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Ver en pantalla completa (100%)'}
            className="p-2.5 rounded-lg bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white hover:brightness-110 cursor-pointer transition-all shadow-md shadow-[#0077D4]/30 flex items-center gap-1.5 text-xs font-bold"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="hidden md:inline">{isFullscreen ? 'Salir' : 'Pantalla Completa'}</span>
          </button>
        </div>
      </div>

      {/* 3D CANVAS MOUNT CONTAINER - FULLWIDTH & FULLHEIGHT */}
      <div
        ref={mountRef}
        onClick={handleCanvasClick}
        className="w-full h-full flex-1 min-h-0 cursor-grab active:cursor-grabbing"
      />

      {/* BOTTOM INFO OVERLAY */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#002D5E]/85 backdrop-blur-md border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-xs text-[#0077D4] dark:text-blue-100 flex items-center gap-2 shadow-lg">
          <Eye size={14} className="text-[#0077D4] dark:text-[#00C2E0]" />
          <span>Haz clic y arrastra para rotar 360° • Usa 'Rotar X/Y' o los botones de vista Frontal/Oclusal para orientar</span>
        </div>

        {selectedToothName && (
          <div className="pointer-events-auto px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white text-xs font-bold shadow-md shadow-[#0077D4]/40 flex items-center gap-2">
            <span>Pieza Seleccionada: {selectedToothName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
