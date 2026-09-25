"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowRight, Compass, ShieldAlert, Sparkles, Droplets, TrendingUp, SunMedium, MapPin, Navigation, Loader2 } from "lucide-react";
import { UserLocation } from "@/lib/geo-utils";

interface Farm3DHeroProps {
  userLocation: UserLocation | null;
  isDetectingLocation: boolean;
  onDetectLocationClick: () => void;
  onAnalyzeClick: () => void;
  onExploreFarmClick: () => void;
}

export const Farm3DHero: React.FC<Farm3DHeroProps> = ({
  userLocation,
  isDetectingLocation,
  onDetectLocationClick,
  onAnalyzeClick,
  onExploreFarmClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07120b, 0.028);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 4.5, 12);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 1. Terrain Soil Geometry
    const terrainGeo = new THREE.PlaneGeometry(36, 36, 48, 48);
    // Add realistic furrow ridges to terrain
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Furrows wave along x
      const z = Math.sin(x * 1.8) * 0.22 + Math.cos(y * 0.4) * 0.15;
      pos.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x1f1610, // Rich fertile loamy earth brown
      roughness: 0.92,
      metalness: 0.05,
      flatShading: true
    });

    const terrain = new THREE.Mesh(terrainGeo, soilMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.5;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 2. Crop Stalks (Instanced Meshes for ultra-smooth 60fps performance)
    const cropCount = 500;
    const stalkGeo = new THREE.CylinderGeometry(0.03, 0.06, 1.6, 5);
    const leafGeo = new THREE.ConeGeometry(0.18, 0.6, 4);

    const cropMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.65,
      metalness: 0.1
    });

    const cropCluster = new THREE.Group();
    const stalks: THREE.Mesh[] = [];

    // Arrange in realistic agricultural farm rows
    const rowCount = 7;
    const cropsPerRow = 60;
    let idx = 0;

    for (let r = 0; r < rowCount; r++) {
      const xPos = (r - rowCount / 2) * 2.2;
      for (let c = 0; c < cropsPerRow; c++) {
        if (idx >= cropCount) break;
        const zPos = (c - cropsPerRow / 2) * 0.55;

        const stalk = new THREE.Mesh(stalkGeo, cropMat);
        stalk.position.set(xPos + (Math.random() * 0.2 - 0.1), 0.3, zPos);
        stalk.rotation.z = (Math.random() - 0.5) * 0.15;
        stalk.castShadow = true;

        // Leaf canopy at top
        const leaf = new THREE.Mesh(leafGeo, cropMat);
        leaf.position.y = 0.7;
        leaf.rotation.x = Math.PI;
        stalk.add(leaf);

        cropCluster.add(stalk);
        stalks.push(stalk);
        idx++;
      }
    }
    scene.add(cropCluster);

    // 3. Floating Bioluminescent Spores / Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 25;
      particlePos[i + 1] = Math.random() * 7 + 0.2;
      particlePos[i + 2] = (Math.random() - 0.5) * 25;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Volumetric Clouds / Horizon Puffs
    const cloudGeo = new THREE.DodecahedronGeometry(1.8, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x243b2e,
      roughness: 0.9,
      transparent: true,
      opacity: 0.35
    });

    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set((i - 2.5) * 6, 5 + Math.random() * 2, -12 + Math.random() * 4);
      cloud.scale.set(2 + Math.random(), 0.8, 1.4);
      scene.add(cloud);
    }

    // 5. Lighting: Golden-hour Sunlight & Emerald Farm Radiance
    const ambientLight = new THREE.AmbientLight(0x0c2918, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3d1, 2.2);
    sunLight.position.set(10, 16, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Accent emerald neon rim light
    const rimLight = new THREE.PointLight(0x10b981, 2.5, 20);
    rimLight.position.set(-6, 2, 4);
    scene.add(rimLight);

    // Mouse Interaction for parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Wind sway in crop canopy
      stalks.forEach((st, i) => {
        st.rotation.z = Math.sin(time * 2.2 + st.position.x * 1.5 + st.position.z) * 0.12;
      });

      // Particle float
      const pPositions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pPositions[i] += Math.sin(time + pPositions[i - 1]) * 0.003;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Gentle camera parallax
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (4.5 - mouseY * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(0, 1.2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-emerald-500/20">
      {/* 3D Three.js WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-auto" />

      {/* Atmospheric Vignette & Gradient Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#07120b] via-[#07120b]/35 to-transparent" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#07120b]/40 to-[#07120b]/90" />

      {/* Hero Content Section */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center flex flex-col items-center">
        {/* Badges Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {/* Interactive GPS Location Badge */}
          <button
            onClick={onDetectLocationClick}
            disabled={isDetectingLocation}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wide backdrop-blur-md border transition-all cursor-pointer ${
              userLocation?.isDetected
                ? "bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-900/80"
                : "bg-black/60 border-amber-500/40 text-amber-300 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            }`}
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Querying Browser GPS Hardware...</span>
              </>
            ) : userLocation?.isDetected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  📍 Farm GPS: <strong>{userLocation.city}, {userLocation.state}</strong> ({userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°) • Live
                </span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>📍 Auto-Detect Live Farm GPS Location</span>
              </>
            )}
          </button>

          {/* Agtech Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.3)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AUTONOMOUS AG-VISION PIPELINE</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          AI That Understands <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-200 drop-shadow-[0_0_35px_rgba(16,185,129,0.45)]">
            Your Crops.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-base sm:text-xl text-emerald-100/80 font-normal leading-relaxed mb-10">
          Detect diseases, identify possible nutrient deficiencies, optimize watering, and discover better markets — all in one unified 3D agricultural platform.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onAnalyzeClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-black font-bold text-base shadow-[0_0_30px_rgba(16,185,129,0.55)] hover:shadow-[0_0_45px_rgba(16,185,129,0.85)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Analyze My Plant</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreFarmClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-100 font-semibold text-base backdrop-blur-md hover:border-emerald-400/70 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Explore My Farm</span>
          </button>
        </div>

        {/* Real-time Agro Metrics Bar */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
          <div className="glass-panel p-3.5 rounded-xl text-left border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400/80 text-xs mb-1">
              <SunMedium className="w-4 h-4 text-emerald-400" />
              <span>Ambient Temp</span>
            </div>
            <div className="text-xl font-bold text-white font-heading">31°C <span className="text-xs text-emerald-400 font-normal">Optimal</span></div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-left border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400/80 text-xs mb-1">
              <Droplets className="w-4 h-4 text-emerald-400" />
              <span>Soil Moisture</span>
            </div>
            <div className="text-xl font-bold text-white font-heading">24% <span className="text-xs text-amber-400 font-normal">Moderate</span></div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-left border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400/80 text-xs mb-1">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Rain Probability</span>
            </div>
            <div className="text-xl font-bold text-white font-heading">70% <span className="text-xs text-cyan-400 font-normal">Showers</span></div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-left border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400/80 text-xs mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Top Mandi (Tomato)</span>
            </div>
            <div className="text-xl font-bold text-white font-heading">₹37/kg <span className="text-xs text-emerald-400 font-normal">Palamaner</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
