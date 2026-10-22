import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Objects on this layer are drawn by the main camera but skipped by the rear-view mirror
export const MIRROR_SKIP_LAYER = 1;

export const WEATHER_PRESETS = {
  night: {
    key: 'night',
    label: 'Gece',
    icon: '🌙',
    skyColor: 0x0d1528,
    fogColor: 0x131e36,
    fogDensity: 0.0022,
    ambientIntensity: 1.25,
    ambientColor: 0x9bb4e8,
    hemiGroundColor: 0x2a364f,
    dirIntensity: 1.1,
    dirColor: 0xa5c4ff,
    roadRoughness: 0.42,
    roadMetalness: 0.2,
    streetlightsOn: true,
    rain: false,
  },
  rain: {
    key: 'rain',
    label: 'Yağmur',
    icon: '🌧️',
    skyColor: 0x0b1220,
    fogColor: 0x121c30,
    fogDensity: 0.0032,
    ambientIntensity: 1.05,
    ambientColor: 0x8aa4d6,
    hemiGroundColor: 0x222d42,
    dirIntensity: 0.9,
    dirColor: 0x8ab0ff,
    roadRoughness: 0.18, // Wet shiny asphalt
    roadMetalness: 0.48,
    streetlightsOn: true,
    rain: true,
  },
  sunset: {
    key: 'sunset',
    label: 'Gün Batımı',
    icon: '🌇',
    skyColor: 0x2c1630,
    fogColor: 0x662c40,
    fogDensity: 0.0025,
    ambientIntensity: 1.25,
    ambientColor: 0xffa07a,
    hemiGroundColor: 0x3d222e,
    dirIntensity: 1.65,
    dirColor: 0xff7744,
    roadRoughness: 0.36,
    roadMetalness: 0.25,
    streetlightsOn: true,
    rain: false,
  },
  day: {
    key: 'day',
    label: 'Gündüz',
    icon: '☀️',
    skyColor: 0x4a89dc,
    fogColor: 0x8bb8f0,
    fogDensity: 0.0018,
    ambientIntensity: 1.5,
    ambientColor: 0xffffff,
    hemiGroundColor: 0x475569,
    dirIntensity: 1.85,
    dirColor: 0xfff8e7,
    roadRoughness: 0.65,
    roadMetalness: 0.1,
    streetlightsOn: false,
    rain: false,
  },
};

// 4 Highway Lanes: X centers at -5.4, -1.8, +1.8, +5.4 (each lane is 3.6m wide; total carriageway = 14.4m + shoulders = 17.6m)
export const LANE_CENTERS = [-5.4, -1.8, 1.8, 5.4];
export const ROAD_HALF_WIDTH = 8.4;

// Road layouts. 'highway': the 4-lane motorway. 'twoway': a 1+1 two-way road (devlet yolu) on the
// middle two lane positions — lane 2 (x +1.8) is ours, lane 1 (x -1.8) carries oncoming traffic,
// with a narrow shoulder outside each lane.
export const ROAD_MODES = ['highway', 'twoway'];
export const ROAD_HALF_WIDTHS = { highway: ROAD_HALF_WIDTH, twoway: 4.6 };

export class HighwayWorld {
  constructor(scene) {
    this.scene = scene;
    this.weatherKey = 'night';
    this.roadMode = 'highway';
    this.roadHalfWidth = ROAD_HALF_WIDTH;

    this.roadTexture = null;
    this.roadMat = null;
    this.scrollOffset = 0;
    this.worldDistM = 0;
    this.curvableGeometries = [];

    this.sceneryItems = [];
    this.lampFixtures = [];
    this.rainSystem = null;

    // Player Headlights & High-beam (Selektör) SpotLights
    this.headlightGroup = new THREE.Group();
    this.scene.add(this.headlightGroup);

    this.buildLights();
    this.buildRoad();
    this.buildRoadsideScenery();
    this.buildRainParticles();
    this.applyWeather('night');
  }

