import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "./IntroCar.css";

/* ================= إعدادات تقدر تغيرها ================= */
const MODEL_URL =
  "/models/2019_lamborghini_sc18_alston/2019_lamborghini_sc18_alston.glb";
const FLIP_DIRECTION = false; // لو العربية مشيت بضهرها خليها true
const CAR_LENGTH = 4.3; // طول العربية في المشهد
/* ======================================================== */

const T_ORBIT = 6.2; // مدة التجميع + لفّة الكاميرا
const T_DOLLY = 1.8; // مدة التقريب على الكاوتش
const T_BURN = 1.3; // مدة هزّ الكاوتش والدخان
const FOV = 38;

// أسماء بتدل على أجزاء الكاوتش في الموديل
const WHEEL_RE = /wheel|tire|tyre|rim|rotor|disc|hub|rueda|llanta|pneu|jante/i;
const NOT_WHEEL_RE = /caliper|pad|spoiler|display|screen|steer/i;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const easeInOut = (k) =>
  k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const rand = (a, b) => a + Math.random() * (b - a);

export default function IntroCarModel() {
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

function Scene({ onDone }) {
  const mountRef = useRef(null);
  const btnRef = useRef(null);
  const api = useRef({});
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const [out, setOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      onDone();
      return;
    }
    let disposed = false;
    document.body.style.overflow = "hidden";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);
    scene.fog = new THREE.Fog(0x050507, 12, 34);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 1.0; // قوة الانعكاسات على الهيكل
    pmrem.dispose();

    /* ---------- إضاءة ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 7, 5);
    const rim = new THREE.DirectionalLight(0xff2a3a, 2.2);
    rim.position.set(-6, 3, -4);
    const fill = new THREE.DirectionalLight(0x9fb4ff, 0.5);
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
    let W = 1, H = 1, mult = 1;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      mult = Math.min(2.2, Math.max(1, 1.25 / camera.aspect)); // على الموبايل الكاميرا تبعد شوية
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- العربية ---------- */
    const car = new THREE.Group();
    scene.add(car);
    const parts = []; // القطع اللي بتتجمع
    const wheels = []; // مجموعات الكاوتش اللي بتلف
    const spots = []; // أماكن الكاوتشات لخروج الدخان
    const CENTER = new THREE.Vector3(0, 0.7, 0);
    const WHEEL_AT = new THREE.Vector3();
    const WHEEL_CAM = new THREE.Vector3();
    const btnPos = new THREE.Vector3();
    let btnDiam = 0.17;
    let wheelR = 0.35;
    let carHeight = 1.2;

    const part = (obj, from, t, d) => {
      obj.userData.final = obj.position.clone();
      obj.visible = false;
      parts.push({ obj, from, t, d });
    };

    const build = (root) => {
      /* 1) ضبط الاتجاه والحجم والمكان */
      const wrap = new THREE.Group();
      wrap.add(root);
      car.add(wrap);
      const box = new THREE.Box3().setFromObject(wrap);
      const size0 = box.getSize(new THREE.Vector3());
      if (size0.z > size0.x) wrap.rotation.y = Math.PI / 2; // الطول يبقى على محور X
      if (FLIP_DIRECTION) wrap.rotation.y += Math.PI;
      wrap.scale.setScalar(CAR_LENGTH / Math.max(size0.x, size0.z));
      wrap.updateMatrixWorld(true);
      box.setFromObject(wrap);
      const c0 = box.getCenter(new THREE.Vector3());
      wrap.position.set(-c0.x, -box.min.y, -c0.z);
      wrap.updateMatrixWorld(true);
      box.setFromObject(wrap);
      const size = box.getSize(new THREE.Vector3());
      carHeight = size.y;
      const halfW = size.z / 2;
      CENTER.set(0, carHeight * 0.55, 0);

      /* 2) تجميع كل القطع (Meshes) */
      const meshes = [];
      wrap.traverse((o) => {
        if (o.isMesh) meshes.push(o);
      });
      const tb = new THREE.Box3();
      const ctr = (o) => tb.setFromObject(o).getCenter(new THREE.Vector3());
      const nameOf = (o) => {
        let s = "";
        for (let p = o; p && p !== wrap; p = p.parent) s += " " + (p.name || "");
        const mat = Array.isArray(o.material) ? o.material : [o.material];
        mat.forEach((x) => (s += " " + (x?.name || "")));
        return s;
      };

      /* 3) دور على الكاوتشات وقسّمها لـ 4 مجموعات */
      const clusters = { "1,1": [], "1,-1": [], "-1,1": [], "-1,-1": [] };
      meshes.forEach((o) => {
        const nm = nameOf(o);
        if (!WHEEL_RE.test(nm) || NOT_WHEEL_RE.test(nm)) return;
        const c = ctr(o);
        if (c.y > carHeight * 0.5 || Math.abs(c.z) < halfW * 0.4) return;
        clusters[`${c.x > 0 ? 1 : -1},${c.z > 0 ? 1 : -1}`].push(o);
      });

      const used = new Set();
      const groups = [];
      Object.entries(clusters).forEach(([key, list]) => {
        if (!list.length) return;
        const [sx, sz] = key.split(",").map(Number);
        const ub = new THREE.Box3();
        list.forEach((o) => ub.union(tb.setFromObject(o)));
        const hub = ub.getCenter(new THREE.Vector3());
        const sz3 = ub.getSize(new THREE.Vector3());
        const pivot = new THREE.Group();
        pivot.position.copy(hub);
        car.add(pivot);
        pivot.updateMatrixWorld(true);
        list.forEach((o) => {
          pivot.attach(o);
          used.add(o);
        });
        groups.push({
          pivot, sx, sz, hub,
          r: Math.min(0.6, Math.max(0.2, sz3.y / 2)),
          faceZ: sz > 0 ? ub.max.z : ub.min.z,
          fx: hub.x, fy: hub.y, fz: hub.z,
        });
      });

      console.info("[IntroCar] meshes:", meshes.length, "| wheels found:", groups.length);

      /* 4) باقي القطع: كل قطعة تيجي من برا العربية للمكان بتاعها (من تحت لفوق) */
      const carMid = new THREE.Vector3(0, carHeight / 2, 0);
      meshes.forEach((o) => {
        if (used.has(o)) return;
        const c = ctr(o);
        car.attach(o);
        const dir = c.clone().sub(carMid);
        if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0);
        dir.normalize().multiplyScalar(rand(2.2, 4.6));
        part(o, dir, 0.15 + clamp01(c.y / carHeight) * 3.6 + rand(0, 0.7), rand(0.8, 1.2));
      });
      car.remove(wrap);

      /* 5) الكاوتشات كقطع بتتجمع من الجنب */
      groups.forEach((g, i) => {
        part(g.pivot, new THREE.Vector3(0, 0.6, g.sz * 4), 1.0 + i * 0.3, 0.9);
        wheels.push(g);
        spots.push({ x: g.hub.x, y: 0.1, z: g.faceZ, side: g.sz });
      });

      /* 6) مكان الكاميرا والزر عند الكاوتش الأمامي القريب */
      const fr = groups.find((g) => g.sx > 0 && g.sz > 0);
      let R = 0.33;
      if (fr) {
        R = fr.r;
        WHEEL_AT.copy(fr.hub);
        btnPos.set(fr.hub.x, fr.hub.y, fr.faceZ + 0.02);
      } else {
        WHEEL_AT.set(0.3 * CAR_LENGTH, R, halfW * 0.85);
        btnPos.set(WHEEL_AT.x, WHEEL_AT.y, halfW * 0.92);
      }
      if (!spots.length) {
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) =>
          spots.push({ x: sx * 0.3 * CAR_LENGTH, y: 0.1, z: sz * halfW * 0.9, side: sz })
        );
      }
      wheelR = groups.length ? groups.reduce((a, g) => a + g.r, 0) / groups.length : R;
      btnDiam = 0.5 * R;
      WHEEL_CAM.set(WHEEL_AT.x + 1.35 * R, WHEEL_AT.y + 0.27 * R, WHEEL_AT.z + 4.05 * R);
    };

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

    const wideCam = new THREE.Vector3();
    const wideAt = new THREE.Vector3(6, 0.6, 0);
    const look = new THREE.Vector3();
    const tmp = new THREE.Vector3();
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
          if (!p.obj.visible) continue;
          const e = easeOut(clamp01((time - p.t) / p.d));
          p.obj.position.copy(p.obj.userData.final).addScaledVector(p.from, 1 - e);
        }
        if (time >= T_ORBIT + T_DOLLY) {
          phase = "ready";
          setReady(true);
        }
      }

      /* الحركة والدخان */
      let rate = 0;
      if (phase === "burn") {
        wheelSpeed = 45 * easeOut(clamp01(pt / T_BURN));
        car.position.set(rand(-0.01, 0.01), rand(0, 0.012), 0);
        wheels.forEach((w) =>
          w.pivot.position.set(w.fx + rand(-0.008, 0.008), w.fy + rand(-0.012, 0.012), w.fz)
        );
        rate = 110;
        if (pt >= T_BURN) {
          phase = "drive";
          pt = 0;
          wheels.forEach((w) => w.pivot.position.set(w.fx, w.fy, w.fz));
        }
      } else if (phase === "drive") {
        wheelSpeed = 45 + (9 * pt) / wheelR;
        car.position.set(0.5 * 9 * pt * pt, 0, 0);
        car.rotation.z = 0.035 * clamp01(pt * 1.5);
        rate = pt < 1.6 ? 70 : 0;
        if (pt > 1.8 && !fadeSet) {
          fadeSet = true;
          setFade(true);
        }
        if (pt > 2.6) finish();
      }
      wheels.forEach((w) => (w.pivot.rotation.z -= wheelSpeed * dt));

      acc += rate * dt;
      while (acc >= 1 && spots.length) {
        acc -= 1;
        const s = spots[(Math.random() * spots.length) | 0];
        spawn(car.position.x + s.x - 0.05, s.y, s.z + s.side * 0.12, s.side);
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
          const R = (9 - 2.8 * e) * mult;
          camera.position.set(Math.sin(th) * R, 3.4 - 2.1 * e, Math.cos(th) * R);
          look.copy(CENTER);
        } else {
          const k = easeInOut(clamp01((time - T_ORBIT) / T_DOLLY));
          camera.position.set(0, 1.3, 6.2 * mult).lerp(WHEEL_CAM, k);
          look.copy(CENTER).lerp(WHEEL_AT, k);
        }
      } else if (phase === "drive") {
        wideCam.set(3.5, 1.1, 8.5 * mult);
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

      /* مكان زر START فوق مركز الكاوتش */
      const btn = btnRef.current;
      if (btn && phase === "ready") {
        tmp.copy(btnPos);
        const dist = camera.position.distanceTo(tmp);
        tmp.project(camera);
        const px = (tmp.x * 0.5 + 0.5) * W;
        const py = (-tmp.y * 0.5 + 0.5) * H;
        const size = Math.max(56, (btnDiam * (H / 2)) / (dist * Math.tan((FOV * Math.PI) / 360)));
        btn.style.width = btn.style.height = size + "px";
        btn.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
      }
    };

    /* ---------- تحميل الموديل ---------- */
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        try {
          build(gltf.scene);
        } catch (err) {
          console.error("[IntroCar] build failed", err);
          onDone();
          return;
        }
        setLoading(false);
        clock.start();
        tick();
      },
      (e) => {
        if (!disposed && e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      },
      (err) => {
        console.error("[IntroCar] model failed to load: check MODEL_URL", err);
        if (!disposed) onDone();
      }
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = "";
      draco.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        mats.forEach((mat) => {
          Object.values(mat).forEach((v) => v && v.isTexture && v.dispose());
          mat.dispose();
        });
      });
      smokeTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`introcar${fade ? " is-fade" : ""}${out ? " is-out" : ""}`}>
      <div ref={mountRef} className="introcar__canvas" />
      {loading && (
        <div
          dir="rtl"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            pointerEvents: "none",
          }}
        >
          جارٍ تحميل العربية… {progress > 0 ? `${progress}%` : ""}
        </div>
      )}
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