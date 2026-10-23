/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Building2, Compass, Eye, EyeOff, Layers, Users, Briefcase, FileCheck, Rocket } from 'lucide-react';
import { SirhState } from '../../store/sirhStore';

interface CorporateCampus3DProps {
  state: SirhState;
  onSelectHub?: (hubId: 'besoin' | 'recrutement' | 'embauche' | 'onboarding') => void;
}

export const CorporateCampus3D: React.FC<CorporateCampus3DProps> = ({ state, onSelectHub }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activeZone, setActiveZone] = useState<string>('Vue Générale du Campus');
  const [selectedHubMetrics, setSelectedHubMetrics] = useState<{
    id: string;
    title: string;
    description: string;
    kpi: string;
    actionLabel: string;
    route: 'besoin' | 'recrutement' | 'embauche' | 'onboarding';
  } | null>(null);

  // References to keep animation loop & controls outside React re-renders
  const cameraTargetRef = useRef<{ pos: THREE.Vector3; lookAt: THREE.Vector3 }>({
    pos: new THREE.Vector3(35, 28, 42),
    lookAt: new THREE.Vector3(0, 2, 0),
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL from renderer string (Three.js skill directive)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0xf1f5f9); // slate-100
    scene.background = bgColor;
    scene.fog = new THREE.Fog(bgColor, 50, 140);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.5,
      300
    );
    camera.position.set(35, 28, 42);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent camera clipping below floor
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.target.set(0, 2, 0);

    // Mandatory Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig (Key Light + Cool Fill + Rim)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2); // Warm daylight
    keyLight.position.set(30, 45, 25);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 10;
      keyLight.shadow.camera.far = 120;
      const d = 35;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0004;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xe2e8f0, 0x94a3b8, 1.1); // Cool sky / ground fill
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    rimLight.position.set(-30, 25, -20);
    scene.add(rimLight);

    // =========================================================================
    // PROCEDURAL 3D PROCEDURAL ASSETS (Zero external file dependencies)
    // Campus Base, Landscaping, Headquarters Wings & 4 Interactive Hubs
    // =========================================================================

    // Ground & Plaza
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Campus Main Podium / Platform
    const platformGeo = new THREE.BoxGeometry(70, 0.4, 55);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
      metalness: 0.1,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, 0.2, 0);
    platform.receiveShadow = !isSoftwareGl;
    scene.add(platform);

    // Walkways / Pathways in dark slate
    const pathGeo = new THREE.PlaneGeometry(6, 45);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.7,
      metalness: 0.05,
    });
    const mainPath = new THREE.Mesh(pathGeo, pathMat);
    mainPath.rotation.x = -Math.PI / 2;
    mainPath.position.set(0, 0.41, 2);
    scene.add(mainPath);

    // Helper: Procedural Tree (Trunk + 3 canopy tiers, varied roughness)
    const createTree = (x: number, z: number, scale = 1) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);
      treeGroup.scale.set(scale, scale, scale);

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.8, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, metalness: 0.05 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.9;
      trunk.castShadow = !isSoftwareGl;
      treeGroup.add(trunk);

      // Canopy tiers
      const leavesMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65, metalness: 0.05 });
      const leavesMat2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7, metalness: 0.05 });

      const tier1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 7), leavesMat1);
      tier1.position.y = 2.4;
      tier1.castShadow = !isSoftwareGl;
      treeGroup.add(tier1);

      const tier2 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.8, 7), leavesMat2);
      tier2.position.y = 3.3;
      tier2.castShadow = !isSoftwareGl;
      treeGroup.add(tier2);

      return treeGroup;
    };

    // Plant trees around the perimeter
    const treePositions = [
      [-28, -20], [-25, -22], [-28, 15], [-24, 20],
      [28, -20], [25, -22], [28, 16], [24, 21],
      [-15, -24], [15, -24], [-6, 24], [6, 24]
    ];
    for (const [tx, tz] of treePositions) {
      scene.add(createTree(tx, tz, 0.9 + Math.random() * 0.3));
    }

    // =========================================================================
    // 4 INTERACTIVE HUBS CORRESPONDING TO SIRH BLOCS
    // =========================================================================
    const interactiveObjects: THREE.Object3D[] = [];

    // HUB 1 : Aile "Expression du Besoin" (Bureaux Managers & Postes)
    const hubBesoin = new THREE.Group();
    hubBesoin.position.set(-18, 0.4, -10);
    hubBesoin.userData = { hubId: 'besoin', title: 'Pôle Managers & Postes (Bloc 1)' };

    // Building Base
    const b1Base = new THREE.Mesh(
      new THREE.BoxGeometry(16, 8, 14),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.2 }) // Blue corporate
    );
    b1Base.position.y = 4;
    b1Base.castShadow = !isSoftwareGl;
    b1Base.receiveShadow = !isSoftwareGl;
    hubBesoin.add(b1Base);

    // Glass facades (windows)
    const b1Glass = new THREE.Mesh(
      new THREE.BoxGeometry(16.2, 2.5, 12),
      new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        roughness: 0.1,
        metalness: 0.85,
        transparent: true,
        opacity: 0.85,
      })
    );
    b1Glass.position.y = 4;
    hubBesoin.add(b1Glass);

    // Roof Accent
    const b1Roof = new THREE.Mesh(
      new THREE.BoxGeometry(17, 0.5, 15),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 })
    );
    b1Roof.position.y = 8.25;
    hubBesoin.add(b1Roof);
    scene.add(hubBesoin);
    interactiveObjects.push(hubBesoin);

    // HUB 2 : Pôle "Recrutement & Salons d'Entretiens" (Bloc 2)
    const hubRecrutement = new THREE.Group();
    hubRecrutement.position.set(18, 0.4, -10);
    hubRecrutement.userData = { hubId: 'recrutement', title: 'Lounge Recrutement & Entretiens (Bloc 2)' };

    const b2Base = new THREE.Mesh(
      new THREE.BoxGeometry(16, 7, 14),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35, metalness: 0.25 }) // Indigo
    );
    b2Base.position.y = 3.5;
    b2Base.castShadow = !isSoftwareGl;
    b2Base.receiveShadow = !isSoftwareGl;
    hubRecrutement.add(b2Base);

    // Cylindrical Interview Meeting Pod (Composite glass cylinder)
    const podGeo = new THREE.CylinderGeometry(3.5, 3.5, 5, 24);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0xa5b4fc,
      roughness: 0.15,
      metalness: 0.7,
      transparent: true,
      opacity: 0.8,
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(0, 3.5, 8.5);
    pod.castShadow = !isSoftwareGl;
    hubRecrutement.add(pod);

    const podCap = new THREE.Mesh(
      new THREE.CylinderGeometry(3.8, 3.8, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.4 })
    );
    podCap.position.set(0, 6.2, 8.5);
    hubRecrutement.add(podCap);

    scene.add(hubRecrutement);
    interactiveObjects.push(hubRecrutement);

    // HUB 3 : Aile "Direction & Signature des Contrats" (Bloc 3)
    const hubEmbauche = new THREE.Group();
    hubEmbauche.position.set(-18, 0.4, 12);
    hubEmbauche.userData = { hubId: 'embauche', title: 'Pavillon Direction & Contrats (Bloc 3)' };

    const b3Base = new THREE.Mesh(
      new THREE.BoxGeometry(15, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.3, metalness: 0.3 }) // Emerald/Teal
    );
    b3Base.position.y = 3;
    b3Base.castShadow = !isSoftwareGl;
    hubEmbauche.add(b3Base);

    // Executive Boardroom Skylight
    const b3Glass = new THREE.Mesh(
      new THREE.BoxGeometry(12, 1.2, 9),
      new THREE.MeshStandardMaterial({ color: 0xccfbf1, roughness: 0.1, metalness: 0.9 })
    );
    b3Glass.position.y = 6.6;
    hubEmbauche.add(b3Glass);

    scene.add(hubEmbauche);
    interactiveObjects.push(hubEmbauche);

    // HUB 4 : Pôle "Tech, Logistique & Onboarding" (Bloc 4)
    const hubOnboarding = new THREE.Group();
    hubOnboarding.position.set(18, 0.4, 12);
    hubOnboarding.userData = { hubId: 'onboarding', title: 'Centre Onboarding & Logistique (Bloc 4)' };

    const b4Base = new THREE.Mesh(
      new THREE.BoxGeometry(15, 6.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.35, metalness: 0.2 }) // Rose/Red
    );
    b4Base.position.y = 3.25;
    b4Base.castShadow = !isSoftwareGl;
    hubOnboarding.add(b4Base);

    // IT Tech antenna on roof
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 })
    );
    antenna.position.set(5, 8.5, 3);
    hubOnboarding.add(antenna);

    scene.add(hubOnboarding);
    interactiveObjects.push(hubOnboarding);

    // Central Glass Atrium / Talent Hub (Connecting all wings)
    const centralHub = new THREE.Group();
    centralHub.position.set(0, 0.4, 0);

    const atriumGeo = new THREE.CylinderGeometry(5.5, 6.5, 10, 16);
    const atriumMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.65,
    });
    const atrium = new THREE.Mesh(atriumGeo, atriumMat);
    atrium.position.y = 5;
    atrium.castShadow = !isSoftwareGl;
    centralHub.add(atrium);

    const atriumDome = new THREE.Mesh(
      new THREE.SphereGeometry(5.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.5 })
    );
    atriumDome.position.y = 10;
    centralHub.add(atriumDome);

    scene.add(centralHub);

    // Soft Radial Contact Shadow below buildings
    const contactShadowGeo = new THREE.PlaneGeometry(65, 50);
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 256;
    contactCanvas.height = 256;
    const ctx = contactCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 120);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const contactTex = new THREE.CanvasTexture(contactCanvas);
    contactTex.colorSpace = THREE.SRGBColorSpace;
    const contactShadow = new THREE.Mesh(
      contactShadowGeo,
      new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.42;
    scene.add(contactShadow);

    // =========================================================================
    // RAYCASTING & INTERACTION DISCIPLINE
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let parentGroup: THREE.Object3D | null = intersects[0].object;
        while (parentGroup && !parentGroup.userData.hubId && parentGroup.parent !== scene) {
          parentGroup = parentGroup.parent;
        }

        if (parentGroup && parentGroup.userData.hubId) {
          const hubId = parentGroup.userData.hubId as 'besoin' | 'recrutement' | 'embauche' | 'onboarding';
          focusHub(hubId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // =========================================================================
    // CAMERA SMOOTH EXPONENTIAL DAMPING (Three.js skill directive)
    // =========================================================================
    let frameId = 0;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth exponential camera gliding
      const factor = 1 - Math.exp(-4 * dt);
      camera.position.lerp(cameraTargetRef.current.pos, factor);
      controls.target.lerp(cameraTargetRef.current.lookAt, factor);
      controls.update();

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 80);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
    };
  }, []);

  // Camera presets
  const focusHub = (hubId: 'besoin' | 'recrutement' | 'embauche' | 'onboarding' | 'general') => {
    if (hubId === 'general') {
      cameraTargetRef.current = {
        pos: new THREE.Vector3(35, 28, 42),
        lookAt: new THREE.Vector3(0, 2, 0),
      };
      setActiveZone('Vue Générale du Campus');
      setSelectedHubMetrics(null);
    } else if (hubId === 'besoin') {
      cameraTargetRef.current = {
        pos: new THREE.Vector3(-18, 14, 10),
        lookAt: new THREE.Vector3(-18, 4, -10),
      };
      setActiveZone('Bloc 1 : Expression du Besoin & Postes');
      setSelectedHubMetrics({
        id: 'besoin',
        title: 'Bloc 1 : Expression du Besoin en Personnel',
        description: 'Gestion des postes ouverts, des effectifs autorisés et du circuit de validation séquentiel.',
        kpi: `${state.demandes.length} demandes (${state.demandes.filter(d => d.statut === 'OUVERTE').length} ouvertes)`,
        actionLabel: 'Accéder aux Demandes & Postes',
        route: 'besoin',
      });
    } else if (hubId === 'recrutement') {
      cameraTargetRef.current = {
        pos: new THREE.Vector3(18, 14, 10),
        lookAt: new THREE.Vector3(18, 4, -10),
      };
      setActiveZone('Bloc 2 : Recrutement & Lounge Entretiens');
      setSelectedHubMetrics({
        id: 'recrutement',
        title: 'Bloc 2 : Recrutement, Offres & Évaluations',
        description: 'Offres publiées, candidatures reçues, entretiens planifiés et grilles de notation.',
        kpi: `${state.offres.length} offres actives · ${state.candidatures.length} candidatures reçues`,
        actionLabel: 'Gérer les Offres & Candidats',
        route: 'recrutement',
      });
    } else if (hubId === 'embauche') {
      cameraTargetRef.current = {
        pos: new THREE.Vector3(-18, 12, 30),
        lookAt: new THREE.Vector3(-18, 3, 12),
      };
      setActiveZone('Bloc 3 : Embauche & Signature');
      setSelectedHubMetrics({
        id: 'embauche',
        title: 'Bloc 3 : Sélection, Propositions & Dossiers Salariés',
        description: 'Propositions d’embauche versionnées, transaction atomique et conformité des pièces.',
        kpi: `${state.propositions.length} propositions émises · ${state.employes.length} collaborateurs`,
        actionLabel: 'Consulter les Propositions',
        route: 'embauche',
      });
    } else if (hubId === 'onboarding') {
      cameraTargetRef.current = {
        pos: new THREE.Vector3(18, 12, 30),
        lookAt: new THREE.Vector3(18, 3, 12),
      };
      setActiveZone('Bloc 4 : Onboarding & Parcours Collaborateur');
      setSelectedHubMetrics({
        id: 'onboarding',
        title: 'Bloc 4 : Contrats, Affectations & Onboarding',
        description: 'Checklist d’intégration par service (RH, IT, Logistique), signature et alertes fins d’essai.',
        kpi: `${state.contrats.length} contrats générés · ${state.onboardings.length} parcours actifs`,
        actionLabel: 'Suivre l’Onboarding',
        route: 'onboarding',
      });
    }
  };

  return (
    <div className="relative w-full h-[640px] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Top Brand / Indicator (Top-Left, single unboxed text as per constitution) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/60 text-white backdrop-blur-none">
        <Building2 className="w-4 h-4 text-indigo-400" />
        <div className="text-xs font-medium">
          <span className="text-slate-300">Siège Social & Campus 3D</span>
          <span className="mx-2 text-slate-500">·</span>
          <span className="text-indigo-300">{activeZone}</span>
        </div>
      </div>

      {/* Selected Hub Floating Card (if clicked) */}
      {selectedHubMetrics && (
        <div className="absolute top-4 right-4 z-10 max-w-sm bg-white p-4 rounded-xl shadow-lg border border-slate-200">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-slate-900">{selectedHubMetrics.title}</h4>
            <button
              onClick={() => setSelectedHubMetrics(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{selectedHubMetrics.description}</p>
          <div className="mt-2.5 p-2 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 font-medium">
            {selectedHubMetrics.kpi}
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onSelectHub && onSelectHub(selectedHubMetrics.route)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {selectedHubMetrics.actionLabel} →
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Bottom Control Dock (Mandatory Three.js Skill Directive) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-3xl transition-transform duration-300 ${
          hudCollapsed ? 'translate-y-24' : 'translate-y-0'
        }`}
      >
        {/* Dock Collapse Toggle Button */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-medium rounded-t-lg border-t border-x border-slate-700 shadow-sm transition-colors"
          >
            {hudCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{hudCollapsed ? 'Afficher les commandes 3D' : 'Masquer le panneau 3D'}</span>
          </button>
        </div>

        {/* Control Bar Surface */}
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">Navigation Pôles SIRH</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => focusHub('general')}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors whitespace-nowrap"
            >
              Vue Globale
            </button>
            <button
              onClick={() => focusHub('besoin')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-700/50 transition-colors whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Bloc 1 : Besoin</span>
            </button>
            <button
              onClick={() => focusHub('recrutement')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-200 border border-indigo-700/50 transition-colors whitespace-nowrap"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Bloc 2 : Recrutement</span>
            </button>
            <button
              onClick={() => focusHub('embauche')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-teal-900/40 hover:bg-teal-800/60 text-teal-200 border border-teal-700/50 transition-colors whitespace-nowrap"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Bloc 3 : Embauche</span>
            </button>
            <button
              onClick={() => focusHub('onboarding')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-700/50 transition-colors whitespace-nowrap"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Bloc 4 : Onboarding</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
