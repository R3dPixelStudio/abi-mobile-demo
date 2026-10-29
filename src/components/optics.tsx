"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Group } from "three";
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Forms() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current)
      group.current.rotation.z += Math.min(delta, 0.05) * 0.025;
  });
  return (
    <group ref={group} rotation={[0.3, 0.35, 0.2]}>
      <RoundedBox args={[3.1, 3.6, 0.12]} radius={0.35} smoothness={4}>
        <meshPhysicalMaterial
          color="#a1d4ff"
          transparent
          opacity={0.18}
          roughness={0.22}
          metalness={0.15}
          depthWrite={false}
        />
      </RoundedBox>
      <RoundedBox
        args={[3.4, 3.9, 0.05]}
        radius={0.4}
        smoothness={4}
        position={[0, 0, -0.3]}
      >
        <meshBasicMaterial
          color="#89bcea"
          wireframe
          transparent
          opacity={0.12}
        />
      </RoundedBox>
    </group>
  );
}
function ContextEvents({ onLost }: { onLost: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, onLost]);
  return null;
}
export default function Optics() {
  const [active, setActive] = useState(true);
  const [lost, setLost] = useState(false);
  const onLost = useCallback(() => setLost(true), []);
  useEffect(() => {
    const update = () => setActive(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  if (lost) return null;
  return (
    <div className="optics" aria-hidden="true">
      <Boundary>
        <Canvas
          dpr={[1, 1.25]}
          frameloop={active ? "always" : "never"}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          camera={{ position: [0, 0, 6], fov: 45 }}
        >
          <ContextEvents onLost={onLost} />
          <ambientLight intensity={2} />
          <directionalLight position={[2, 3, 5]} intensity={2} />
          <Forms />
        </Canvas>
      </Boundary>
    </div>
  );
}
