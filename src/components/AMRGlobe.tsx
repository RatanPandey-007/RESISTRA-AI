import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MapPin } from 'lucide-react';

export interface NodeData {
  name: string;
  lat: number;
  lon: number;
  rate: number;
  status: 'critical' | 'high' | 'normal';
  organism: string;
  antibiotic: string;
}

interface AMRGlobeProps {
  isDemoActive?: boolean;
  className?: string;
  onSelectNode?: (node: NodeData) => void;
  onSelectRegion?: (region: string) => void;
}

export const SURVEILLANCE_NODES: NodeData[] = [
  { name: 'India Clinical Grid (New Delhi)', lat: 28.6139, lon: 77.2090, rate: 54.1, status: 'critical', organism: 'E. coli', antibiotic: 'Ciprofloxacin' },
  { name: 'Asia Surveillance Hub (Singapore)', lat: 1.3521, lon: 103.8198, rate: 52.7, status: 'critical', organism: 'E. coli', antibiotic: 'Ciprofloxacin' },
  { name: 'North American Command (CDC Grid)', lat: 40.7128, lon: -95.0060, rate: 42.1, status: 'high', organism: 'E. coli', antibiotic: 'Ciprofloxacin' },
  { name: 'European Surveillance Center (ECDC)', lat: 50.5074, lon: 15.1278, rate: 44.3, status: 'high', organism: 'K. pneumoniae', antibiotic: 'Ceftriaxone' },
  { name: 'African AMR Observatory (Nairobi)', lat: -1.2921, lon: 36.8219, rate: 39.8, status: 'normal', organism: 'P. aeruginosa', antibiotic: 'Gentamicin' },
  { name: 'Latin America Network (São Paulo)', lat: -23.5505, lon: -46.6333, rate: 41.5, status: 'high', organism: 'S. aureus', antibiotic: 'Oxacillin' },
  { name: 'Oceania Regional Node (Sydney)', lat: -33.8688, lon: 151.2093, rate: 26.4, status: 'normal', organism: 'E. coli', antibiotic: 'Ciprofloxacin' }
];

export const REGIONAL_STATS = [
  { region: 'Global Aggregate', rate: '48.2%', trend: '+12%', isUp: true, isCritical: false },
  { region: 'India Clinical Grid', rate: '54.1%', trend: '+17%', isUp: true, isCritical: true },
  { region: 'Asia Surveillance Hub', rate: '52.7%', trend: '+16%', isUp: true, isCritical: true },
  { region: 'European Sentinel', rate: '44.3%', trend: '+9%', isUp: true, isCritical: false },
  { region: 'North American Grid', rate: '42.1%', trend: '+11%', isUp: true, isCritical: false },
  { region: 'African Observatory', rate: '39.8%', trend: '+7%', isUp: true, isCritical: false }
];

