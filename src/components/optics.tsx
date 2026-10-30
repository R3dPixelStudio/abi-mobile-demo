"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ShaderMaterial } from "three";
export class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-unavailable">
        نمای سه‌بعدی در این مرورگر در دسترس نیست.
      </div>
    ) : (
      this.props.children
    );
  }
}
export function useSceneActivity() {
  const [state, setState] = useState({ visible: true, reduced: false });
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setState({ visible: !document.hidden, reduced: media.matches });
    update();
    document.addEventListener("visibilitychange", update);
    media.addEventListener("change", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      media.removeEventListener("change", update);
    };
  }, []);
  return state;
}
function Rings({ tone, reduced }: { tone: number; reduced: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const { viewport, invalidate } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAspect: { value: 1 }, uTone: { value: 0 } }),
    [],
  );
  useEffect(() => {
    if (material.current) {
      material.current.uniforms.uAspect.value =
        viewport.width / viewport.height;
    }
    invalidate();
  }, [viewport, uniforms, invalidate]);
  useEffect(() => {
    invalidate();
  }, [tone, invalidate]);
  useFrame((_, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    const blend = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 1.8);
    u.uTone.value += (tone - u.uTone.value) * blend;
    if (!reduced) u.uTime.value += Math.min(delta, 0.04) * 0.65;
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        depthWrite={false}
        vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`varying vec2 vUv;uniform float uTime,uAspect,uTone;
  void main(){
    float t=uTime;float mood=uTone*.5;
    vec2 center=vec2(.28+.035*mood+.025*sin(t*.7),.53-.06*mood+.045*cos(t*.6));
    vec2 p=vUv-center;p.x*=uAspect;float r=length(p),a=atan(p.y,p.x);
    float wave=sin(a*3.+t)*(.025+.025*mood)+sin(a*5.-t*.7)*.012;
    float ink=exp(-pow(length(p-vec2(.12*sin(t*.4+mood),.13*cos(t*.3))),2.)*3.);
    float rings=pow(.5+.5*cos((r+wave)*36.-t*1.8),26.);
    float halo=exp(-r*r*1.3);float sweep=pow(.5+.5*sin(a-t),4.);
    vec3 base=mix(vec3(.956,.979,1.),vec3(.65,.84,.99),halo*.56);
    vec3 blue=vec3(.055,.39,.84);float pulse=.65+.35*sin(r*10.-t*2.);
    base=mix(base,blue,rings*(.16+.24*sweep)*(1.-smoothstep(.1,1.9,r)));
    base=mix(base,mix(vec3(.25,.65,1.),vec3(.09,.38,.88),mood),sweep*halo*.10*pulse+ink*mood*.10);
    float spark=exp(-pow(r-(.42+.08*sin(t)),2.)*1800.)*pow(.5+.5*cos(a-t*1.2),24.);
    base+=vec3(.15,.25,.35)*spark;gl_FragColor=vec4(base,1.);
  }`}
      />
    </mesh>
  );
}
export default function Optics({
  tone = 0,
  active = true,
}: {
  tone?: number;
  active?: boolean;
}) {
  const { visible, reduced } = useSceneActivity();
  return (
    <div className="hero-shader" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          dpr={[1, 1.25]}
          frameloop={
            !visible || !active ? "never" : reduced ? "demand" : "always"
          }
          gl={{ antialias: false, powerPreference: "low-power" }}
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          <Rings tone={tone} reduced={reduced} />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
