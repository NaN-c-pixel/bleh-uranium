/* Vật liệu thật — inspired by Theodore Gray's "The Elements".
   A rotating 3D sample of the real substance for the selected element:
     1. a small card above the atom,
     2. a large "Mẫu vật" panel with facts (state, colour, mass, density, melting / boiling point),
     3. a sample thumbnail on every tile of the periodic table.
   Plain WebGL, no libraries. Follows the element shown in [data-a3m-curz]. */
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

  /* ---------- facts: [atomic mass u, density (g/L for gases, else g/cm³), melting K, boiling K] ----------
     Source: Periodic-Table-JSON (CC BY-SA 3.0, from Wikipedia). */
  var FACTS = [[1.008,0.08988,13.99,20.271],[4.002602,0.1786,0.95,4.222],[6.94,0.534,453.65,1603],[9.012183,1.85,1560,2742],[10.81,2.08,2349,4200],[12.011,1.821,4600,null],[14.007,1.251,63.15,77.355],[15.999,1.429,54.36,90.188],[18.9984,1.696,53.48,85.03],[20.17976,0.9002,24.56,27.104],[22.98977,0.968,370.94,1156.1],[24.305,1.738,923,1363],[26.98154,2.7,933.47,2743],[28.085,2.329,1687,3538],[30.97376,1.823,317.3,null],[32.06,2.07,388.36,717.8],[35.45,3.2,171.6,239.11],[39.9481,1.784,83.81,87.302],[39.09831,0.862,336.7,1032],[40.0784,1.55,1115,1757],[44.95591,2.985,1814,3109],[47.8671,4.506,1941,3560],[50.94151,6,2183,3680],[51.99616,7.19,2180,2944],[54.93804,7.21,1519,2334],[55.8452,7.874,1811,3134],[58.93319,8.9,1768,3200],[58.69344,8.908,1728,3003],[63.5463,8.96,1357.8,2835],[65.382,7.14,692.68,1180],[69.7231,5.91,302.91,2673],[72.6308,5.323,1211.4,3106],[74.9216,5.727,1090,null],[78.9718,4.81,494,958],[79.904,3.103,265.8,332],[83.7982,3.749,115.78,119.93],[85.46783,1.532,312.45,961],[87.621,2.64,1050,1650],[88.90584,4.472,1799,3203],[91.2242,6.52,2128,4650],[92.90637,8.57,2750,5017],[95.951,10.28,2896,4912],[98,11,2430,4538],[101.072,12.45,2607,4423],[102.9055,12.41,2237,3968],[106.421,12.02,1828,3236],[107.8682,10.49,1234.9,2435],[112.4144,8.65,594.22,1040],[114.8181,7.31,429.75,2345],[118.7107,7.365,505.08,2875],[121.7601,6.697,903.78,1908],[127.603,6.24,722.66,1261],[126.9045,4.933,386.85,457.4],[131.2936,5.894,161.4,165.05],[132.9055,1.93,301.7,944],[137.3277,3.51,1000,2118],[138.9055,6.162,1193,3737],[140.1161,6.77,1068,3716],[140.9077,6.77,1208,3403],[144.2423,7.01,1297,3347],[145,7.26,1315,3273],[150.362,7.52,1345,2173],[151.9641,5.264,1099,1802],[157.253,7.9,1585,3273],[158.9254,8.23,1629,3396],[162.5001,8.54,1680,2840],[164.9303,8.79,1734,2873],[167.2593,9.066,1802,3141],[168.9342,9.32,1818,2223],[173.0451,6.9,1097,1469],[174.9668,9.841,1925,3675],[178.492,13.31,2506,4876],[180.9479,16.69,3290,5731],[183.841,19.25,3695,6203],[186.2071,21.02,3459,5869],[190.233,22.59,3306,5285],[192.2173,22.56,2719,4403],[195.0849,21.45,2041.4,4098],[196.9666,19.3,1337.3,3243],[200.5923,13.53,234.32,629.88],[204.38,11.85,577,1746],[207.21,11.34,600.61,2022],[208.9804,9.78,544.7,1837],[209,9.196,527,1235],[210,6.35,575,610],[222,9.73,202,211.5],[223,1.87,300,950],[226,5.5,1233,2010],[227,10,1500,3500],[232.0377,11.72,2023,5061],[231.0359,15.37,1841,4300],[238.0289,19.1,1405.3,4404],[237,20.45,912,4447],[244,19.82,912.5,3505],[243,12,1449,2880],[247,13.51,1613,3383],[247,14.78,1259,2900],[251,15.1,1173,1743],[252,8.84,1133,1269],[257,null,1800,null],[258,null,1100,null],[259,null,1100,null],[266,null,1900,null],[267,23.2,2400,5800],[268,29.3,null,null],[269,35,null,null],[270,37.1,null,null],[269,40.7,null,null],[278,37.4,null,null],[281,34.8,null,null],[282,28.7,null,null],[285,14,283,340],[286,16,700,1430],[289,14,340,420],[289,13.5,670,1400],[293,12.9,709,1085],[294,7.17,723,883],[294,4.95,null,350]];

  function num(x) {
    var a = Math.abs(x), s;
    if (a >= 100) s = String(Math.round(x));
    else if (a >= 10) s = x.toFixed(1);
    else s = x.toPrecision(3);
    if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',');
  }
  function mass(x) { var s = x.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); return s.replace('.', ','); }
  function celsius(k) { return Math.round(k - 273.15).toLocaleString('vi-VN') + ' °C'; }

  /* ---------- tiny maths ---------- */
  function hex(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  function lin(c) { return [Math.pow(c[0], 2.2), Math.pow(c[1], 2.2), Math.pow(c[2], 2.2)]; }
  function mul(a, b) { var o = new Float32Array(16); for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) { var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s; } return o; }
  function persp(f, a, n, r) { var t = 1 / Math.tan(f / 2), o = new Float32Array(16); o[0] = t / a; o[5] = t; o[10] = (r + n) / (n - r); o[11] = -1; o[14] = 2 * r * n / (n - r); return o; }
  function trans(x, y, z) { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]); }
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

  var meshCache = {};
  function buildMesh(kind, z, lite) {
    var key = kind + '_' + z + (lite ? 'L' : '');
    if (meshCache[key]) return meshCache[key];
    var flat = kind === 'crystal' || kind === 'unknown';
    var ico = icosphere(flat ? 2 : (lite ? 3 : 4)), off = z * 7.31;
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
    function fnorm(q) {
      var a = P[q[0]], b = P[q[1]], c = P[q[2]];
      var e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      return [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    }
    ico.f.forEach(function (q) { var n = fnorm(q); q.forEach(function (i) { acc[i][0] += n[0]; acc[i][1] += n[1]; acc[i][2] += n[2]; }); });
    ico.f.forEach(function (q) {
      var fn = fnorm(q);
      q.forEach(function (i) {
        var n = flat ? fn : acc[i], l = Math.hypot(n[0], n[1], n[2]) || 1;
        pos.push(P[i][0], P[i][1], P[i][2]); nor.push(n[0] / l, n[1] / l, n[2] / l);
      });
    });
    return (meshCache[key] = { pos: new Float32Array(pos), nor: new Float32Array(nor), n: pos.length / 3 });
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

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dprMax = Math.min(window.devicePixelRatio || 1, 2);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var AUTO = reduce ? 0 : .35;

  /* ---------- phone tilt (shared by every sample) ---------- */
  var G = { tx: 0, ty: 0, g: 0, b: 0, bg: null, bb: null, has: false, asked: false, on: false };
  function onOrient(e) {
    if (e.gamma == null || e.beta == null) return;
    G.g = e.gamma; G.b = e.beta; if (G.bg === null) { G.bg = G.g; G.bb = G.b; } G.has = true;
  }
  function tiltOn() { if (G.on) return; G.on = true; window.addEventListener('deviceorientation', onOrient); }
  function askTilt() {                         /* iOS wants a tap before it allows motion data */
    if (G.asked) return; G.asked = true;
    var D = window.DeviceOrientationEvent; if (!D) return;
    if (typeof D.requestPermission === 'function') { D.requestPermission().then(function (r) { if (r === 'granted') tiltOn(); }).catch(function () { }); }
  }
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') tiltOn();
  function tiltTick(dt) {                      /* tilt is measured from where the phone was held, which slowly re-centres */
    if (!G.has) return;
    var k = 1 - Math.exp(-.35 * dt), r = Math.PI / 180;
    G.bg += (G.g - G.bg) * k; G.bb += (G.b - G.bb) * k;
    G.tx = clamp((G.g - G.bg) * r * 1.4, -1.6, 1.6); G.ty = clamp((G.b - G.bb) * r * 1.4, -1.3, 1.3);
  }

  /* ---------- one renderer per canvas ---------- */
  function createRenderer(canvas, opt) {
    opt = opt || {};
    var gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: !opt.lite, depth: true, preserveDrawingBuffer: !!opt.preserve }) ||
           canvas.getContext('experimental-webgl');
    } catch (e) { gl = null; }
    if (!gl) return null;

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
    try { P1 = prog(VS, FS); P2 = prog(PVS, PFS); } catch (err) { return null; }
    var U1 = {}, U2 = {};
    ['uMVP', 'uModel', 'uCol', 'uMetal', 'uRough', 'uAlpha', 'uGlass', 'uCam'].forEach(function (n) { U1[n] = gl.getUniformLocation(P1, n); });
    ['uMVP', 'uSize', 'uCol'].forEach(function (n) { U2[n] = gl.getUniformLocation(P2, n); });
    var aPos = gl.getAttribLocation(P1, 'aPos'), aNor = gl.getAttribLocation(P1, 'aNor'), aP = gl.getAttribLocation(P2, 'aP');
    var bufPos = gl.createBuffer(), bufNor = gl.createBuffer(), bufPart = gl.createBuffer();

    var R = { canvas: canvas, z: 0 }, cur = null, popT = 1, yaw = .6, pitch = .18, vyaw = AUTO, vpitch = 0, txS = 0, tyS = 0;
    var drag = false, lx = 0, ly = 0, lt = 0, parts = null, pvel = null, NPART = 150, size = 0;

    R.setZ = function (z, instant) {
      var d = T[z]; if (!d) return false;
      var kind = d[1], o = d[3] || {};
      var metal = o.metal !== undefined ? o.metal : (kind === 'metal' ? 1 : kind === 'unknown' ? .3 : 0);
      var rough = o.rough !== undefined ? o.rough : (kind === 'metal' ? .28 : kind === 'gas' ? 0 : kind === 'unknown' ? .6 : .4);
      var mesh = buildMesh(kind === 'gas' ? 'gasball' : kind, z, opt.lite);
      cur = { z: z, kind: kind, col: lin(hex(d[0])), metal: metal, rough: rough, mesh: mesh, raw: d[0] };
      gl.bindBuffer(gl.ARRAY_BUFFER, bufPos); gl.bufferData(gl.ARRAY_BUFFER, mesh.pos, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufNor); gl.bufferData(gl.ARRAY_BUFFER, mesh.nor, gl.STATIC_DRAW);
      if (kind === 'gas') {
        parts = new Float32Array(NPART * 3); pvel = new Float32Array(NPART * 3);
        for (var i = 0; i < NPART; i++) {
          var r = .8 * Math.cbrt(Math.random()), a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
          parts[i * 3] = r * Math.sin(b) * Math.cos(a); parts[i * 3 + 1] = r * Math.sin(b) * Math.sin(a); parts[i * 3 + 2] = r * Math.cos(b);
          pvel[i * 3] = (Math.random() - .5) * .02; pvel[i * 3 + 1] = (Math.random() - .5) * .02; pvel[i * 3 + 2] = (Math.random() - .5) * .02;
        }
      } else { parts = null; }
      popT = instant ? 1 : 0; R.z = z; return true;
    };
    R.pose = function (y, p) { yaw = y; pitch = p; };

    function resize() {
      var w = opt.size || Math.round(canvas.clientWidth * dprMax);
      if (w > 0 && w !== size) { size = w; canvas.width = w; canvas.height = w; }
      return size > 0;
    }

    R.draw = function (now, dt) {
      if (!cur || !resize()) return;
      if (!drag) {
        yaw += vyaw * dt; pitch = clamp(pitch + vpitch * dt, -1.45, 1.45);
        vyaw += (AUTO - vyaw) * (1 - Math.exp(-1.4 * dt));          /* momentum fades back to the slow turn */
        vpitch -= vpitch * (1 - Math.exp(-3 * dt));
        pitch += (.18 - pitch) * (1 - Math.exp(-.3 * dt));
      }
      var kk = 1 - Math.exp(-8 * dt); txS += (G.tx - txS) * kk; tyS += (G.ty - tyS) * kk;   /* phone tilt, smoothed */
      popT = Math.min(1, popT + dt / .45);
      var ease = 1 - Math.pow(1 - popT, 3);
      var sc = (.6 + .4 * ease) * .78 + (cur.kind === 'liquid' ? Math.sin(now / 600) * .02 : 0);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      var s = new Float32Array([sc, 0, 0, 0, 0, sc, 0, 0, 0, 0, sc, 0, 0, 0, 0, 1]);
      var model = mul(rotX(pitch + tyS), rotY(yaw + txS)), m = mul(model, s);
      var view = mul(persp(.62, 1, .1, 20), trans(0, 0, -4.4)), mvp = mul(view, m);
      var gas = cur.kind === 'gas';

      if (gas) {
        gl.disable(gl.DEPTH_TEST);
        var tint = hex(cur.raw);
        for (var i = 0; i < NPART; i++) {
          for (var k = 0; k < 3; k++) parts[i * 3 + k] += (reduce ? 0 : pvel[i * 3 + k] * dt * 60);
          var x = parts[i * 3], y = parts[i * 3 + 1], zz = parts[i * 3 + 2];
          if (x * x + y * y + zz * zz > .72) for (var q = 0; q < 3; q++) { pvel[i * 3 + q] = -pvel[i * 3 + q]; parts[i * 3 + q] *= .97; }
        }
        gl.useProgram(P2);
        gl.uniformMatrix4fv(U2.uMVP, false, mvp);
        gl.uniform1f(U2.uSize, canvas.width * .053);
        gl.uniform3f(U2.uCol, tint[0], tint[1], tint[2]);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufPart); gl.bufferData(gl.ARRAY_BUFFER, parts, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 0, 0);
        gl.blendFunc(gl.ONE, gl.ONE); gl.drawArrays(gl.POINTS, 0, NPART);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disableVertexAttribArray(aP);
      } else { gl.enable(gl.DEPTH_TEST); }

      gl.useProgram(P1);
      gl.uniformMatrix4fv(U1.uMVP, false, mvp);
      gl.uniformMatrix4fv(U1.uModel, false, m);
      gl.uniform3fv(U1.uCol, cur.col);
      gl.uniform1f(U1.uMetal, cur.metal); gl.uniform1f(U1.uRough, cur.rough);
      gl.uniform1f(U1.uAlpha, cur.kind === 'unknown' ? .6 : 1);
      gl.uniform1f(U1.uGlass, gas ? 1 : 0);
      gl.uniform3f(U1.uCam, 0, 0, 4.4);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufPos); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufNor); gl.enableVertexAttribArray(aNor); gl.vertexAttribPointer(aNor, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, cur.mesh.n);
      gl.disableVertexAttribArray(aPos); gl.disableVertexAttribArray(aNor);
    };

    if (opt.drag) {
      canvas.addEventListener('pointerdown', function (e) {
        drag = true; lx = e.clientX; ly = e.clientY; lt = performance.now(); vyaw = 0; vpitch = 0;
        try { canvas.setPointerCapture(e.pointerId); } catch (x) { }
        askTilt();
      });
      canvas.addEventListener('pointermove', function (e) {
        if (!drag) return;
        var t = performance.now(), dtm = Math.max(t - lt, 1), dx = e.clientX - lx, dy = e.clientY - ly;
        yaw += dx * .012; pitch = clamp(pitch + dy * .012, -1.45, 1.45);
        vyaw = .6 * (dx * .012 / dtm * 1000) + .4 * vyaw; vpitch = .6 * (dy * .012 / dtm * 1000) + .4 * vpitch;
        lx = e.clientX; ly = e.clientY; lt = t;
      });
      var up = function () {
        if (!drag) return; drag = false;
        if (performance.now() - lt > 90) { vyaw = AUTO; vpitch = 0; }          /* held still, then let go: no fling */
        vyaw = clamp(vyaw, -9, 9); vpitch = clamp(vpitch, -6, 6);
      };
      canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    }
    return R;
  }

  /* ---------- styles ---------- */
  var css = '' +
    '.mat-card{position:fixed;z-index:60;top:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;' +
    'width:min(330px,calc(100vw - 24px));padding:8px 18px 8px 8px;border-radius:20px;color:#e8f0ff;' +
    'font-family:var(--a3m-sans,system-ui,"Segoe UI",Roboto,Arial,sans-serif);' +
    'background:linear-gradient(135deg,rgba(24,36,66,.62),rgba(10,16,34,.62));border:1px solid rgba(160,190,255,.18);' +
    '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,.35);touch-action:none}' +
    '.mat-card[hidden],.mat-modal[hidden]{display:none}' +
    '.mat-cv{flex:none;width:132px;height:132px;cursor:grab;border-radius:16px}.mat-cv:active{cursor:grabbing}' +
    '.mat-txt{min-width:0;line-height:1.3}' +
    '.mat-kick{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#3de0c4;font-weight:700;margin-bottom:4px}' +
    '.mat-name{font-size:22px;font-weight:800;letter-spacing:-.01em}.mat-name small{font-size:14px;font-weight:600;color:#9fb3d9;margin-left:6px}' +
    '.mat-desc{font-size:13px;color:#c7d6f2;margin-top:3px}' +
    '.mat-row{display:flex;align-items:center;gap:10px;margin-top:8px;flex-wrap:wrap}.mat-hint{font-size:11px;color:#7f92b8}' +
    '.mat-open{font:600 12px/1 inherit;font-family:inherit;color:#06251f;background:#3de0c4;border:0;border-radius:999px;padding:7px 12px;cursor:pointer}' +
    '.mat-open.alt{color:#e8f0ff;background:rgba(255,255,255,.1);border:1px solid rgba(160,190,255,.25)}.mat-open.alt:hover{background:rgba(255,255,255,.2)}.mat-open:hover{background:#6af0d8}.mat-open:focus-visible,.mat-x:focus-visible,.mat-nav:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.mat-credit{position:fixed;z-index:5;left:0;right:0;bottom:5px;margin:0;text-align:center;font:11px/1.3 system-ui,Arial,sans-serif;color:rgba(190,205,235,.55);pointer-events:none}' +
    '.mat-credit a{color:inherit;pointer-events:auto}' +
    /* big specimen panel */
    '.mat-modal{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(3,6,16,.72);' +
    '-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font-family:var(--a3m-sans,system-ui,"Segoe UI",Roboto,Arial,sans-serif);color:#e8f0ff}' +
    '.mat-sheet{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:8px;width:min(760px,100%);max-height:calc(100vh - 32px);overflow:auto;' +
    'padding:22px 56px 18px;border-radius:26px;background:linear-gradient(145deg,#16223f,#0a1126);border:1px solid rgba(160,190,255,.2);box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
    '.mat-stage{display:flex;align-items:center;justify-content:center}' +
    '.mat-big{width:100%;max-width:340px;aspect-ratio:1;cursor:grab;touch-action:none}.mat-big:active{cursor:grabbing}' +
    '.mat-info{min-width:0;align-self:center}.mat-zrow{display:flex;align-items:baseline;gap:10px}' +
    '.mat-z{font-size:15px;font-weight:700;color:#3de0c4}.mat-h{margin:0;font-size:34px;line-height:1.1;font-weight:800}' +
    '.mat-sub{margin:4px 0 14px;font-size:14px;color:#9fb3d9}' +
    '.mat-dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:0;font-size:14px}' +
    '.mat-dl dt,.mat-dl dd{margin:0;padding:8px 0;border-top:1px solid rgba(160,190,255,.14)}.mat-dl dt{color:#8fa4cc;padding-right:14px}.mat-dl dd{text-align:right;font-weight:600}' +
    '.mat-foot{grid-column:1/-1;margin:8px 0 0;font-size:11px;line-height:1.45;color:#7f92b8}.mat-foot a{color:inherit}' +
    '.mat-x,.mat-nav{position:absolute;border:1px solid rgba(160,190,255,.22);background:rgba(255,255,255,.06);color:#e8f0ff;cursor:pointer;border-radius:50%;width:38px;height:38px;font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center}' +
    '.mat-x:hover,.mat-nav:hover{background:rgba(255,255,255,.14)}.mat-x{top:12px;right:12px}.mat-nav.prev{left:10px;top:50%;margin-top:-19px}.mat-nav.next{right:10px;top:50%;margin-top:-19px}' +
    /* thumbnails in the periodic table */
    '.a3m-pt-el.mat-on{position:relative}' +
    '.a3m-pt-el.mat-on .mat-th{position:absolute;left:50%;top:13px;width:31px;height:31px;margin-left:-15.5px;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}' +
    '.a3m-pt-el.mat-on b{position:absolute;top:3px;right:5px;font-size:10.5px;line-height:1}' +
    '.a3m-pt-el.mat-on span{position:absolute;left:0;right:0;bottom:2px;text-align:center}' +
    '@media (max-width:900px){.mat-card{top:38px;left:12px;transform:none;width:auto;max-width:calc(100vw - 24px);padding:6px 16px 6px 6px}' +
    '.mat-cv{width:84px;height:84px}.mat-name{font-size:17px}.mat-name small{font-size:12px}.mat-desc{font-size:12px}.mat-hint{display:none}.mat-kick{font-size:9.5px;margin-bottom:2px}' +
    '.mat-row{margin-top:5px}.mat-credit{top:4px;bottom:auto;font-size:10px}' +
    '.mat-sheet{grid-template-columns:1fr;padding:46px 18px 16px}.mat-big{max-width:230px}.mat-h{font-size:28px}.mat-nav.prev{left:8px;top:150px;margin-top:0}.mat-nav.next{right:8px;top:150px;margin-top:0}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- compact card ---------- */
  var card = document.createElement('div');
  card.className = 'mat-card'; card.setAttribute('role', 'group'); card.setAttribute('aria-label', 'Vật liệu thật của nguyên tố');
  card.innerHTML = '<canvas class="mat-cv" aria-hidden="true"></canvas><div class="mat-txt"><div class="mat-kick">Vật liệu thật</div>' +
    '<div class="mat-name"><span data-mat-name>Hiđro</span><small data-mat-sym>H</small></div>' +
    '<div class="mat-desc" data-mat-desc></div><div class="mat-row"><button type="button" class="mat-open" data-mat-open>Phóng to ⤢</button>' +
    '<button type="button" class="mat-open alt" data-mat-table>▦ Bảng</button><span class="mat-hint">kéo để xoay</span></div></div>';
  document.body.appendChild(card);
  var small = createRenderer(card.querySelector('canvas'), { drag: true });
  if (!small) { card.hidden = true; return; }

  /* ---------- big specimen panel ---------- */
  var modal = document.createElement('div');
  modal.className = 'mat-modal'; modal.hidden = true; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', 'Mẫu vật nguyên tố');
  modal.innerHTML = '<div class="mat-sheet">' +
    '<button type="button" class="mat-x" data-mat-close aria-label="Đóng">×</button>' +
    '<button type="button" class="mat-nav prev" data-mat-prev aria-label="Nguyên tố trước">‹</button>' +
    '<button type="button" class="mat-nav next" data-mat-next aria-label="Nguyên tố sau">›</button>' +
    '<div class="mat-stage"><canvas class="mat-big" aria-label="Mẫu vật 3D, kéo để xoay"></canvas></div>' +
    '<div class="mat-info"><div class="mat-zrow"><span class="mat-z" data-b-z></span></div><h2 class="mat-h" data-b-name></h2><p class="mat-sub" data-b-sub></p>' +
    '<dl class="mat-dl" data-b-dl></dl></div>' +
    '<p class="mat-foot">Hình mẫu vật là mô phỏng 3D, không phải ảnh thật. Khối lượng riêng, nhiệt độ nóng chảy và sôi ở áp suất 1 atm (khí: khối lượng riêng ở 0 °C), nguồn: ' +
    '<a href="https://github.com/Bowserinator/Periodic-Table-JSON" rel="noopener">Periodic-Table-JSON</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" rel="noopener">CC BY-SA 3.0</a>, từ Wikipedia). ' +
    'Ý tưởng lấy cảm hứng từ ứng dụng <em>The Elements</em> của Theodore Gray.</p></div>';
  document.body.appendChild(modal);
  var big = createRenderer(modal.querySelector('canvas'), { drag: true });
  var modalOpen = false, lastFocus = null;

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function rowsFor(z) {
    var d = T[z], f = FACTS[z - 1] || [], kind = d ? d[1] : 'unknown', gas = kind === 'gas';
    var state = kind === 'gas' ? 'Khí' : kind === 'liquid' ? 'Lỏng' : kind === 'unknown' ? 'Chưa rõ' : 'Rắn';
    var rows = [['Trạng thái (20 °C)', state], ['Màu sắc', d && d[2] ? d[2] : '—']];
    rows.push(['Khối lượng nguyên tử', f[0] != null ? mass(f[0]) + ' u' : '—']);
    rows.push(['Khối lượng riêng', f[1] != null ? num(f[1]) + (gas ? ' g/L' : ' g/cm³') : '—']);
    rows.push(['Nóng chảy', z === 6 ? '— (nóng chảy khi nén mạnh)' : f[2] != null ? celsius(f[2]) : '—']);
    rows.push(['Sôi', z === 6 ? 'thăng hoa ≈ 3 640 °C' : f[3] != null ? celsius(f[3]) : '—']);
    if (z >= 100) rows.push(['Ghi chú', 'giá trị ước tính']);
    return rows;
  }

  function fillTexts() {
    var z = small.z; if (!z) return;
    var nm = document.querySelector('[data-a3m-curname]'), sy = document.querySelector('[data-a3m-cursym]');
    var name = nm ? nm.textContent.trim() : '', sym = sy ? sy.textContent.trim() : '';
    var d = T[z], kind = d ? d[1] : 'unknown';
    var state = kind === 'gas' ? 'Khí' : kind === 'liquid' ? 'Lỏng' : 'Rắn';
    card.querySelector('[data-mat-name]').textContent = name; card.querySelector('[data-mat-sym]').textContent = sym;
    card.querySelector('[data-mat-desc]').textContent = kind === 'unknown' ? NOTE_UNKNOWN : state + ' · ' + (d[2] || '');
    if (modalOpen) {
      var cat = document.querySelector('[data-el-cat]');
      modal.querySelector('[data-b-z]').textContent = 'Số hiệu ' + z;
      modal.querySelector('[data-b-name]').textContent = name;
      modal.querySelector('[data-b-sub]').textContent = sym + (cat && cat.textContent.trim() ? ' · ' + cat.textContent.trim() : '');
      modal.querySelector('[data-b-dl]').innerHTML = rowsFor(z).map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    }
  }

  function selectZ(z) {
    if (z < 1) z = 118; if (z > 118) z = 1;
    var b = document.querySelector('.a3m-pt-el[data-z="' + z + '"]');
    if (b) b.click();
  }
  function openModal() {
    if (!big) return;
    lastFocus = document.activeElement; modal.hidden = false; modalOpen = true;
    big.setZ(small.z); fillTexts();
    var x = modal.querySelector('[data-mat-close]'); if (x) x.focus();
  }
  function closeModal() { modal.hidden = true; modalOpen = false; if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  card.querySelector('[data-mat-open]').addEventListener('click', openModal);
  function openTable() { var b = document.querySelector('[data-a3m-ptopen]'); if (b) b.click(); }
  card.querySelector('[data-mat-table]').addEventListener('click', openTable);
  /* the periodic table of samples is the first screen after the cover */
  window.addEventListener('cover-left', function () { setTimeout(openTable, 250); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  modal.querySelector('[data-mat-close]').addEventListener('click', closeModal);
  modal.querySelector('[data-mat-prev]').addEventListener('click', function () { selectZ(small.z - 1); });
  modal.querySelector('[data-mat-next]').addEventListener('click', function () { selectZ(small.z + 1); });
  document.addEventListener('keydown', function (e) {
    if (!modalOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeModal(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); selectZ(small.z - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); selectZ(small.z + 1); }
  }, true);

  /* ---------- follow the selected element ---------- */
  function readElement() {
    var zEl = document.querySelector('[data-a3m-curz]');
    var z = zEl ? parseInt(zEl.textContent, 10) : NaN;
    if (z && T[z] && small.z !== z) {
      card.hidden = false; small.setZ(z); if (modalOpen && big) big.setZ(z);
    } else if (z && !T[z]) { card.hidden = true; }
    fillTexts();
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

  /* ---------- sample thumbnails on the periodic table ---------- */
  var thumbsStarted = false;
  function makeThumbs() {
    if (thumbsStarted) return; thumbsStarted = true;
    var cvs = document.createElement('canvas'); cvs.width = cvs.height = 64;
    var tr = createRenderer(cvs, { size: 64, preserve: true, lite: true });
    if (!tr) return;
    var z = 1;
    (function step() {
      var t0 = performance.now();
      while (z <= 118 && performance.now() - t0 < 12) {
        var tile = document.querySelector('.a3m-pt-el[data-z="' + z + '"]');
        if (tile && T[z] && !tile.querySelector('.mat-th')) {
          tr.setZ(z, true); tr.pose(.55, .22); tr.draw(0, 0);
          var img = new Image(); img.className = 'mat-th'; img.alt = ''; img.src = cvs.toDataURL('image/png');
          tile.classList.add('mat-on'); tile.appendChild(img);
        }
        z++;
      }
      if (z <= 118) requestAnimationFrame(step);
    })();
  }
  function watchTable() {
    var dlg = document.querySelector('dialog.a3m-ptm');
    var opener = document.querySelector('[data-a3m-ptopen]');
    if (opener) opener.addEventListener('click', makeThumbs);
    if (dlg) { new MutationObserver(function () { if (dlg.open) makeThumbs(); }).observe(dlg, { attributes: true, attributeFilter: ['open'] }); if (dlg.open) makeThumbs(); }
    if (!dlg && !opener) setTimeout(watchTable, 400);
  }

  /* ---------- frame loop ---------- */
  var last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min((now - last) / 1000, .05); last = now;
    tiltTick(dt);
    if (!card.hidden) small.draw(now, dt);
    if (modalOpen && big) big.draw(now, dt);
  }
  requestAnimationFrame(frame);
  function init() { start(); watchTable(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
