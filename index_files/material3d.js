/* Vật liệu thật: a small 3D sample of the real substance next to the atom.
   Plain WebGL, no libraries. It follows the element selected in the atom viewer
   (reads the Z shown in [data-a3m-curz]). */
(function () {
  'use strict';

  /* ---------- appearance table: Z -> [colour, kind, Vietnamese colour word, options] ----------
     kinds: metal | crystal | liquid | gas | unknown   (state at ~20 °C, 1 atm) */
  var M = 'metal', C = 'crystal', Lq = 'liquid', G = 'gas', U = 'unknown';
  var SILVER = 'trắng bạc', STEEL = 'xám thép';
  var T = {
    1: ['#cfe6ff', G, 'không màu'], 2: ['#e8f0ff', G, 'không màu'],
    3: ['#d8d8dc', M, SILVER + ', mềm'], 4: ['#b8bcbf', M, STEEL],
    5: ['#3a2e2a', C, 'nâu đen', { metal: .35, rough: .3 }],
    6: ['#2b2b30', C, 'đen (than chì)', { metal: .8, rough: .38 }],
    7: ['#d6e6ff', G, 'không màu'], 8: ['#cfe3ff', G, 'không màu'],
    9: ['#e6f0a0', G, 'vàng lục nhạt'], 10: ['#e8f0ff', G, 'không màu'],
    11: ['#cfd1d6', M, SILVER + ', mềm'], 12: ['#c5c8cc', M, SILVER],
    13: ['#d4d7db', M, SILVER, { rough: .2 }],
    14: ['#5b6472', C, 'xám xanh, ánh kim', { metal: .95, rough: .2 }],
    15: ['#9f2d26', C, 'đỏ (photpho đỏ)', { metal: 0, rough: .5 }],
    16: ['#f2dc3c', C, 'vàng chanh', { metal: 0, rough: .45 }],
    17: ['#cfe45e', G, 'vàng lục'], 18: ['#e8f0ff', G, 'không màu'],
    19: ['#d2d3d8', M, SILVER + ', mềm'], 20: ['#d3d4d4', M, SILVER],
    21: ['#cdcdd0', M, SILVER], 22: ['#aeb0b5', M, SILVER],
    23: ['#9ea3a9', M, STEEL], 24: ['#c3c8cd', M, 'bạc ánh xanh', { rough: .15 }],
    25: ['#a9a6aa', M, 'xám bạc'], 26: ['#9a9da2', M, 'xám ánh kim'],
    27: ['#8f98a6', M, 'xám ánh xanh'], 28: ['#c6c8c9', M, SILVER],
    29: ['#c4693f', M, 'đỏ đồng', { rough: .2 }], 30: ['#b7bcc4', M, 'xám ánh xanh'],
    31: ['#cfd4da', M, SILVER + ' (nóng chảy ~30 °C)'], 32: ['#8f949b', M, 'xám bạc'],
    33: ['#8c8f93', M, 'xám'], 34: ['#5a5a5e', C, 'xám', { metal: .5, rough: .35 }],
    35: ['#6e1f10', Lq, 'nâu đỏ', { metal: 0, rough: .06 }], 36: ['#e8f0ff', G, 'không màu'],
    37: ['#cfcfd3', M, SILVER + ', mềm'], 38: ['#d6d0bd', M, 'trắng bạc ngả vàng'],
    39: ['#c9cbcc', M, SILVER], 40: ['#c5c8ca', M, SILVER], 41: ['#98a0aa', M, 'xám xanh'],
    42: ['#a4a8ad', M, STEEL], 43: ['#9a9ea4', M, 'xám bạc'], 44: ['#a1a5a9', M, 'xám bạc'],
    45: ['#cbced2', M, SILVER], 46: ['#d0d1d0', M, SILVER],
    47: ['#e7e8ec', M, SILVER, { rough: .12 }], 48: ['#bdc3c9', M, 'xám xanh'],
    49: ['#c4c8cd', M, SILVER + ', mềm'], 50: ['#c3c7cb', M, SILVER],
    51: ['#b6babe', M, 'xám bạc'], 52: ['#a9acaf', M, 'xám bạc'],
    53: ['#2f2540', C, 'tím đen', { metal: .5, rough: .25 }], 54: ['#e8f0ff', G, 'không màu'],
    55: ['#e3c98a', M, 'vàng nhạt, mềm'], 56: ['#c9cac5', M, SILVER],
    72: ['#a9aeb4', M, 'xám bạc'], 73: ['#858d97', M, 'xám xanh'], 74: ['#8c8f93', M, STEEL],
    75: ['#9c9fa4', M, 'xám bạc'], 76: ['#8ea2b6', M, 'xám xanh'], 77: ['#d8dadc', M, SILVER],
    78: ['#dcdfe1', M, SILVER, { rough: .12 }], 79: ['#ffc357', M, 'vàng óng', { rough: .16 }],
    80: ['#dfe1e5', Lq, 'bạc', { metal: 1, rough: .03 }], 81: ['#b8bcc1', M, 'xám bạc, mềm'],
    82: ['#6e7479', M, 'xám xanh tối, mềm', { rough: .35 }], 83: ['#cdbcc6', M, 'bạc ánh hồng'],
    84: ['#aeb0b4', M, 'xám bạc'], 85: ['#7d8794', U, ''], 86: ['#e8f0ff', G, 'không màu'],
    87: ['#7d8794', U, ''], 88: ['#d3d3d1', M, SILVER], 89: ['#b7bcc4', M, SILVER],
    90: ['#aaadb1', M, 'xám bạc'], 91: ['#b4b7bb', M, 'xám bạc'], 92: ['#8d9195', M, 'xám bạc'],
    93: ['#a7aaae', M, 'xám bạc'], 94: ['#a2a5a9', M, 'xám bạc'], 95: ['#c8cacd', M, SILVER],
    96: ['#c7c9cc', M, SILVER], 97: ['#bcc0c3', M, SILVER], 98: ['#bcc0c3', M, SILVER]
  };
  var LANTH = { 57: '#c6c8cb', 58: '#bdbfc0', 59: '#cdc9b4', 60: '#c9c6b8', 61: '#c4c6c9', 62: '#c8c9c9',
    63: '#d0cdc3', 64: '#cfd1d3', 65: '#c9cbcc', 66: '#c6c8c9', 67: '#c9c9c8', 68: '#cbc8c9',
    69: '#c6c9ca', 70: '#d1cfc6', 71: '#c4c7ca' };
  for (var lz in LANTH) T[lz] = [LANTH[lz], M, SILVER];
  for (var uz = 99; uz <= 118; uz++) T[uz] = ['#7d8794', U, ''];

  var NOTE_UNKNOWN = 'Chưa có mẫu nhìn thấy được';

  /* ---------- tiny maths ---------- */
  function hex(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  function lin(c) { return [Math.pow(c[0], 2.2), Math.pow(c[1], 2.2), Math.pow(c[2], 2.2)]; }
  function mul(a, b) { var o = new Float32Array(16); for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) { var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s; } return o; }
  function persp(f, a, n, r) { var t = 1 / Math.tan(f / 2), o = new Float32Array(16); o[0] = t / a; o[5] = t; o[10] = (r + n) / (n - r); o[11] = -1; o[14] = 2 * r * n / (n - r); return o; }
  function trans(x, y, z) { var o = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]); return o; }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); }

  function hash(x, y, z) { var h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
  function vnoise(x, y, z) {
    var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    function l(a, b, t) { return a + (b - a) * t; }
    return l(l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
             l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v), w);
  }

  /* ---------- geometry: displaced icosphere ---------- */
  function icosphere(sub) {
    var t = (1 + Math.sqrt(5)) / 2;
    var v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
    v = v.map(function (p) { var l = Math.hypot(p[0], p[1], p[2]); return [p[0] / l, p[1] / l, p[2] / l]; });
    var f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
             [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (var s = 0; s < sub; s++) {
      var cache = {}, nf = [];
      var mid = function (a, b) {
        var k = a < b ? a + '_' + b : b + '_' + a;
        if (cache[k] !== undefined) return cache[k];
        var p = [(v[a][0] + v[b][0]) / 2, (v[a][1] + v[b][1]) / 2, (v[a][2] + v[b][2]) / 2], l = Math.hypot(p[0], p[1], p[2]);
        v.push([p[0] / l, p[1] / l, p[2] / l]); return (cache[k] = v.length - 1);
      };
      f.forEach(function (q) { var a = mid(q[0], q[1]), b = mid(q[1], q[2]), c = mid(q[2], q[0]); nf.push([q[0], a, c], [q[1], b, a], [q[2], c, b], [a, b, c]); });
      f = nf;
    }
    return { v: v, f: f };
  }

  /* build position + normal arrays for one element's sample */
  function buildMesh(kind, z) {
    var flat = kind === 'crystal' || kind === 'unknown';
    var sub = flat ? 2 : 4, ico = icosphere(sub), off = z * 7.31;
    var P = ico.v.map(function (d) {
      var r = 1, sx = 1, sy = 1, sz = 1;
      if (kind === 'metal') {
        r = 1 + .26 * (vnoise(d[0] * 1.3 + off, d[1] * 1.3, d[2] * 1.3) - .5) * 2 + .07 * (vnoise(d[0] * 3.4 + off, d[1] * 3.4, d[2] * 3.4) - .5) * 2;
        sx = 1.1; sy = .78; sz = .95;
      } else if (flat) {
        r = 1 + .34 * (vnoise(d[0] * 1.5 + off, d[1] * 1.5, d[2] * 1.5) - .5) * 2;
        sx = 1.05; sy = .85; sz = .95;
      } else if (kind === 'liquid') { sy = .82; }
      return [d[0] * r * sx, d[1] * r * sy, d[2] * r * sz];
    });
    var pos = [], nor = [], acc = P.map(function () { return [0, 0, 0]; });
    ico.f.forEach(function (q) {
      var a = P[q[0]], b = P[q[1]], c = P[q[2]];
      var e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      var n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      q.forEach(function (i) { acc[i][0] += n[0]; acc[i][1] += n[1]; acc[i][2] += n[2]; });
    });
    ico.f.forEach(function (q) {
      var a = P[q[0]], b = P[q[1]], c = P[q[2]];
      var e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      var fn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      q.forEach(function (i) {
        var n = flat ? fn : acc[i], l = Math.hypot(n[0], n[1], n[2]) || 1;
        pos.push(P[i][0], P[i][1], P[i][2]); nor.push(n[0] / l, n[1] / l, n[2] / l);
      });
    });
    return { pos: new Float32Array(pos), nor: new Float32Array(nor), n: pos.length / 3 };
  }

  /* ---------- shaders ---------- */
  var VS = 'attribute vec3 aPos;attribute vec3 aNor;uniform mat4 uMVP;uniform mat4 uModel;varying vec3 vN;varying vec3 vW;' +
    'void main(){vec4 w=uModel*vec4(aPos,1.);vW=w.xyz;vN=(uModel*vec4(aNor,0.)).xyz;gl_Position=uMVP*vec4(aPos,1.);}';
  var FS = 'precision highp float;varying vec3 vN;varying vec3 vW;' +
    'uniform vec3 uCol;uniform float uMetal;uniform float uRough;uniform float uAlpha;uniform float uGlass;uniform vec3 uCam;' +
    'vec3 env(vec3 d,float r){float y=d.y;vec3 sky=mix(vec3(.03,.035,.05),vec3(.95,1.02,1.15),smoothstep(-.3,.95,y))+vec3(1.1,1.15,1.25)*exp(-pow((y+.04)*7.,2.));' +
    'float b1=smoothstep(.78,.96,dot(d,normalize(vec3(-.5,.7,.5))));float b2=smoothstep(.84,.97,dot(d,normalize(vec3(.8,.3,.4))));' +
    'float b3=smoothstep(.88,.99,dot(d,normalize(vec3(0.,.15,-.9))));float fl=smoothstep(.1,-.8,y)*.25;' +
    'vec3 c=sky+vec3(2.2,2.1,2.0)*b1+vec3(1.1,1.2,1.5)*b2+vec3(.8)*b3+vec3(.25,.2,.15)*fl;' +
    'return mix(c,vec3(.34,.37,.45),clamp(r,0.,1.)*.85);}' +
    'void main(){vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float ndv=clamp(dot(N,V),0.,1.);vec3 R=reflect(-V,N);' +
    'vec3 L=normalize(vec3(-.45,.75,.55));vec3 col;float al=uAlpha;' +
    'if(uGlass>.5){vec3 e=env(R,0.);float fr=pow(1.-ndv,3.);al=clamp(.04+.85*fr,0.,1.);col=e*(.2+.8*fr)+uCol*.16;al=max(al,.14);' +
    'col=col*(2.51*col+.03)/(col*(2.43*col+.59)+.14);col=pow(clamp(col,0.,1.),vec3(1./2.2));gl_FragColor=vec4(col*al,al);return;}' +
    'vec3 e=env(R,uRough);vec3 f0=mix(vec3(.04),uCol,uMetal);vec3 Fr=f0+(1.-f0)*pow(1.-ndv,5.);' +
    'float diff=max(dot(N,L),0.);vec3 amb=mix(vec3(.10,.11,.15),vec3(.50,.54,.62),N.y*.5+.5);' +
    'vec3 kd=uCol*(1.-uMetal);col=kd*(amb+diff*vec3(1.,.97,.92))*(1.-.5*Fr)+e*Fr;' +
    'col+=pow(max(dot(R,L),0.),mix(220.,10.,uRough))*(1.-uRough*.8)*Fr*1.4;' +
    'col=col*(2.51*col+.03)/(col*(2.43*col+.59)+.14);col=pow(clamp(col,0.,1.),vec3(1./2.2));gl_FragColor=vec4(col*al,al);}';
  var PVS = 'attribute vec3 aP;uniform mat4 uMVP;uniform float uSize;void main(){gl_Position=uMVP*vec4(aP,1.);gl_PointSize=uSize;}';
  var PFS = 'precision mediump float;uniform vec3 uCol;void main(){vec2 d=gl_PointCoord-.5;float a=smoothstep(.5,.1,length(d));gl_FragColor=vec4(uCol*a,a);}';

  /* ---------- UI ---------- */
  var css = '' +
    '.mat-card{position:fixed;z-index:60;top:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;' +
    'width:min(330px,calc(100vw - 24px));padding:8px 18px 8px 8px;border-radius:20px;color:#e8f0ff;' +
    'font-family:var(--a3m-sans,system-ui,"Segoe UI",Roboto,Arial,sans-serif);' +
    'background:linear-gradient(135deg,rgba(24,36,66,.62),rgba(10,16,34,.62));border:1px solid rgba(160,190,255,.18);' +
    '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,.35);touch-action:none}' +
    '.mat-card[hidden]{display:none}' +
    '.mat-cv{flex:none;width:132px;height:132px;cursor:grab;border-radius:16px}.mat-cv:active{cursor:grabbing}' +
    '.mat-txt{min-width:0;line-height:1.3}' +
    '.mat-kick{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#3de0c4;font-weight:700;margin-bottom:4px}' +
    '.mat-name{font-size:22px;font-weight:800;letter-spacing:-.01em}.mat-name small{font-size:14px;font-weight:600;color:#9fb3d9;margin-left:6px}' +
    '.mat-desc{font-size:13px;color:#c7d6f2;margin-top:3px}.mat-hint{font-size:11px;color:#7f92b8;margin-top:8px}' +
    '.mat-credit{position:fixed;z-index:5;left:0;right:0;bottom:5px;margin:0;text-align:center;font:11px/1.3 system-ui,Arial,sans-serif;color:rgba(190,205,235,.55);pointer-events:none}' +
    '.mat-credit a{color:inherit;pointer-events:auto}' +
    '@media (max-width:900px){.mat-card{top:38px;left:12px;transform:none;width:auto;max-width:calc(100vw - 24px);padding:6px 16px 6px 6px}.mat-cv{width:84px;height:84px}.mat-name{font-size:17px}.mat-name small{font-size:12px}.mat-desc{font-size:12px}.mat-hint{display:none}.mat-kick{font-size:9.5px;margin-bottom:2px}.mat-credit{top:4px;bottom:auto;font-size:10px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var card = document.createElement('div');
  card.className = 'mat-card'; card.setAttribute('role', 'group'); card.setAttribute('aria-label', 'Vật liệu thật của nguyên tố');
  card.innerHTML = '<canvas class="mat-cv" aria-hidden="true"></canvas><div class="mat-txt"><div class="mat-kick">Vật liệu thật</div>' +
    '<div class="mat-name"><span data-mat-name>Hiđro</span><small data-mat-sym>H</small></div>' +
    '<div class="mat-desc" data-mat-desc></div><div class="mat-hint">Ở 20 °C · kéo để xoay</div></div>';
  document.body.appendChild(card);

  var cv = card.querySelector('canvas');
  var gl = null;
  try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true, depth: true }) || cv.getContext('experimental-webgl'); } catch (e) { gl = null; }
  if (!gl) { card.hidden = true; return; }

  function prog(vs, fs) {
    var p = gl.createProgram();
    [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]].forEach(function (s) {
      var sh = gl.createShader(s[0]); gl.shaderSource(sh, s[1]); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
    });
    gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  var P1, P2;
  try { P1 = prog(VS, FS); P2 = prog(PVS, PFS); } catch (err) { card.hidden = true; return; }
  var U1 = {}, U2 = {};
  ['uMVP', 'uModel', 'uCol', 'uMetal', 'uRough', 'uAlpha', 'uGlass', 'uCam'].forEach(function (n) { U1[n] = gl.getUniformLocation(P1, n); });
  ['uMVP', 'uSize', 'uCol'].forEach(function (n) { U2[n] = gl.getUniformLocation(P2, n); });
  var bufPos = gl.createBuffer(), bufNor = gl.createBuffer(), bufPart = gl.createBuffer();

  var dpr = Math.min(window.devicePixelRatio || 1, 2), size = 0;
  function resize() {
    var w = Math.round(cv.clientWidth * dpr) || 264;
    if (w !== size) { size = w; cv.width = w; cv.height = w; }
  }

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = null, popT = 1, yaw = .6, pitch = .18, vyaw = reduce ? 0 : .35, drag = false, lx = 0, ly = 0;
  var parts = null, pvel = null, NPART = 150;

  function setElement(z) {
    var d = T[z];
    if (!d) { card.hidden = true; return; }
    card.hidden = false;
    var kind = d[1], o = d[3] || {};
    var metal = o.metal !== undefined ? o.metal : (kind === 'metal' ? 1 : kind === 'unknown' ? .3 : 0);
    var rough = o.rough !== undefined ? o.rough : (kind === 'metal' ? .28 : kind === 'gas' ? 0 : kind === 'unknown' ? .6 : .4);
    cur = { z: z, kind: kind, col: lin(hex(d[0])), metal: metal, rough: rough, mesh: buildMesh(kind === 'gas' ? 'gasball' : kind, z), raw: d[0] };
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPos); gl.bufferData(gl.ARRAY_BUFFER, cur.mesh.pos, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufNor); gl.bufferData(gl.ARRAY_BUFFER, cur.mesh.nor, gl.STATIC_DRAW);
    if (kind === 'gas') {
      parts = new Float32Array(NPART * 3); pvel = new Float32Array(NPART * 3);
      for (var i = 0; i < NPART; i++) {
        var r = .8 * Math.cbrt(Math.random()), a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
        parts[i * 3] = r * Math.sin(b) * Math.cos(a); parts[i * 3 + 1] = r * Math.sin(b) * Math.sin(a); parts[i * 3 + 2] = r * Math.cos(b);
        pvel[i * 3] = (Math.random() - .5) * .02; pvel[i * 3 + 1] = (Math.random() - .5) * .02; pvel[i * 3 + 2] = (Math.random() - .5) * .02;
      }
    } else { parts = null; }
    var state = kind === 'gas' ? 'Khí' : kind === 'liquid' ? 'Lỏng' : kind === 'unknown' ? 'Chưa rõ' : 'Rắn';
    card.querySelector('[data-mat-desc]').textContent = kind === 'unknown' ? NOTE_UNKNOWN : state + ' · ' + d[2];
    popT = 0;
  }

  function readElement() {
    var zEl = document.querySelector('[data-a3m-curz]');
    var z = zEl ? parseInt(zEl.textContent, 10) : NaN;
    var nm = document.querySelector('[data-a3m-curname]'), sy = document.querySelector('[data-a3m-cursym]');
    card.querySelector('[data-mat-name]').textContent = nm ? nm.textContent.trim() : '';
    card.querySelector('[data-mat-sym]').textContent = sy ? sy.textContent.trim() : '';
    if (z && (!cur || cur.z !== z)) setElement(z);
  }
  var pend = false;
  function schedule() { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; readElement(); }); }

  function start() {
    var host = document.querySelector('[data-a3m-curz]');
    if (!host) { setTimeout(start, 300); return; }
    new MutationObserver(schedule).observe(host.parentNode.parentNode || document.body, { childList: true, characterData: true, subtree: true });
    readElement();
    setInterval(readElement, 1000); /* safety net */
  }

  /* drag to rotate */
  cv.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; ly = e.clientY; vyaw = 0; try { cv.setPointerCapture(e.pointerId); } catch (x) { } });
  cv.addEventListener('pointermove', function (e) { if (!drag) return; yaw += (e.clientX - lx) * .012; pitch = Math.max(-1.2, Math.min(1.2, pitch + (e.clientY - ly) * .012)); lx = e.clientX; ly = e.clientY; });
  function up() { if (drag) { drag = false; if (!reduce) vyaw = .35; } }
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  var last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden || card.hidden || !cur) return;
    var dt = Math.min((now - last) / 1000, .05); last = now;
    resize();
    if (!drag) yaw += vyaw * dt;
    popT = Math.min(1, popT + dt / .45);
    var ease = 1 - Math.pow(1 - popT, 3), sc = (.6 + .4 * ease) * .78 + (cur.kind === 'liquid' ? Math.sin(now / 600) * .02 : 0);

    gl.viewport(0, 0, cv.width, cv.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var model = mul(rotX(pitch), rotY(cur.kind === 'gas' ? 0 : yaw));
    var s = new Float32Array([sc, 0, 0, 0, 0, sc, 0, 0, 0, 0, sc, 0, 0, 0, 0, 1]);
    var m = mul(model, s);
    var view = mul(persp(.62, 1, .1, 20), trans(0, 0, -4.4));
    var mvp = mul(view, m);

    if (cur.kind === 'gas') {
      gl.disable(gl.DEPTH_TEST);
      var tint = hex(cur.raw);
      for (var i = 0; i < NPART; i++) {
        for (var k = 0; k < 3; k++) { parts[i * 3 + k] += (reduce ? 0 : pvel[i * 3 + k] * dt * 60); }
        var x = parts[i * 3], y = parts[i * 3 + 1], zz = parts[i * 3 + 2], r2 = x * x + y * y + zz * zz;
        if (r2 > .72) { for (var q = 0; q < 3; q++) { pvel[i * 3 + q] = -pvel[i * 3 + q]; parts[i * 3 + q] *= .97; } }
      }
      gl.useProgram(P2);
      gl.uniformMatrix4fv(U2.uMVP, false, mul(view, s));
      gl.uniform1f(U2.uSize, 7 * dpr * (size / (132 * dpr)));
      gl.uniform3f(U2.uCol, tint[0], tint[1], tint[2]);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufPart); gl.bufferData(gl.ARRAY_BUFFER, parts, gl.DYNAMIC_DRAW);
      var lp = gl.getAttribLocation(P2, 'aP'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 3, gl.FLOAT, false, 0, 0);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.drawArrays(gl.POINTS, 0, NPART);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disableVertexAttribArray(lp);
    } else { gl.enable(gl.DEPTH_TEST); }

    gl.useProgram(P1);
    gl.uniformMatrix4fv(U1.uMVP, false, cur.kind === 'gas' ? mul(view, s) : mvp);
    gl.uniformMatrix4fv(U1.uModel, false, cur.kind === 'gas' ? s : m);
    gl.uniform3fv(U1.uCol, cur.col);
    gl.uniform1f(U1.uMetal, cur.metal); gl.uniform1f(U1.uRough, cur.rough);
    gl.uniform1f(U1.uAlpha, cur.kind === 'unknown' ? .6 : 1);
    gl.uniform1f(U1.uGlass, cur.kind === 'gas' ? 1 : 0);
    gl.uniform3f(U1.uCam, 0, 0, 4.4);
    var ap = gl.getAttribLocation(P1, 'aPos'), an = gl.getAttribLocation(P1, 'aNor');
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPos); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufNor); gl.enableVertexAttribArray(an); gl.vertexAttribPointer(an, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, cur.mesh.n);
    gl.disableVertexAttribArray(ap); gl.disableVertexAttribArray(an);
  }

  requestAnimationFrame(frame);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