  // Sparse Highway Curve Profile:
  // Every 1500m segment consists of:
  // - 1050m of 100% DEAD-STRAIGHT highway (zero curvature, zero slope change)
  // - 450m of a smooth C2-continuous sweeping turn (alternating right on even segments, left on odd segments)
  evalRoadProfile(s) {
    const segLen = 1500.0;
    const straightLen = 1050.0;
    const curveLen = 450.0; // segLen - straightLen
    const amp = 85.0; // lateral displacement across the 450m curve

    const segIdx = Math.floor(s / segLen);
    const u = s - segIdx * segLen; // 0 .. 1500
    const isEven = (segIdx & 1) === 0;
    const baseC = isEven ? 0.0 : amp;
    const dir = isEven ? 1.0 : -1.0;

    // On the 1050m straightaway: road is 100% straight!
    if (u <= straightLen) {
      return { c: baseC, d1: 0.0, d2: 0.0 };
    }

    // Inside the 450m smooth curve zone:
    const t = u - straightLen; // 0 .. curveLen
    const omega = (Math.PI * 2.0) / curveLen;
    const wt = omega * t;

    const c = baseC + dir * amp * (t / curveLen - Math.sin(wt) / (Math.PI * 2.0));
    const d1 = dir * (amp / curveLen) * (1.0 - Math.cos(wt));
    const d2 = dir * ((amp * omega) / curveLen) * Math.sin(wt);
    return { c, d1, d2 };
  }

  evalRoadCenterX(s) {
    return this.evalRoadProfile(s).c;
  }

  evalRoadDeriv1(s) {
    return this.evalRoadProfile(s).d1;
  }

  evalRoadDeriv2(s) {
    return this.evalRoadProfile(s).d2;
  }

  // Lateral X offset of the highway centerline at scene coordinate z (z=0 is player, z<0 is ahead)
  getCurveOffsetAtZ(z) {
    const s0 = this.worldDistM;
    const c0 = this.evalRoadCenterX(s0);
    const d0 = this.evalRoadDeriv1(s0);
    return this.evalRoadCenterX(s0 - z) - c0 + z * d0;
  }

  // Derivative d(DeltaX)/dz at scene coordinate z
  getCurveSlopeAtZ(z) {
    const s0 = this.worldDistM;
    const d0 = this.evalRoadDeriv1(s0);
    return -this.evalRoadDeriv1(s0 - z) + d0;
  }

  // Yaw rotation (rotation.y in radians) of the highway at scene coordinate z
  getCurveYawAtZ(z) {
    return Math.atan(this.getCurveSlopeAtZ(z));
  }

  // Instantaneous highway curvature kappa (1/m) right at the player's position (z = 0)
  // Positive kappa = road curves to the right (+X ahead); Negative kappa = road curves to the left (-X ahead)
  getCurrentCurvature() {
    return this.evalRoadDeriv2(this.worldDistM);
  }

