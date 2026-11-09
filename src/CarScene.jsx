import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { gsap } from "gsap";

const wheelPositions = [
  [-1.22, 0.38, 0.58],
  [1.22, 0.38, 0.58],
  [-1.22, 0.38, -0.58],
  [1.22, 0.38, -0.58],
];

function CarModel() {
  const carRef = useRef(null);
  const wheelsRef = useRef([]);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const car = carRef.current;
    const aimCamera = () => camera.lookAt(0, 0.72, 0);
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(car.position, { x: 0 });
        gsap.set(car.rotation, { y: -0.08 });
        gsap.set(camera.position, { x: 4, y: 2.8, z: 8.5 });
        aimCamera();
        return;
      }

      gsap.set(car.position, { x: -2.4 });
      gsap.set(car.rotation, { y: -0.55 });
      gsap.set(car.scale, { x: 0.82, y: 0.82, z: 0.82 });
      gsap.set(camera.position, { x: 0, y: 3.2, z: 14 });

      const cameraDrift = gsap.to(camera.position, {
        x: 4.35,
        z: 7.8,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
        onUpdate: aimCamera,
      });

      gsap.timeline({
        onUpdate: aimCamera,
        onComplete: () => cameraDrift.play(),
      })
        .to(car.position, { x: 0, duration: 1.65, ease: "power3.out" }, 0)
        .to(car.rotation, { y: -0.08, duration: 1.9, ease: "power2.out" }, 0)
        .to(car.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.3)" }, 0)
        .to(camera.position, { x: 4, y: 2.8, z: 8.5, duration: 2.1, ease: "power3.inOut" }, 0)
        .to(wheelsRef.current.map((wheel) => wheel.rotation), {
          z: Math.PI * 2,
          duration: 1.4,
          ease: "power2.out",
        }, 0);
    });

    return () => context.revert();
  }, [camera]);

  return (
    <group ref={carRef} position={[-2.4, 0, 0]} scale={0.82}>
      <RoundedBox args={[3.5, 0.55, 1.45]} radius={0.18} smoothness={5} position={[0, 0.68, 0]} castShadow>
        <meshStandardMaterial color="#b30f1d" metalness={0.72} roughness={0.22} />
      </RoundedBox>
      <RoundedBox args={[1.85, 0.73, 1.24]} radius={0.2} smoothness={5} position={[0, 1.12, -0.16]} castShadow>
        <meshStandardMaterial color="#12171d" metalness={0.6} roughness={0.18} />
      </RoundedBox>
      <mesh position={[0, 1.14, 0.47]}>
        <boxGeometry args={[1.45, 0.42, 0.025]} />
        <meshStandardMaterial color="#334c5c" metalness={0.6} roughness={0.16} />
      </mesh>
      <mesh position={[0, 1.14, -0.79]}>
        <boxGeometry args={[1.45, 0.42, 0.025]} />
        <meshStandardMaterial color="#334c5c" metalness={0.6} roughness={0.16} />
      </mesh>
      <mesh position={[0.94, 1.13, -0.16]}>
        <boxGeometry args={[0.025, 0.42, 0.9]} />
        <meshStandardMaterial color="#334c5c" metalness={0.6} roughness={0.16} />
      </mesh>
      <mesh position={[-0.94, 1.13, -0.16]}>
        <boxGeometry args={[0.025, 0.42, 0.9]} />
        <meshStandardMaterial color="#263b49" metalness={0.6} roughness={0.16} />
      </mesh>
      {wheelPositions.map((position, index) => (
        <group
          key={position.join(",")}
          ref={(wheel) => { wheelsRef.current[index] = wheel; }}
          position={position}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.2, 24]} />
            <meshStandardMaterial color="#111214" metalness={0.12} roughness={0.78} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.215, 16]} />
            <meshStandardMaterial color="#c6c8cb" metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[1.76, 0.77, -0.46]}>
        <boxGeometry args={[0.025, 0.15, 0.38]} />
        <meshStandardMaterial color="#fff4cc" emissive="#ffc957" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[1.76, 0.77, 0.46]}>
        <boxGeometry args={[0.025, 0.15, 0.38]} />
        <meshStandardMaterial color="#fff4cc" emissive="#ffc957" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[-1.76, 0.76, -0.46]}>
        <boxGeometry args={[0.025, 0.13, 0.3]} />
        <meshStandardMaterial color="#ff3445" emissive="#ff172a" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.76, 0.76, 0.46]}>
        <boxGeometry args={[0.025, 0.13, 0.3]} />
        <meshStandardMaterial color="#ff3445" emissive="#ff172a" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[2.8, 0.04, 1.05]} />
        <meshStandardMaterial color="#d5d9df" metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function CarScene() {
  return (
    <div className="car-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 3.2, 14], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        fallback={<img className="car-scene__fallback" src="/Cars/commerce.jpeg" alt="" />}
        shadows
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 7, 5]} intensity={3} />
        <pointLight position={[-4, 2, 2]} color="#ff3445" intensity={20} />
        <CarModel />
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[5, 64]} />
          <meshStandardMaterial color="#171719" roughness={0.9} />
        </mesh>
      </Canvas>
    </div>
  );
}
