"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Matrix4, Vector3, type Group, type Mesh } from "three";
import { SceneBoundary, useSceneActivity } from "./optics";
export type SceneMood = "explore" | "compare" | "budget";
function ModelLoading({ reduced }: { reduced: boolean }) {
  const ring = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ring.current && !reduced)
      ring.current.rotation.z += Math.min(delta, 0.04) * 0.8;
  });
  return (
    <group ref={ring}>
      <mesh>
        <torusGeometry args={[0.55, 0.014, 8, 64]} />
        <meshBasicMaterial color="#398fde" />
      </mesh>
      <mesh rotation={[0.5, 0.7, 0]}>
        <torusGeometry args={[0.72, 0.008, 6, 64]} />
        <meshBasicMaterial color="#83c5fa" />
      </mesh>
      <mesh position={[0.55, 0, 0]}>
        <sphereGeometry args={[0.045, 12, 8]} />
        <meshBasicMaterial color="#1268ce" />
      </mesh>
    </group>
  );
}
type Gesture = {
  yaw: number;
  pitch: number;
  pointer: number | null;
  x: number;
  y: number;
  startYaw: number;
  startPitch: number;
  dragged: boolean;
  last: number;
};
function MiniScreen() {
  const [signals, setSignals] = useState<number[]>([]);
  const complete = signals.length === 3;
  return (
    <div className="phone-site" dir="rtl">
      <div className="phone-status">
        <span>۹:۴۱</span>
        <span>● ▰</span>
      </div>
      <div className="phone-island" />
      <div
        className="phone-scroll"
        tabIndex={0}
        aria-label="ویترین کوچک آبی؛ با اسکرول یا کشیدن عمودی صفحه، کشف کنید"
      >
        <header>
          <span className="phone-logo">
            آبی<span>•</span>
          </span>
          <small>دنیای همراه تو</small>
        </header>
        <span className="phone-eyebrow">یک سیگنال از دنیای فردا</span>
        <h2>
          دنیای کوچک.
          <br />
          کشف‌های بزرگ.
        </h2>
        <div className={`signal-map ${complete ? "complete" : ""}`}>
          <svg viewBox="0 0 220 180" aria-hidden="true">
            <circle cx="110" cy="90" r="65" />
            <circle cx="110" cy="90" r="40" />
            <path
              d="M45 115 L110 35 L180 120 Z"
              className={complete ? "connected" : ""}
            />
          </svg>
          {["خلاقیت", "کشف", "ارتباط"].map((label, i) => (
            <button
              key={label}
              aria-label={`سیگنال ${label}`}
              aria-pressed={signals.includes(i)}
              className={`signal-node signal-${i} ${signals.includes(i) ? "found" : ""}`}
              onClick={() => setSignals((s) => (s.includes(i) ? s : [...s, i]))}
            >
              <span>{signals.includes(i) ? "✦" : "+"}</span>
            </button>
          ))}
          <strong className="signal-center">آ</strong>
        </div>
        <div className="signal-message" aria-live="polite">
          {complete
            ? "✦ اتصال برقرار شد. به دنیای آبی خوش آمدی!"
            : "سه سیگنال را لمس کن؛ دنیای آبی را روشن کن."}
        </div>
        <p>
          هر انتخاب، شروع یک مسیر تازه‌ است. پایین‌تر، همراه مسیرت را پیدا کن.
        </p>
        <div className="phone-note">
          <span>۰۱ / یک همراه برای هر ماجرا</span>
          <h3>بعدی کجاست؟</h3>
          <div className="mini-destinations" aria-label="سه مسیر دنیای آبی">
            <span>◈ خلاقیت، یک نگاه تازه</span>
            <span>✦ کشف، یک قدم جلوتر</span>
            <span>⌁ ارتباط، نزدیک‌تر از همیشه</span>
          </div>
        </div>
        <div className="phone-note">
          <span>۰۲ / جزئیات مهم‌اند</span>
          <h3>آماده حرکت.</h3>
          <p>
            از قاب هم‌اندازه گوشی تا گلس مناسب صفحه؛ همه‌چیز از انتخاب درست مدل
            شروع می‌شود.
          </p>
          <span className="mini-signoff">سیگنال تو، دنیای تو ✦</span>
        </div>
        <div className="phone-screen-end">اتصال تو به دنیای آبی ✦</div>
      </div>
      <div className="phone-home-indicator" />
    </div>
  );
}
function Device({
  mood,
  screen,
  dom,
  gesture,
  reduced,
}: {
  mood: SceneMood;
  screen: RefObject<HTMLDivElement | null>;
  dom: RefObject<HTMLDivElement | null>;
  gesture: RefObject<Gesture>;
  reduced: boolean;
}) {
  const { scene } = useGLTF("/models/iphone-18/scene.glb", false, false);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      const mesh = o as Mesh;
      if (
        mesh.isMesh &&
        (Array.isArray(mesh.material)
          ? mesh.material.some((m) => m.name.includes("Cherry_Screen"))
          : mesh.material.name.includes("Cherry_Screen"))
      )
        mesh.visible = false;
    });
    return clone;
  }, [scene]);
  const body = useRef<Group>(null),
    anchor = useRef<Group>(null);
  const clip = useRef(new Matrix4());
  const normal = useRef(new Vector3());
  const toCamera = useRef(new Vector3());
  const point = useRef(new Vector3());
  const local = useMemo(
    () =>
      new Matrix4().set(
        1.75272 / 274,
        0,
        0,
        -1.75272 / 2,
        0,
        -3.803688 / 610,
        0,
        3.803688 / 2,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ),
    [],
  );
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    Object.assign(gesture.current, {
      yaw: mood === "compare" ? -0.08 : mood === "budget" ? -0.65 : -0.22,
      pitch: 0.035,
    });
    invalidate();
  }, [mood, gesture, invalidate]);
  useFrame(({ camera, size, clock }, dt) => {
    if (!body.current || !anchor.current || !screen.current || !dom.current)
      return;
    const g = gesture.current;
    const blend = reduced ? 1 : Math.min(dt * 9, 1);
    body.current.rotation.y += (g.yaw - body.current.rotation.y) * blend;
    body.current.rotation.x += (g.pitch - body.current.rotation.x) * blend;
    body.current.position.y =
      reduced || g.pointer !== null
        ? 0
        : Math.sin(clock.elapsedTime * 0.9) * 0.045;
    const targetZ = mood === "compare" ? 0.28 : 0;
    body.current.position.z += (targetZ - body.current.position.z) * blend;
    body.current.scale.setScalar(1);
    body.current.updateWorldMatrix(true, true);
    camera.updateMatrixWorld();
    clip.current
      .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      .multiply(anchor.current.matrixWorld)
      .multiply(local);
    const m = clip.current.elements,
      w = size.width / 2,
      h = size.height / 2,
      d = m[15];
    if (d <= 0) return;
    const matrix = [
      ((m[0] + m[3]) * w) / d,
      ((-m[1] + m[3]) * h) / d,
      0,
      m[3] / d,
      ((m[4] + m[7]) * w) / d,
      ((-m[5] + m[7]) * h) / d,
      0,
      m[7] / d,
      0,
      0,
      1,
      0,
      ((m[12] + m[15]) * w) / d,
      ((-m[13] + m[15]) * h) / d,
      0,
      1,
    ];
    dom.current.style.setProperty(
      "transform",
      "matrix3d(" + matrix.join(",") + ")",
    );
    point.current.setFromMatrixPosition(anchor.current.matrixWorld);
    normal.current.set(0, 0, 1).transformDirection(anchor.current.matrixWorld);
    toCamera.current.copy(camera.position).sub(point.current);
    screen.current.style.setProperty(
      "visibility",
      normal.current.dot(toCamera.current) > 0.25 ? "visible" : "hidden",
    );
  });
  return (
    <group ref={body} rotation={[0.035, -0.22, -0.035]}>
      <group
        scale={24}
        position={[-0.000021 * 24, -0.08166 * 24, 0.002448 * 24]}
      >
        <primitive object={model} dispose={null} />
      </group>
      <group ref={anchor} position={[0, 0, 0.166]} />
    </group>
  );
}
export default function PhoneExperience({
  mood,
  active = true,
}: {
  mood: SceneMood;
  active?: boolean;
}) {
  const screen = useRef<HTMLDivElement>(null),
    dom = useRef<HTMLDivElement>(null),
    host = useRef<HTMLDivElement>(null);
  const invalidate = useRef<() => void>(() => {});
  const gesture = useRef<Gesture>({
    yaw: -0.22,
    pitch: 0.035,
    pointer: null,
    x: 0,
    y: 0,
    startYaw: 0,
    startPitch: 0,
    dragged: false,
    last: 0,
  });
  const { visible, reduced } = useSceneActivity();
  const loading = useProgress((state) => state.active);
  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !e.isPrimary) return;
    const g = gesture.current;
    g.dragged = false;
    if ((e.target as HTMLElement).closest("button,a,input,select")) return;
    const scroller = (e.target as HTMLElement).closest(".phone-scroll");
    if (scroller && e.pointerType === "mouse") {
      const r = scroller.getBoundingClientRect();
      if (
        Math.min(Math.abs(e.clientX - r.left), Math.abs(e.clientX - r.right)) <
        10
      )
        return;
    }
    g.pointer = e.pointerId;
    g.x = e.clientX;
    g.y = e.clientY;
    g.startYaw = g.yaw;
    g.startPitch = g.pitch;
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (g.pointer !== e.pointerId) return;
    const dx = e.clientX - g.x,
      dy = e.clientY - g.y;
    if (!g.dragged && Math.abs(dx) + Math.abs(dy) < 6) return;
    if (
      e.pointerType === "touch" &&
      !g.dragged &&
      Math.abs(dy) > Math.abs(dx)
    ) {
      g.pointer = null;
      return;
    }
    g.dragged = true;
    host.current?.setPointerCapture(e.pointerId);
    e.preventDefault();
    g.yaw = g.startYaw + dx * 0.012;
    g.pitch = Math.max(
      -0.38,
      Math.min(
        0.38,
        g.startPitch + (e.pointerType === "mouse" ? dy * 0.004 : 0),
      ),
    );
    g.last = performance.now();
    invalidate.current();
  };
  const up = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (gesture.current.pointer !== e.pointerId) return;
    gesture.current.pointer = null;
    if (host.current?.hasPointerCapture(e.pointerId))
      host.current.releasePointerCapture(e.pointerId);
  };
  return (
    <div
      className="phone-experience"
      data-motion={reduced ? "reduced" : "full"}
    >
      <div
        ref={host}
        className="phone-canvas direct-orbit"
        role="group"
        tabIndex={0}
        aria-label="آیفون سه‌بعدی؛ برای چرخش بکشید یا کلید جهت چپ و راست را بزنید. روی صفحه، عمودی اسکرول کنید."
        onPointerDownCapture={down}
        onPointerMoveCapture={move}
        onPointerUpCapture={up}
        onPointerCancel={up}
        onClickCapture={(e) => {
          if (gesture.current.dragged) {
            e.preventDefault();
            e.stopPropagation();
            gesture.current.dragged = false;
          }
        }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            gesture.current.yaw += e.key === "ArrowLeft" ? -0.3 : 0.3;
          }
          if (e.key === "Home") {
            gesture.current.yaw = -0.22;
            gesture.current.pitch = 0.035;
          }
          invalidate.current();
        }}
      >
        <SceneBoundary>
          <Canvas
            dpr={[1, 1.5]}
            onCreated={(state) => {
              invalidate.current = state.invalidate;
            }}
            frameloop={
              !visible || !active ? "never" : reduced ? "demand" : "always"
            }
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
            camera={{ position: [0, 0, 7.3], fov: 35 }}
          >
            <ambientLight intensity={1.6} />
            <directionalLight position={[3, 4, 5]} intensity={3} />
            <directionalLight
              position={[-4, 0, 2]}
              intensity={2}
              color="#70baff"
            />
            <Environment resolution={64}>
              <Lightformer
                position={[3, 2, 3]}
                scale={[2, 7, 1]}
                intensity={4}
              />
              <Lightformer
                position={[-3, 0, 3]}
                scale={[1, 6, 1]}
                intensity={4}
                color="#a8dcff"
              />
              <Lightformer
                position={[0, 4, -3]}
                scale={[5, 2, 1]}
                intensity={3}
              />
            </Environment>
            <Suspense fallback={<ModelLoading reduced={reduced} />}>
              <Device
                mood={mood}
                screen={screen}
                dom={dom}
                gesture={gesture}
                reduced={reduced}
              />
            </Suspense>
          </Canvas>
        </SceneBoundary>
        <div ref={screen} className="phone-dom-host" data-interactive="true">
          <div ref={dom} className="phone-dom-object">
            <MiniScreen />
          </div>
        </div>
      </div>
      <div className="phone-gesture-hint">
        <span>{loading ? "در حال آماده‌شدن دنیای کوچک آبی…" : "↔ بچرخان"}</span>
        <i />
        <span>{loading ? "" : "روی صفحه، بیشتر کشف کن ↓"}</span>
      </div>
      <span className="phone-model-name" dir="ltr">
        iPhone 18 Pro Max <small>· Abi blue edition</small>
      </span>
    </div>
  );
}