  registerCurvableGeometry(geo) {
    const pos = geo.attributes.position;
    const baseX = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      baseX[i] = pos.getX(i);
    }
    const item = { geo, baseX, originalX: baseX.slice() };
    this.curvableGeometries.push(item);
    return item;
  }

  buildLights() {
    this.ambientLight = new THREE.AmbientLight(0x9bb4e8, 1.25);
    this.scene.add(this.ambientLight);

    // HemisphereLight ensures road surface, barriers & cars are well-lit from above and below
    this.hemiLight = new THREE.HemisphereLight(0xa5c4ff, 0x2a364f, 0.95);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xa5c4ff, 1.1);
    this.dirLight.position.set(-20, 55, -40);
    this.scene.add(this.dirLight);

    // Generate a realistic studio/highway reflection environment map for metallic car paint, chrome & piano black
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ectx = envCanvas.getContext('2d');
    const grad = ectx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, '#1e3a5f');
    grad.addColorStop(0.45, '#6488b8');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(0.55, '#1e293b');
    grad.addColorStop(1.0, '#0f172a');
    ectx.fillStyle = grad;
    ectx.fillRect(0, 0, 512, 256);

    // Add bright highway light streaks for specular highlights on car bodies and chrome
    ectx.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) {
      ectx.fillRect(30 + i * 60, 85, 28, 10);
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    this.scene.environment = envTex;
    this.scene.environmentIntensity = 0.85;

    // Player Low-Beam Headlight (Wider, brighter & longer throw for night highway visibility)
    this.lowBeamLight = new THREE.SpotLight(0xf4f9ff, 14.0, 165, Math.PI / 2.8, 0.35, 0.85);
    this.lowBeamLight.position.set(0, 0.9, -1.7);
    this.lowBeamTarget = new THREE.Object3D();
    this.lowBeamTarget.position.set(0, 0.0, -65);
    this.headlightGroup.add(this.lowBeamLight);
    this.headlightGroup.add(this.lowBeamTarget);
    this.lowBeamLight.target = this.lowBeamTarget;

    // Player High-Beam (Selektör) SpotLight
    this.highBeamLight = new THREE.SpotLight(0xd8ecff, 0, 230, Math.PI / 2.5, 0.22, 0.7);
    this.highBeamLight.position.set(0, 0.95, -1.7);
    this.highBeamTarget = new THREE.Object3D();
    this.highBeamTarget.position.set(0, 0.5, -140);
    this.headlightGroup.add(this.highBeamLight);
    this.headlightGroup.add(this.highBeamTarget);
    this.highBeamLight.target = this.highBeamTarget;
  }

  // Asphalt, edge lines and lane markings for the current layout, drawn across the whole road plane
  // (ROAD_HALF_WIDTH * 2 + 1.6 m wide for either layout: the plane is scaled, see setRoadLayout)
  drawRoadMarkings(ctx, mode) {
    // Clearer, brighter highway asphalt tone so road is clearly visible at night
    ctx.fillStyle = '#2d3442';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle asphalt grain noise & lighter tire wear tracks
    for (let i = 0; i < 16000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const v = 38 + Math.floor(Math.random() * 22);
      ctx.fillStyle = `rgb(${v},${v + 3},${v + 8})`;
      ctx.fillRect(x, y, 2, 3);
    }

    if (mode === 'twoway') {
      // Plane is 2 * 4.6 + 1.6 = 10.8 m wide: px per metre
      const half = ROAD_HALF_WIDTHS.twoway + 0.8;
      const px = (x) => ((x + half) / (half * 2)) * 1024;
      const pw = 1024 / (half * 2);
      // Gravel shoulder strips beyond the asphalt edge
      ctx.fillStyle = '#3b3a36';
      ctx.fillRect(0, 0, px(-ROAD_HALF_WIDTHS.twoway), 1024);
      ctx.fillRect(px(ROAD_HALF_WIDTHS.twoway), 0, 1024, 1024);
      // Solid white edge lines just outside both lanes
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(px(-3.75), 0, 0.15 * pw, 1024);
      ctx.fillRect(px(3.6), 0, 0.15 * pw, 1024);
      // Dashed white centre line: overtaking allowed
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px(-0.07), 60, 0.14 * pw, 330);
      ctx.fillRect(px(-0.07), 572, 0.14 * pw, 330);
      return;
    }

    // Left & Right Emergency Shoulder Solid Yellow/White Lines
    ctx.fillStyle = '#eab308';
    ctx.fillRect(58, 0, 14, 1024); // Left fast-lane edge yellow line
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(1024 - 72, 0, 14, 1024); // Right shoulder solid white line

    // Red/White Curb Rumble Strips at extreme edges
    for (let y = 0; y < 1024; y += 64) {
      ctx.fillStyle = (y / 64) % 2 === 0 ? '#dc2626' : '#f1f5f9';
      ctx.fillRect(12, y, 26, 64);
      ctx.fillRect(1024 - 38, y, 26, 64);
    }

    // 3 Dashed White Lane Dividers (separating the 4 highway lanes)
    ctx.fillStyle = '#f8fafc';
    const roadInnerStart = 72;
    const roadInnerWidth = 1024 - 144;
    for (let lane = 1; lane <= 3; lane++) {
      const lx = roadInnerStart + (roadInnerWidth / 4) * lane - 6;
      // Draw 2 dashes per texture tile
      ctx.fillRect(lx, 80, 12, 310);
      ctx.fillRect(lx, 590, 12, 310);
    }
  }

  createRoadCanvasTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    this.drawRoadMarkings(canvas.getContext('2d'), this.roadMode);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 22);
    texture.anisotropy = 8;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  buildRoad() {
    this.roadTexture = this.createRoadCanvasTexture();

    const roadLength = 440;
    const zSegments = 110;

    // Subdivided Highway Surface so it bends smoothly along 3D curves
    const roadGeo = new THREE.PlaneGeometry(ROAD_HALF_WIDTH * 2 + 1.6, roadLength, 1, zSegments);
    roadGeo.rotateX(-Math.PI / 2);
    roadGeo.translate(0, 0, -140);
    this.roadCurvable = this.registerCurvableGeometry(roadGeo);

    this.roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTexture,
      roughness: 0.38,
      metalness: 0.25,
    });

    const roadMesh = new THREE.Mesh(roadGeo, this.roadMat);
    this.scene.add(roadMesh);

    // Outer Ground Plane (Dark terrain alongside highway)
    const groundGeo = new THREE.PlaneGeometry(320, roadLength, 1, 40);
    groundGeo.rotateX(-Math.PI / 2);
    groundGeo.translate(0, -0.05, -140);
    this.registerCurvableGeometry(groundGeo);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.95,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.scene.add(groundMesh);

    // Concrete Jersey Barriers on Left & Right Highway Edges (Subdivided along Z to follow curves)
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x333b48,
      roughness: 0.75,
      metalness: 0.15,
    });

    const leftBarrierGeo = new THREE.BoxGeometry(0.65, 0.95, roadLength, 1, 1, zSegments);
    leftBarrierGeo.translate(-ROAD_HALF_WIDTH - 0.55, 0.47, -140);
    const leftBarrier = new THREE.Mesh(leftBarrierGeo, barrierMat);
    this.scene.add(leftBarrier);

    const rightBarrierGeo = new THREE.BoxGeometry(0.65, 0.95, roadLength, 1, 1, zSegments);
    rightBarrierGeo.translate(ROAD_HALF_WIDTH + 0.55, 0.47, -140);
    const rightBarrier = new THREE.Mesh(rightBarrierGeo, barrierMat);
    this.scene.add(rightBarrier);
    this.barriers = [
      { mesh: leftBarrier, side: -1, curvable: this.registerCurvableGeometry(leftBarrierGeo) },
      { mesh: rightBarrier, side: 1, curvable: this.registerCurvableGeometry(rightBarrierGeo) },
    ];
  }

  // Switches between the motorway and the two-way road: redraws the markings, narrows or widens the
  // road surface, moves the barriers and rebuilds the roadside (poles, reflectors; no overhead
  // gantries on the two-way road). Only runs when the layout actually changes.
  setRoadLayout(mode) {
    if (!ROAD_MODES.includes(mode) || mode === this.roadMode) return;
    this.roadMode = mode;
    this.roadHalfWidth = ROAD_HALF_WIDTHS[mode];

    this.drawRoadMarkings(this.roadTexture.image.getContext('2d'), mode);
    this.roadTexture.needsUpdate = true;

    const widthScale = (this.roadHalfWidth + 0.8) / (ROAD_HALF_WIDTH + 0.8);
    const road = this.roadCurvable;
    for (let i = 0; i < road.baseX.length; i++) road.baseX[i] = road.originalX[i] * widthScale;
    for (const b of this.barriers) {
      const shift = b.side * (this.roadHalfWidth - ROAD_HALF_WIDTH);
      for (let i = 0; i < b.curvable.baseX.length; i++) b.curvable.baseX[i] = b.curvable.originalX[i] + shift;
      b.mesh.scale.y = mode === 'twoway' ? 0.75 : 1; // a lower roadside barrier
    }

    // Rebuild the roadside segments where the current ones are
    const zs = this.sceneryItems.map((seg) => seg.position.z);
    for (const seg of this.sceneryItems) {
      this.scene.remove(seg);
      seg.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          o.material.map?.dispose();
          o.material.dispose();
        }
      });
    }
    this.sceneryItems = [];
    this.lampFixtures = [];
    this.buildRoadsideScenery();
    this.sceneryItems.forEach((seg, i) => (seg.position.z = zs[i] ?? seg.position.z));
    this.applyWeather(this.weatherKey); // lamp colours for the new fixtures
  }

  createHighwayGantrySign(textMain, textSub) {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4,
      metalness: 0.8,
    });

    // Left & Right Support Truss Columns
    const leftCol = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 8.2, 12), poleMat);
    leftCol.position.set(-ROAD_HALF_WIDTH - 1.2, 4.1, 0);
    group.add(leftCol);

    const rightCol = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 8.2, 12), poleMat);
    rightCol.position.set(ROAD_HALF_WIDTH + 1.2, 4.1, 0);
    group.add(rightCol);

    // Overhead Crossbeam
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry((ROAD_HALF_WIDTH + 1.4) * 2, 0.38, 0.38),
      poleMat
    );
    beam.position.set(0, 7.8, 0);
    group.add(beam);

    // Green Turkish Otoyol Signboard Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#046a38'; // Official Highway Green
    ctx.fillRect(0, 0, 1024, 256);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(14, 14, 1024 - 28, 256 - 28);

    // O-4 Highway Shield Badge
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(48, 46, 130, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 40px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('O-4', 113, 92);

    ctx.font = '900 54px system-ui, sans-serif';
    ctx.fillText(textMain, 540, 106);

    ctx.fillStyle = '#fde047';
    ctx.font = '800 36px system-ui, sans-serif';
    ctx.fillText(textSub, 540, 174);

    // Downward lane arrows
    for (let i = 0; i < 4; i++) {
      const ax = 200 + i * 225;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('↓', ax, 228);
    }

    const signTex = new THREE.CanvasTexture(canvas);
    signTex.colorSpace = THREE.SRGBColorSpace;
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(11.8, 2.5, 0.16),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    signBoard.position.set(0, 7.6, 0.22);
    group.add(signBoard);

    return group;
  }

  buildRoadsideScenery() {
    const half = this.roadHalfWidth;
    const twoWay = this.roadMode === 'twoway';
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.75,
    });

    const lampGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffd27d,
    });
    this.lampFixtures.push(lampGlowMat);

    const redReflectorMat = new THREE.MeshBasicMaterial({ color: 0xff2233 });
    const whiteReflectorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Create 18 repeating roadside segments spanning Z from +40 to -320 (spacing = 20m)
    const numSegments = 18;
    const spacing = 20;

    const signTexts = [
      ['İSTANBUL MERKEZ  12 KM', '15 TEMMUZ ŞEHİTLER KÖPRÜSÜ  •  AVRASYA TÜNELİ'],
      ['ANKARA / KOCAELİ', 'SOL ŞERİT SÜREKLİ İŞGAL EDİLEMEZ'],
      ['FSM KÖPRÜSÜ  •  LEVENT', 'HIZ SINIRI 120 KM/S  •  RADAR KONTROL'],
    ];

    // Every building shares one material (they were identical per-building copies)
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0d1320,
      roughness: 0.85,
    });

    // Static pieces of a segment are baked into one geometry per material, so each segment
    // costs ~5 draw calls instead of ~10 (x18 segments, and again for the rear-view mirror)
    const _m = new THREE.Matrix4();
    const _q = new THREE.Quaternion();
    const _e = new THREE.Euler();
    const _p = new THREE.Vector3();
    const _s = new THREE.Vector3(1, 1, 1);
    const placed = (geo, x, y, z, rotZ = 0) => {
      _q.setFromEuler(_e.set(0, 0, rotZ));
      return geo.applyMatrix4(_m.compose(_p.set(x, y, z), _q, _s));
    };

    for (let i = 0; i < numSegments; i++) {
      const z = 40 - i * spacing;
      const segGroup = new THREE.Group();
      segGroup.position.z = z;

      const poleParts = [];
      const bulbParts = [];
      const buildingParts = [];

      // 1. Reflective Cat-Eye Posts on top of Jersey Barriers (Every 20m)
      const leftRef = new THREE.Mesh(
        placed(new THREE.BoxGeometry(0.12, 0.22, 0.08), -half - 0.55, twoWay ? 0.8 : 1.05, 0),
        redReflectorMat
      );
      segGroup.add(leftRef);

      const rightRef = new THREE.Mesh(
        placed(new THREE.BoxGeometry(0.12, 0.22, 0.08), half + 0.55, twoWay ? 0.8 : 1.05, 0),
        whiteReflectorMat
      );
      segGroup.add(rightRef);

      // 2. Highway Streetlights (Left & Right tall curved poles)
      [-1, 1].forEach((side) => {
        const poleX = side * (half + 1.35);
        poleParts.push(placed(new THREE.CylinderGeometry(0.1, 0.14, 8.8, 8), poleX, 4.4, 0));

        // Overhanging arm toward road
        poleParts.push(
          placed(new THREE.BoxGeometry(2.6, 0.1, 0.1), poleX - side * 1.2, 8.6, 0, side * 0.12)
        );

        // Glowing LED/Sodium fixture
        bulbParts.push(placed(new THREE.BoxGeometry(0.75, 0.08, 0.32), poleX - side * 2.2, 8.45, 0));
      });

      // 3. Distant City Buildings / Towers Silhouette on both sides
      [-1, 1].forEach((side) => {
        const bHeight = 14 + ((i * 7 + (side > 0 ? 3 : 0)) % 28);
        const bWidth = 8 + (i % 5) * 2;
        buildingParts.push(
          placed(
            new THREE.BoxGeometry(bWidth, bHeight, 10),
            side * (26 + (i % 4) * 7),
            bHeight / 2 - 0.5,
            0
          )
        );
      });

      segGroup.add(new THREE.Mesh(mergeGeometries(poleParts), poleMat));
      segGroup.add(new THREE.Mesh(mergeGeometries(bulbParts), lampGlowMat));
      const buildings = new THREE.Mesh(mergeGeometries(buildingParts), buildingMat);
      // Far-off silhouettes are left out of the rear-view mirror render (see CarCockpit)
      buildings.layers.set(MIRROR_SKIP_LAYER);
      segGroup.add(buildings);
      [...poleParts, ...bulbParts, ...buildingParts].forEach((g) => g.dispose());

      // 4. Overhead Highway Gantry Sign every 6 segments
      if (i % 6 === 2 && !twoWay) {
        const [t1, t2] = signTexts[Math.floor(i / 6) % signTexts.length];
        const gantry = this.createHighwayGantrySign(t1, t2);
        segGroup.add(gantry);
      }

      this.scene.add(segGroup);
      this.sceneryItems.push(segGroup);
    }
  }

  buildRainParticles() {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = 10 - Math.random() * 140;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xa5d8ff,
      size: 0.14,
      transparent: true,
      opacity: 0.55,
    });

    this.rainSystem = new THREE.Points(geo, mat);
    this.rainSystem.visible = false;
    this.scene.add(this.rainSystem);
  }

  applyWeather(key) {
    const preset = WEATHER_PRESETS[key] || WEATHER_PRESETS.night;
    this.weatherKey = preset.key;

    this.scene.background = new THREE.Color(preset.skyColor);
    this.scene.fog = new THREE.FogExp2(preset.fogColor, preset.fogDensity);

    this.ambientLight.color.setHex(preset.ambientColor);
    this.ambientLight.intensity = preset.ambientIntensity;

    if (this.hemiLight) {
      this.hemiLight.color.setHex(preset.dirColor);
      this.hemiLight.groundColor.setHex(preset.hemiGroundColor || 0x2a364f);
      this.hemiLight.intensity = preset.ambientIntensity * 0.85;
    }

    this.dirLight.color.setHex(preset.dirColor);
    this.dirLight.intensity = preset.dirIntensity;

    if (this.roadMat) {
      this.roadMat.roughness = preset.roadRoughness;
      this.roadMat.metalness = preset.roadMetalness;
      this.roadMat.needsUpdate = true;
    }

    this.lampFixtures.forEach((mat) => {
      mat.color.setHex(preset.streetlightsOn ? 0xffdf99 : 0x64748b);
    });

    if (this.rainSystem) {
      this.rainSystem.visible = preset.rain;
    }

    // Adjust player low-beams based on day/night
    this.lowBeamLight.intensity = preset.streetlightsOn ? 14.0 : 2.5;

    return preset;
  }

  cycleWeather() {
    const keys = Object.keys(WEATHER_PRESETS);
    const idx = keys.indexOf(this.weatherKey);
    const nextKey = keys[(idx + 1) % keys.length];
    return this.applyWeather(nextKey);
  }

  update(dt, speedMs, playerX, highBeamActive, customWorldDistM = null) {
    if (customWorldDistM !== null) {
      this.worldDistM = customWorldDistM;
    } else {
      this.worldDistM += speedMs * dt;
    }

    // Scroll road texture UVs smoothly based on speed (m/s)
    // 1 texture repeat is ~20 meters
    this.scrollOffset += (speedMs * dt) / 20;
    if (this.roadTexture) {
      this.roadTexture.offset.y = this.scrollOffset;
    }

    // Deform subdivided road, ground, and concrete Jersey barriers along the 3D highway curve
    for (const item of this.curvableGeometries) {
      const pos = item.geo.attributes.position;
      const baseX = item.baseX;
      for (let i = 0; i < pos.count; i++) {
        const z = pos.getZ(i);
        pos.setX(i, baseX[i] + this.getCurveOffsetAtZ(z));
      }
      pos.needsUpdate = true;
    }

    // Move roadside poles, barriers, buildings & overhead signs toward player (+Z) and follow the curve
    const totalSpan = this.sceneryItems.length * 20; // 360m loop
    for (const seg of this.sceneryItems) {
      seg.position.z += speedMs * dt;
      if (seg.position.z > 45) {
        seg.position.z -= totalSpan;
      }
      seg.position.x = this.getCurveOffsetAtZ(seg.position.z);
      seg.rotation.y = this.getCurveYawAtZ(seg.position.z);
    }

    // Update Headlight & Selektör position to follow player car X + Audi Matrix Adaptive Cornering light swivel
    this.headlightGroup.position.x = playerX;
    this.lowBeamTarget.position.x = this.getCurveOffsetAtZ(-55) * 0.7;
    this.highBeamTarget.position.x = this.getCurveOffsetAtZ(-115) * 0.7;
    this.highBeamLight.intensity = highBeamActive ? 28.0 : 0.0;

    // Update falling rain streaks if Rainy weather is active
    if (this.rainSystem && this.rainSystem.visible) {
      const pos = this.rainSystem.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - 18 * dt;
        let z = pos.getZ(i) + speedMs * dt * 0.85;
        if (y < 0) y = 14;
        if (z > 10) z -= 140;
        pos.setY(i, y);
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
  }
}
