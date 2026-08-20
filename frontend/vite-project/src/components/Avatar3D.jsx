import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Avatar3D = ({ predictionResult }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f4f8);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 12);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(8, 8, 8);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.8);
    pointLight1.position.set(-8, 0, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x1e40af, 0.7);
    pointLight2.position.set(8, 0, 8);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x06b6d4, 0.6);
    pointLight3.position.set(0, 8, -8);
    scene.add(pointLight3);

    // Create Advanced Medical Scanner - BIGGER VERSION
    const createScanner = () => {
      const group = new THREE.Group();

      // Central detection orb - LARGER
      const orbGeometry = new THREE.IcosahedronGeometry(1.2, 6);
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e40af,
        emissive: 0x3b82f6,
        shininess: 200,
        wireframe: false,
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.userData.type = "orb";
      orb.scale.set(1.3, 1.3, 1.3);
      group.add(orb);

      // Wireframe sphere overlay - LARGER
      const wireframeGeometry = new THREE.SphereGeometry(1.35, 32, 32);
      const wireframeMaterial = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        emissive: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
      wireframe.scale.set(1.4, 1.4, 1.4);
      group.add(wireframe);

      // Inner glowing sphere
      const innerSphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const innerSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.15,
      });
      const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
      innerSphere.scale.set(1.2, 1.2, 1.2);
      group.add(innerSphere);

      // Detection rings (pulsing waves) - MORE AND BIGGER
      const waves = [];
      for (let i = 0; i < 5; i++) {
        const waveGeometry = new THREE.TorusGeometry(2.2 + i * 0.8, 0.12, 32, 100);
        const waveMaterial = new THREE.MeshPhongMaterial({
          color: 0x3b82f6,
          emissive: 0x3b82f6,
          transparent: true,
          opacity: 0.6 - i * 0.1,
        });
        const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
        waveMesh.userData.index = i;
        waveMesh.userData.baseOpacity = 0.6 - i * 0.1;
        waveMesh.rotation.x = Math.random() * Math.PI;
        group.add(waveMesh);
        waves.push(waveMesh);
      }

      // Rotating detection bands - MORE AND BIGGER
      for (let band = 0; band < 3; band++) {
        const bandGeometry = new THREE.TorusGeometry(2.4 + band * 0.3, 0.1, 32, 100);
        const bandMaterial = new THREE.MeshPhongMaterial({
          color: [0x10b981, 0xf59e0b, 0x06b6d4][band],
          emissive: [0x10b981, 0xf59e0b, 0x06b6d4][band],
          transparent: true,
          opacity: 0.5,
        });
        const bandMesh = new THREE.Mesh(bandGeometry, bandMaterial);
        bandMesh.rotation.x = Math.PI / 2 + band * 0.5;
        bandMesh.userData.type = "band";
        bandMesh.userData.speed = 0.008 + band * 0.004;
        group.add(bandMesh);
      }

      // Floating detection points - MORE AND BIGGER
      const detectionPoints = [];
      for (let i = 0; i < 12; i++) {
        const pointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const pointMaterial = new THREE.MeshPhongMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          shininess: 120,
        });
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);

        const angle = (i / 12) * Math.PI * 2;
        pointMesh.position.set(
          Math.cos(angle) * 3.5,
          Math.sin(angle * 0.7) * 1.5,
          Math.sin(angle * 0.5) * 2.5
        );
        pointMesh.userData.angle = angle;
        detectionPoints.push(pointMesh);
        group.add(pointMesh);
      }

      // Additional inner detection points
      for (let i = 0; i < 8; i++) {
        const pointGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const pointMaterial = new THREE.MeshPhongMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          shininess: 100,
        });
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);

        const angle = (i / 8) * Math.PI * 2;
        pointMesh.position.set(
          Math.cos(angle) * 2,
          Math.sin(angle * 0.6) * 0.8,
          Math.sin(angle * 0.4) * 1.5
        );
        pointMesh.userData.angle = angle;
        pointMesh.userData.isInner = true;
        detectionPoints.push(pointMesh);
        group.add(pointMesh);
      }

      return { group, orb, waves, detectionPoints, innerSphere };
    };

    const scanner = createScanner();
    scene.add(scanner.group);

    // Animation Loop
    let animationId;
    let time = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      // Rotate central orb - FASTER
      scanner.orb.rotation.x += 0.008;
      scanner.orb.rotation.y += 0.012;

      // Inner sphere rotation
      scanner.innerSphere.rotation.x -= 0.003;
      scanner.innerSphere.rotation.y += 0.005;

      // Pulse detection waves - BIGGER EFFECT
      scanner.waves.forEach((wave, index) => {
        const pulseFactor = Math.sin(time * 2.5 - index * 0.6) * 0.6;
        wave.scale.set(1 + pulseFactor * 0.3, 1 + pulseFactor * 0.3, 1);
        wave.material.opacity = Math.max(0.1, wave.userData.baseOpacity + pulseFactor * 0.3);
      });

      // Rotate detection bands - FASTER
      scanner.group.children.forEach((child) => {
        if (child.userData.type === "band") {
          child.rotation.y += child.userData.speed;
        }
      });

      // Animate detection points - MORE COMPLEX
      scanner.detectionPoints.forEach((point, index) => {
        const newAngle = point.userData.angle + Date.now() * 0.0008;
        const isInner = point.userData.isInner;
        const radius = isInner ? 2 + Math.sin(time * 1.8 + index) * 0.5 : 3.5 + Math.sin(time * 1.5 + index) * 0.6;

        point.position.x = Math.cos(newAngle) * radius;
        point.position.y = Math.sin(newAngle * (isInner ? 0.6 : 0.7)) * (isInner ? 0.8 : 1.5);
        point.position.z = Math.sin(newAngle * (isInner ? 0.4 : 0.5)) * (isInner ? 1.5 : 2.5);

        // Pulse size - BIGGER PULSE
        const scale = 1 + Math.sin(time * 3.5 + index) * 0.6;
        point.scale.set(scale, scale, scale);

        // Rotate point
        point.rotation.x += 0.02;
        point.rotation.y += 0.03;
      });

      // Change colors based on prediction - SMOOTH TRANSITIONS
      if (predictionResult === "No Malaria") {
        scanner.orb.material.color.lerp(new THREE.Color(0x059669), 0.08);
        scanner.orb.material.emissive.lerp(new THREE.Color(0x10b981), 0.08);
        scanner.innerSphere.material.color.lerp(new THREE.Color(0x10b981), 0.08);
        scanner.detectionPoints.forEach((point, idx) => {
          if (!point.userData.isInner) {
            point.material.color.lerp(new THREE.Color(0x10b981), 0.08);
            point.material.emissive.lerp(new THREE.Color(0x10b981), 0.08);
          }
        });
      } else if (predictionResult === "Malaria Detected") {
        scanner.orb.material.color.lerp(new THREE.Color(0x991b1b), 0.08);
        scanner.orb.material.emissive.lerp(new THREE.Color(0xdc2626), 0.08);
        scanner.innerSphere.material.color.lerp(new THREE.Color(0xdc2626), 0.08);
        scanner.detectionPoints.forEach((point, idx) => {
          if (!point.userData.isInner) {
            point.material.color.lerp(new THREE.Color(0xdc2626), 0.08);
            point.material.emissive.lerp(new THREE.Color(0xdc2626), 0.08);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [predictionResult]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
};

export default Avatar3D;
