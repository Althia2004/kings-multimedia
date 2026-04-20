import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function CameraScene() {
    const { scene } = useGLTF('/3D/dlsr_camera_olympus_e-400.glb');
    const groupRef = useRef<THREE.Group>(null);
    const currentRot = useRef({ x: 0, y: 0.4 });
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        currentRot.current.x += (-mouse.current.y * 0.9 - currentRot.current.x) * 0.8;
        currentRot.current.y += (mouse.current.x * 0.9 + 0.4 - currentRot.current.y) * 0.2;

        groupRef.current.rotation.x = currentRot.current.x;
        groupRef.current.rotation.y = currentRot.current.y;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.75) * 0.12;
    });
    return (
        <group ref={groupRef}>
            <primitive object={scene} scale={8.2} />
        </group>
    );
}

function LoadingPlaceholder() {
    return (
        <mesh>
            <boxGeometry args={[4.8, 3.2, 2]} />
            <meshStandardMaterial color="#1a1a1a" wireframe />
        </mesh>
    );
}

export default function CameraModel() {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 40 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
        >
            {/* Ambient base */}
            <ambientLight intensity={0.35} />
            {/* Key light — warm top-right */}
            <pointLight position={[4, 6, 4]} intensity={2} color="#ffffff" />
            {/* Rim light — cool blue from top-left */}
            <pointLight position={[-5, 3, -1]} intensity={1.2} color="#ffffff" />
            {/* Fill light — subtle gold from below */}
            <pointLight position={[0, -4, 2]} intensity={0.4} color="#ffffff" />

            <Suspense fallback={<LoadingPlaceholder />}>
                <CameraScene />
            </Suspense>
        </Canvas>
    );
}

useGLTF.preload('/3D/dlsr_camera_olympus_e-400.glb');
