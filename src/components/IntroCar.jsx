import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "./IntroCar.css";

const T_ORBIT = 6.2; // مدة تجميع العربية + لفّة الكاميرا
const T_DOLLY = 1.8; // مدة التقريب على الكاوتش
const T_BURN = 1.3; // مدة هزّ الكاوتش والدخان قبل الانطلاق
const FOV = 38;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const easeInOut = (k) =>
  k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const rand = (a, b) => a + Math.random() * (b - a);

export default function IntroCar() {
  const [show, setShow] = useState(() => {
    try {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // يظهر مرة واحدة في الجلسة. للتجربة: امسح الشرط اللي بعد && 
      return !reduce && !sessionStorage.getItem("intro-car-seen");
    } catch {
      return true;
    }
  });

  if (!show) return null;

  const done = () => {
    try {
      sessionStorage.setItem("intro-car-seen", "1");
    } catch {}
    setShow(false);
  };

  return <Scene onDone={done} />;
}

/* ---------- شكل جانب الهيكل (العربية بتبص ناحية +X) ---------- */
function bodyShape() {
  const s = new THREE.Shape();
  const arch = (cx) => {
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const a = Math.PI * (1 - i / 16);
      pts.push([cx + 0.44 * Math.cos(a), 0.37 + 0.44 * Math.sin(a)]);
    }
    return pts;
  };
  s.moveTo(-2.1, 0.3);
  s.lineTo(-1.74, 0.3);
  arch(-1.3).forEach(([x, y]) => s.lineTo(x, y));
  s.lineTo(-0.86, 0.3);
  s.lineTo(0.91, 0.3);
  arch(1.35).forEach(([x, y]) => s.lineTo(x, y));
  s.lineTo(1.79, 0.3);
  s.lineTo(2.1, 0.3);
  [
    [2.15, 0.55],
    [1.7, 0.8],
    [0.7, 0.92],
    [0.1, 1.28],
    [-0.9, 1.3],
    [-1.6, 0.95],
    [-2.1, 0.9],
    [-2.15, 0.6],
  ].forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  return s;
}

