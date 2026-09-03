import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { Suspense, useMemo } from 'react';

function TempleBase() {
  return (
    <group position={[0, 0, 0]}>
      {/* Central platform */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4.5, 0.4, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Inner ring */}
      <mesh position={[0, -0.25, 0]}>
        <torusGeometry args={[2.8, 0.08, 16, 64]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.35} />
      </mesh>

      {/* Security Core */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 1.2, 0]}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Pillars around */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 3.2;
        const z = Math.sin(angle) * 3.2;
        return (
          <mesh key={i} position={[x, 0.6, z]}>
            <boxGeometry args={[0.25, 2.2, 0.25]} />
            <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
          </mesh>
        );
      })}

      {/* Chamber markers (glowing orbs) */}
      {[
        { label: 'AUTH', angle: 0, color: '#d4af37' },
        { label: 'API', angle: 1, color: '#22d3ee' },
        { label: 'DB', angle: 2, color: '#34d399' },
        { label: 'ACCESS', angle: 3, color: '#f0c75e' },
        { label: 'JWT', angle: 4, color: '#a78bfa' },
        { label: 'CORE', angle: 5, color: '#fb7185' },
      ].map((chamber, i) => {
        const angle = (chamber.angle / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 5.5;
        const z = Math.sin(angle) * 5.5;
        return (
          <Float key={i} speed={1 + i * 0.1} floatIntensity={0.3}>
            <mesh position={[x, 0.4, z]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial
                color={chamber.color}
                emissive={chamber.color}
                emissiveIntensity={0.6}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#d4af37" />
      <pointLight position={[0, 3, 0]} intensity={1.2} color="#22d3ee" distance={12} />
    </>
  );
}

export default function SecurityTempleScene() {
  const cameraPos = useMemo(() => [0, 4, 10] as [number, number, number], []);

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-slate-700/50">
      <Canvas camera={{ position: cameraPos, fov: 50 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#05070f']} />
        <fog attach="fog" args={['#05070f', 8, 28]} />
        <Suspense fallback={null}>
          <SceneLights />
          <Stars radius={40} depth={30} count={1200} factor={3} saturation={0} fade speed={0.5} />
          <TempleBase />
          <OrbitControls
            enablePan={false}
            minDistance={6}
            maxDistance={16}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