// Helper: Convert Lat/Lon to 3D Cartesian coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const AMRGlobe: React.FC<AMRGlobeProps> = ({
  isDemoActive = false,
  className = '',
  onSelectNode,
  onSelectRegion
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 700;
    let height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020406, 0.0016);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1200);
    camera.position.set(0, 16, 240);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false, 
      powerPreference: 'high-performance' 
    });
    renderer.setClearColor(0x020406, 1.0); // Exact #020406 near-black graphite
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Specialized Scientific Instrumentation Lighting
    const ambientLight = new THREE.AmbientLight(0x091424, 2.2);
    scene.add(ambientLight);

    // Key light from top-right giving realistic spherical curvature shading
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(140, 130, 110);
    scene.add(keyLight);

    // Precise cyan rim light for space edge definition
    const rimLight = new THREE.DirectionalLight(0x18bfff, 3.8);
    rimLight.position.set(-150, -30, -110);
    scene.add(rimLight);

    // Subsurface blue backlight
    const blueBackLight = new THREE.PointLight(0x38bdf8, 2.0, 300);
    blueBackLight.position.set(0, -100, -80);
    scene.add(blueBackLight);

    // 3. Globe Core Structure
    const globeRadius = 72;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Deep Oceanic Core (Shaded Graphite-Navy)
    const coreGeo = new THREE.SphereGeometry(globeRadius, 54, 54);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x040a14,
      emissive: 0x02050b,
      specular: 0x18bfff,
      shininess: 40,
      transparent: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Razor-thin technical latitude & longitude telemetry grid
    const gridGeo = new THREE.SphereGeometry(globeRadius * 1.003, 36, 36);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x18bfff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // Atmospheric Glow Layer 1 (Close cyan rim)
    const atmoGeo = new THREE.SphereGeometry(globeRadius * 1.05, 40, 40);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x18bfff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // Atmospheric Glow Layer 2 (Outer faint deep-blue halo)
    const outerHaloGeo = new THREE.SphereGeometry(globeRadius * 1.14, 36, 36);
    const outerHaloMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const outerHaloMesh = new THREE.Mesh(outerHaloGeo, outerHaloMat);
    globeGroup.add(outerHaloMesh);

    // 4. High-Density Continental Point Grid
    const dotCount = 2800;
    const dotPositions = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);

    // Geographic continental clusters (featuring India and Indo-Asian corridors prominently)
    const continentClusters = [
      { lat: 22, lon: 79, count: 680 },   // India / South Asia (Highest density)
      { lat: 34, lon: 104, count: 540 },  // East Asia
      { lat: 50, lon: 16, count: 460 },   // Europe
      { lat: 42, lon: -98, count: 420 },  // North America
      { lat: 4, lon: 24, count: 320 },    // Africa
      { lat: -16, lon: -56, count: 240 }, // South America
      { lat: -25, lon: 135, count: 140 }  // Australia
    ];

    let dotIdx = 0;
    continentClusters.forEach((cluster) => {
      for (let i = 0; i < cluster.count && dotIdx < dotCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const spreadLat = (u - 0.5) * 36;
        const spreadLon = (v - 0.5) * 44;
        const p = latLonToVector3(cluster.lat + spreadLat, cluster.lon + spreadLon, globeRadius + 0.8);
        dotPositions[dotIdx * 3] = p.x;
        dotPositions[dotIdx * 3 + 1] = p.y;
        dotPositions[dotIdx * 3 + 2] = p.z;

        // India / Asia epicenter highlighting
        const isIndiaCluster = Math.hypot(cluster.lat + spreadLat - 24, cluster.lon + spreadLon - 78) < 18;
        if (isIndiaCluster) {
          // Critical AMR alert red-amber photon tint
          dotColors[dotIdx * 3] = 1.0;
          dotColors[dotIdx * 3 + 1] = 0.28;
          dotColors[dotIdx * 3 + 2] = 0.28;
        } else {
          // Technical Cyan
          dotColors[dotIdx * 3] = 0.12;
          dotColors[dotIdx * 3 + 1] = 0.8;
          dotColors[dotIdx * 3 + 2] = 1.0;
        }
        dotIdx++;
      }
    });

    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotsGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const dotsMesh = new THREE.Points(dotsGeo, dotsMat);
    globeGroup.add(dotsMesh);

    // 5. Tilted Orbital Trajectory Ring (Mission telemetry feel)
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = Math.PI / 3.2;
    orbitGroup.rotation.y = Math.PI / 8;
    scene.add(orbitGroup);

    const orbitRadius = globeRadius * 1.34;
    const orbitGeo = new THREE.RingGeometry(orbitRadius - 0.4, orbitRadius + 0.4, 80);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x18bfff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitGroup.add(orbitMesh);

    // Traveling Data Packet on Orbit
    const satelliteGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const satelliteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending
    });
    const satelliteMesh = new THREE.Mesh(satelliteGeo, satelliteMat);
    orbitGroup.add(satelliteMesh);

    // 6. Concentric Ground Pedestal (Holographic platform beneath the sphere)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -globeRadius - 16, 0);
    pedestalGroup.rotation.x = Math.PI / 2.06;
    scene.add(pedestalGroup);

    [24, 46, 70, 96, 118].forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r, r + (idx === 2 ? 2.0 : 0.8), 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x18bfff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18 + idx * 0.06,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      pedestalGroup.add(ringMesh);
    });

    // 7. Hotspot Nodes, Pulsing Concentric Rings & Vertical Light Beacons
    const nodeMeshes: THREE.Mesh[] = [];
    const pulseRings: THREE.Mesh[] = [];
    const beaconBeams: THREE.Mesh[] = [];

    SURVEILLANCE_NODES.forEach((node, i) => {
      const pos = latLonToVector3(node.lat, node.lon, globeRadius + 1.2);
      const isCritical = node.status === 'critical' || (isDemoActive && node.rate > 45);
      const nodeColor = isCritical ? 0xff3b4e : node.status === 'high' ? 0xffb020 : 0x18bfff;

      // Spherical node marker
      const nodeGeo = new THREE.SphereGeometry(isCritical ? 3.0 : 1.8, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        blending: THREE.AdditiveBlending
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { nodeData: node };
      globeGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Concentric pulsating telemetry ring
      const ringGeo = new THREE.RingGeometry(2.4, isCritical ? 6.8 : 4.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isCritical ? 0.85 : 0.45,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);
      pulseRings.push(ringMesh);

      // 3D Vertical Light Beacon Column extending outwards
      if (isCritical || i === 0) {
        const beaconHeight = i === 0 ? 28 : 20;
        const beaconGeo = new THREE.CylinderGeometry(0.35, 1.6, beaconHeight, 16);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending
        });
        const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);

        const normal = pos.clone().normalize();
        const beaconPos = pos.clone().add(normal.clone().multiplyScalar(beaconHeight / 2));
        beaconMesh.position.copy(beaconPos);
        beaconMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

        globeGroup.add(beaconMesh);
        beaconBeams.push(beaconMesh);
      }
    });

    // 8. Animated Signal Arcs connecting India / Singapore to Global Sentinel Nodes
    const arcLines: THREE.Line[] = [];
    const indiaPos = latLonToVector3(SURVEILLANCE_NODES[0].lat, SURVEILLANCE_NODES[0].lon, globeRadius);

    for (let i = 1; i < SURVEILLANCE_NODES.length; i++) {
      const targetPos = latLonToVector3(SURVEILLANCE_NODES[i].lat, SURVEILLANCE_NODES[i].lon, globeRadius);
      const midPoint = new THREE.Vector3().addVectors(indiaPos, targetPos).multiplyScalar(0.5);
      const distance = indiaPos.distanceTo(targetPos);
      midPoint.normalize().multiplyScalar(globeRadius + distance * 0.38);

      const curve = new THREE.QuadraticBezierCurve3(indiaPos, midPoint, targetPos);
      const points = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const isCriticalArc = i <= 2 || isDemoActive;
      const arcMat = new THREE.LineBasicMaterial({
        color: isCriticalArc ? 0xff3b4e : 0x18bfff,
        transparent: true,
        opacity: isCriticalArc ? 0.75 : 0.35,
        blending: THREE.AdditiveBlending
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
      arcLines.push(arcLine);
    }

    // 9. Interactive Mouse Drag & Raycasting
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const found = intersects[0].object.userData.nodeData as NodeData;
        setHoveredNode(found);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        if (!isDragging) {
          document.body.style.cursor = 'default';
        }
      }

      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const node = intersects[0].object.userData.nodeData as NodeData;
        if (onSelectNode) onSelectNode(node);
        if (onSelectRegion) onSelectRegion(node.name);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('click', onClick);

    // Initial orientation: Center directly on India (28.6°N, 77.2°E)
    globeGroup.rotation.y = 4.25;
    globeGroup.rotation.x = 0.28;

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle planetary rotation
      if (!isDragging) {
        globeGroup.rotation.y += 0.0016;
      }

      // Hotspot pulse scale animation
      pulseRings.forEach((ring, index) => {
        const scale = 1 + 0.38 * Math.sin(elapsedTime * 3.6 + index);
        ring.scale.set(scale, scale, 1);
      });

      // 3D Beacon beam pulsing
      beaconBeams.forEach((beam, index) => {
        const scale = 1 + 0.2 * Math.sin(elapsedTime * 4.2 + index);
        beam.scale.set(scale, 1, scale);
      });

      // Traveling satellite on tilted orbit
      const satAngle = elapsedTime * 0.75;
      satelliteMesh.position.set(
        orbitRadius * Math.cos(satAngle),
        orbitRadius * Math.sin(satAngle),
        0
      );

      // Holographic pedestal slow counter-rotation
      pedestalGroup.rotation.z += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('click', onClick);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      renderer.dispose();
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
    };
  }, [isDemoActive, onSelectNode]);

  return (
    <div className={`relative w-full h-full min-h-[460px] sm:min-h-[520px] bg-[#020406] select-none ${className}`}>
      {/* 3D WebGL Canvas Sphere Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Spatial Instrumentation Overlay (visionOS / Tesla telemetry style) */}
      
      {/* Top Left: Planetary Telemetry Coordinates */}
      <div className="absolute top-4 left-5 z-20 pointer-events-none font-mono text-[10px] text-slate-500 space-y-1">
        <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          SPATIAL SURVEILLANCE GRID // 3D PROJECTION
        </div>
        <div className="text-slate-400 tabular-telemetry">
          SENTINEL FOCUS: 28.6139° N, 77.2090° E (INDIA GRID)
        </div>
        <div className="text-slate-600 tabular-telemetry">
          ALT: 640 KM | ORBIT: 92.4 MIN | FREQ: 1420 MHZ
        </div>
      </div>

      {/* Floating Pinned India / Asia Telemetry HUD Card */}
      <div className="absolute top-10 right-6 sm:right-10 z-20 pointer-events-none animate-in fade-in duration-500">
        <div className="p-3.5 rounded-xl spatial-surface-elevated font-mono text-[11px] leading-tight max-w-[200px]">
          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <span>INDIA GRID</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-white text-xs font-semibold">
            Resistance: <strong className="text-rose-400 font-bold">54.1%</strong>
          </div>
          <div className="text-rose-400 text-[10px] mt-0.5">
            Surge Drift: +17 pp
          </div>
          <div className="text-slate-400 text-[9px] mt-1 pt-1 border-t border-white/[0.08]">
            E. coli × Ciprofloxacin
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-cyan-400 -mt-1 ml-6 shadow-[0_0_8px_rgba(24,191,255,1)]" />
      </div>

      {/* Bottom Left: High-Precision Telemetry Legend */}
      <div className="absolute bottom-4 left-5 z-20 flex items-center gap-4 p-2.5 rounded-xl spatial-surface font-mono text-[10px] text-slate-400 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 telemetry-pulse-red" />
          <span className="text-slate-200">Critical (&gt;50%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-slate-200">Warning (40-50%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-200">Normal (&lt;40%)</span>
        </div>
      </div>

      {/* Hover Node Inspector HUD */}
      {hoveredNode && (
        <div className="absolute top-16 left-6 z-30 p-3.5 rounded-xl spatial-surface-elevated text-xs space-y-1 font-mono pointer-events-none shadow-2xl">
          <div className="font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {hoveredNode.name}
          </div>
          <div className="text-slate-300 text-[11px]">
            Target: {hoveredNode.organism} × {hoveredNode.antibiotic}
          </div>
          <div className="text-rose-400 font-bold tabular-telemetry">
            Resistance Prevalence: {hoveredNode.rate.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
};