function Scene({ onDone }) {
  const mountRef = useRef(null);
  const btnRef = useRef(null);
  const api = useRef({});
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      onDone(); // المتصفح مش بيدعم WebGL: نتخطى الانيميشن
      return;
    }
    document.body.style.overflow = "hidden";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);
    scene.fog = new THREE.Fog(0x050507, 12, 34);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.5;
    pmrem.dispose();

    /* ---------- إضاءة ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 7, 5);
    const rim = new THREE.DirectionalLight(0xff2a3a, 2.4);
    rim.position.set(-6, 3, -4);
    const fill = new THREE.DirectionalLight(0x9fb4ff, 0.6);
    fill.position.set(-4, 2, 6);
    scene.add(key, rim, fill);

    /* ---------- الأرضية ---------- */
    const floorGeo = new THREE.CircleGeometry(60, 64);
    floorGeo.rotateX(-Math.PI / 2);
    scene.add(
      new THREE.Mesh(
        floorGeo,
        new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.35, metalness: 0.6 })
      )
    );
    const ringGeo = new THREE.RingGeometry(4.3, 4.36, 96);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xe11d2e }));
    ring.position.y = 0.005;
    scene.add(ring);

    /* ---------- خامات ---------- */
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xf2f2f4, metalness: 0.35, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08,
    });
    const dark = new THREE.MeshStandardMaterial({ color: 0x0c0c0f, metalness: 0.6, roughness: 0.5 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x05070c, metalness: 0.9, roughness: 0.08 });
    const lamp = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcfe4ff, emissiveIntensity: 3 });
    const tail = new THREE.MeshStandardMaterial({ color: 0x330003, emissive: 0xff1020, emissiveIntensity: 3 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xc4c7ce, metalness: 1, roughness: 0.28 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
    const red = new THREE.MeshStandardMaterial({ color: 0xe11d2e, emissive: 0x660008, roughness: 0.4 });

    const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      return m;
    };
    const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
    const group = (...items) => {
      const g = new THREE.Group();
      g.add(...items);
      return g;
    };

    /* ---------- العربية وقطعها ---------- */
    const car = new THREE.Group();
    scene.add(car);
    const parts = [];
    const wheels = [];

    // from: مكان بداية القطعة بالنسبة لمكانها النهائي، t: وقت دخولها، d: مدتها
    const part = (obj, from, t, d = 0.9, spin = 0) => {
      obj.userData.final = obj.position.clone();
      obj.visible = false;
      car.add(obj);
      parts.push({ obj, from: new THREE.Vector3(...from), t, d, spin });
    };

    const makeWheel = (side) => {
      const holder = new THREE.Group();
      const spin = new THREE.Group();
      holder.add(spin);
      const cyl = (r, h, seg = 36) => {
        const g = new THREE.CylinderGeometry(r, r, h, seg);
        g.rotateX(Math.PI / 2);
        return g;
      };
      const tire = mesh(new THREE.TorusGeometry(0.3, 0.07, 16, 48), tireMat);
      tire.scale.z = 1.8;
      spin.add(tire);
      spin.add(mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.26, 40, 1, true).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xc4c7ce, metalness: 1, roughness: 0.28, side: THREE.DoubleSide })));
      spin.add(mesh(cyl(0.2, 0.03), new THREE.MeshStandardMaterial({ color: 0x70747c, metalness: 0.9, roughness: 0.4 })));
      for (let i = 0; i < 3; i++) {
        const sp = mesh(box(0.5, 0.07, 0.29), silver);
        sp.rotation.z = (i * Math.PI) / 3;
        spin.add(sp);
      }
      spin.add(mesh(cyl(0.075, 0.31, 24), red));
      holder.add(mesh(box(0.2, 0.13, 0.05), red, -0.13, 0.1, side * 0.085)); // الكاليبر الأحمر
      return { holder, spin };
    };

    part(
      group(
        mesh(box(4, 0.14, 1.55), dark, 0, 0.34, 0),
        mesh(box(0.95, 0.5, 1.35), dark, 1.35, 0.5, 0),
        mesh(box(0.95, 0.5, 1.35), dark, -1.3, 0.5, 0)
      ),
      [0, -1.7, 0], 0.2, 1.1
    );

    [[-1.3, -1, 0.9, false], [-1.3, 1, 1.1, false], [1.35, -1, 1.4, true], [1.35, 1, 1.6, true]].forEach(
      ([x, side, t, front]) => {
        const w = makeWheel(side);
        w.holder.position.set(x, 0.37, side * 0.78);
        part(w.holder, [0, 0.6, side * 4], t, 0.9, 6);
        wheels.push({ ...w, side, front });
      }
    );

    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape(), {
      depth: 1.6, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05, bevelSegments: 4, curveSegments: 12,
    });
    bodyGeo.translate(0, 0, -0.8);
    part(group(mesh(bodyGeo, bodyMat)), [0, 5, 0], 2.0, 1.3, 0.5);

    const sideShape = new THREE.Shape();
    [[0.55, 0.97], [0.17, 1.22], [-0.88, 1.23], [-1.38, 0.97]].forEach(([x, y], i) =>
      i ? sideShape.lineTo(x, y) : sideShape.moveTo(x, y)
    );
    const sideGeo = new THREE.ExtrudeGeometry(sideShape, { depth: 1.82, bevelEnabled: false });
    sideGeo.translate(0, 0, -0.91);
    part(group(mesh(sideGeo, glass)), [0, 3, 0], 3.1);

    const ws = mesh(box(0.03, 0.68, 1.5), glass, 0.408, 1.113, 0);
    ws.rotation.z = 1.03;
    part(group(ws), [2, 2.5, 0], 3.4);
    const rg = mesh(box(0.03, 0.75, 1.45), glass, -1.257, 1.138, 0);
    rg.rotation.z = -1.107;
    part(group(rg), [-2, 2.5, 0], 3.55);

    const headlamp = (z) => {
      const m = mesh(box(0.03, 0.2, 0.4), lamp, 1.94, 0.69, z);
      m.rotation.z = 1.064;
      return m;
    };
    part(group(headlamp(0.58), headlamp(-0.58)), [3, 0, 0], 4.0, 0.7);
    part(group(mesh(box(0.04, 0.08, 1.35), tail, -2.14, 0.76, 0)), [-3, 0, 0], 4.2, 0.7);
    part(
      group(
        mesh(box(0.42, 0.04, 1.6), dark, -2.0, 1.08, 0),
        mesh(box(0.06, 0.14, 0.06), dark, -1.95, 0.99, 0.5),
        mesh(box(0.06, 0.14, 0.06), dark, -1.95, 0.99, -0.5)
      ),
      [-2.5, 3, 0], 4.4
    );
    part(group(mesh(box(0.4, 0.04, 1.7), dark, 2.12, 0.27, 0)), [3, 0, 0], 4.6, 0.8);
    part(
      group(mesh(box(0.14, 0.09, 0.12), bodyMat, 0.55, 1.0, 0.94), mesh(box(0.14, 0.09, 0.12), bodyMat, 0.55, 1.0, -0.94)),
      [0, 2, 0], 4.8, 0.8
    );

    /* ---------- الدخان ---------- */
    const smokeTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d");
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,0.9)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();
    const puffs = Array.from({ length: 90 }, () => {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, opacity: 0, color: 0xd5d8de })
      );
      s.visible = false;
      scene.add(s);
      return { s, on: false, life: 0, max: 1, vx: 0, vy: 0, vz: 0, s0: 0.4, s1: 2 };
    });
    let puffIdx = 0;
    const spawn = (x, y, z, side) => {
      const p = puffs[puffIdx++ % puffs.length];
      p.on = true;
      p.life = 0;
      p.max = rand(1.3, 2.3);
      p.s.position.set(x, y, z);
      p.vx = rand(-1.6, -0.4);
      p.vy = rand(0.25, 0.65);
      p.vz = side * rand(0.1, 0.6);
      p.s0 = rand(0.35, 0.65);
      p.s1 = rand(1.4, 2.6);
      p.s.visible = true;
    };

    /* ---------- حجم الشاشة ---------- */
    let W = 1, H = 1, m = 1;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      m = Math.min(2.2, Math.max(1, 1.25 / camera.aspect)); // على الموبايل الكاميرا تبعد شوية
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- التحكم ---------- */
    let phase = "build"; // build → ready → burn → drive
    let time = 0, pt = 0, acc = 0, wheelSpeed = 0;
    let raf = 0, timer = 0, fadeSet = false, outSet = false;

    const finish = () => {
      if (outSet) return;
      outSet = true;
      setOut(true);
      timer = setTimeout(onDone, 950);
    };
    api.current.start = () => {
      if (phase === "ready") {
        phase = "burn";
        pt = 0;
        setReady(false);
      }
    };
    api.current.skip = finish;

    const CENTER = new THREE.Vector3(0, 0.7, 0);
    const WHEEL_CAM = new THREE.Vector3(1.85, 0.5, 2.45);
    const WHEEL_AT = new THREE.Vector3(1.35, 0.4, 0.95);
    const wideCam = new THREE.Vector3();
    const wideAt = new THREE.Vector3(6, 0.6, 0);
    const look = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    const frontRight = wheels.find((w) => w.front && w.side === 1);
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      time += dt;
      pt += dt;

      /* تجميع القطع */
      if (phase === "build") {
        for (const p of parts) {
          p.obj.visible = time >= p.t;
          const e = easeOut(clamp01((time - p.t) / p.d));
          p.obj.position.copy(p.obj.userData.final).addScaledVector(p.from, 1 - e);
          p.obj.rotation.y = p.spin * (1 - e);
          p.obj.scale.setScalar(0.7 + 0.3 * e);
        }
        if (time >= T_ORBIT + T_DOLLY) {
          phase = "ready";
          setReady(true);
        }
      }

      /* الحركة والدخان */
      let rate = 0;
      if (phase === "burn") {
        const b = pt / T_BURN;
        wheelSpeed = 45 * easeOut(clamp01(b));
        car.position.set(rand(-0.01, 0.01), rand(0, 0.012), 0);
        wheels.forEach((w) => (w.holder.position.y = 0.37 + rand(-0.015, 0.015)));
        rate = 110;
        if (pt >= T_BURN) {
          phase = "drive";
          pt = 0;
          wheels.forEach((w) => (w.holder.position.y = 0.37));
        }
      } else if (phase === "drive") {
        wheelSpeed = 45 + (9 * pt) / 0.37;
        car.position.set(0.5 * 9 * pt * pt, 0, 0);
        car.rotation.z = 0.035 * clamp01(pt * 1.5);
        rate = pt < 1.6 ? 70 : 0;
        if (pt > 1.8 && !fadeSet) {
          fadeSet = true;
          setFade(true);
        }
        if (pt > 2.6) finish();
      }
      wheels.forEach((w) => (w.spin.rotation.z -= wheelSpeed * dt));

      acc += rate * dt;
      while (acc >= 1) {
        acc -= 1;
        const w = wheels[(Math.random() * 4) | 0];
        w.holder.getWorldPosition(tmp);
        spawn(tmp.x - 0.05, 0.1, tmp.z + w.side * 0.12, w.side);
      }
      for (const p of puffs) {
        if (!p.on) continue;
        p.life += dt;
        const k = p.life / p.max;
        if (k >= 1) {
          p.on = false;
          p.s.visible = false;
          continue;
        }
        p.s.position.x += p.vx * dt;
        p.s.position.y += p.vy * dt;
        p.s.position.z += p.vz * dt;
        const sc = p.s0 + (p.s1 - p.s0) * k;
        p.s.scale.set(sc, sc, 1);
        p.s.material.opacity = 0.5 * (1 - k) * Math.min(1, k * 10);
      }

      /* الكاميرا */
      if (phase === "build") {
        if (time < T_ORBIT) {
          const e = easeInOut(time / T_ORBIT);
          const th = -7.2 * (1 - e);
          const R = (9 - 2.8 * e) * m;
          camera.position.set(Math.sin(th) * R, 3.4 - 2.1 * e, Math.cos(th) * R);
          look.copy(CENTER);
        } else {
          const k = easeInOut(clamp01((time - T_ORBIT) / T_DOLLY));
          camera.position.set(0, 1.3, 6.2 * m).lerp(WHEEL_CAM, k);
          look.copy(CENTER).lerp(WHEEL_AT, k);
        }
      } else if (phase === "drive") {
        wideCam.set(3.5, 1.1, 8.5 * m);
        const k = easeInOut(clamp01(pt / 1.6));
        camera.position.copy(WHEEL_CAM).lerp(wideCam, k);
        look.copy(WHEEL_AT).lerp(wideAt, k);
      } else {
        camera.position.copy(WHEEL_CAM);
        camera.position.x += Math.sin(time * 0.8) * 0.02;
        camera.position.y += Math.cos(time * 0.6) * 0.012;
        look.copy(WHEEL_AT);
      }
      camera.lookAt(look);
      renderer.render(scene, camera);

      /* مكان زر START فوق مركز العجلة */
      const btn = btnRef.current;
      if (btn && phase === "ready" && frontRight) {
        tmp.setFromMatrixPosition(frontRight.holder.matrixWorld);
        tmp.z += 0.16;
        const dist = camera.position.distanceTo(tmp);
        tmp.project(camera);
        const px = (tmp.x * 0.5 + 0.5) * W;
        const py = (-tmp.y * 0.5 + 0.5) * H;
        const size = Math.max(56, (0.17 * (H / 2)) / (dist * Math.tan((FOV * Math.PI) / 360)));
        btn.style.width = btn.style.height = size + "px";
        btn.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = "";
      smokeTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`introcar${fade ? " is-fade" : ""}${out ? " is-out" : ""}`}>
      <div ref={mountRef} className="introcar__canvas" />
      <button
        ref={btnRef}
        className={`introcar__start${ready ? " is-ready" : ""}`}
        onClick={() => api.current.start?.()}
      >
        START
      </button>
      <button className="introcar__skip" onClick={() => api.current.skip?.()}>
        تخطي
      </button>
    </div>
  );
}
