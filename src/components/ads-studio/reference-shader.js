/* Original Ads Studio WebGL renderer, preserved from the public reference asset
 * https://assets.higgsfield.ai/tanstack/assets/01bd19df-Ix6gWr_L23tcPIeb.js
 * React wrappers removed; rendering equations and glyph atlas are unchanged. */
var _, v, y, b, x, S, C, w, T, E;
function o(e) { let t = /^#([0-9a-f]{6})$/i.exec(e.trim()); if (!t)
    throw Error(`Background colours must be #rrggbb, got "${e}".`); return [0, 2, 4].map(e => parseInt(t[1].slice(e, e + 2), 16) / 255); }
function s(e, t, n, r = 1 / 0) { var i, a; let o = e.autoplay !== !1, s = window.matchMedia(`(prefers-reduced-motion: reduce)`), c = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`), l = window.devicePixelRatio || 1, u = t.clientWidth, d = t.clientHeight, f = !0, p = !1, m = !1, h = +(e.theme === `light`), g = h, _ = 0, v = 0, y = 0, b = null; function x() { return !m && !p && !document.hidden && f && u > 0 && d > 0; } function S() { let e = Math.min(l, 2, Math.sqrt(w / (u * d)), r / u, r / d), n = Math.max(1, Math.floor(u * e)), i = Math.max(1, Math.floor(d * e)); return (t.width !== n || t.height !== i) && (t.width = n, t.height = i), n / u; } function C(e) { if (!m && (y = e, x()))
    try {
        n.draw(e, g, S());
    }
    catch (e) {
        T(e);
    } } function T(t) { F(); let n = t instanceof Error ? t : Error(String(t)); e.onError ? e.onError(n) : console.error(n); } function D() { !_ && x() && (_ = requestAnimationFrame(k)); } function O() { x() ? D() : (cancelAnimationFrame(_), _ = 0, b = null); } function k(e) { if (_ = 0, !x()) {
    b = null;
    return;
} let t = b === null ? 0 : Math.min((e - b) / 1e3, .1); b = e, o && (s.matches || (v += t), g += (h - g) * (1 - Math.exp(-t * E)), Math.abs(h - g) < .002 && (g = h)), C(o ? v : y), o && (!s.matches || g !== h) ? D() : b = null; } function A() { if (m)
    return; let e = window.devicePixelRatio || 1; l !== e && (l = e, c.removeEventListener(`change`, A), c = window.matchMedia(`(resolution: ${e}dppx)`), c.addEventListener(`change`, A), O()); } let j = new ResizeObserver(([e]) => { if (m || !e)
    return; let t = e.contentRect; (u !== t.width || d !== t.height) && (u = t.width, d = t.height, O()); }), M = new IntersectionObserver(e => { let t = e.at(-1); !m && t && f !== t.isIntersecting && (f = t.isIntersecting, O()); }); function N(e) { e.preventDefault(), p = !0, O(); } function P() { p = !1; try {
    n.restore();
}
catch (e) {
    T(e);
    return;
} O(); } function F() { var r; m || (m = !0, cancelAnimationFrame(_), _ = 0, j.disconnect(), M.disconnect(), c.removeEventListener(`change`, A), s.removeEventListener(`change`, O), document.removeEventListener(`visibilitychange`, O), window.removeEventListener(`resize`, A), t.removeEventListener(`webglcontextlost`, N), t.removeEventListener(`webglcontextrestored`, P), (r = e.signal) == null || r.removeEventListener(`abort`, F), n.release()); } return j.observe(t), M.observe(t), c.addEventListener(`change`, A), s.addEventListener(`change`, O), document.addEventListener(`visibilitychange`, O), window.addEventListener(`resize`, A), t.addEventListener(`webglcontextlost`, N), t.addEventListener(`webglcontextrestored`, P), (i = e.signal) == null || i.addEventListener(`abort`, F, { once: !0 }), (a = e.signal) != null && a.aborted ? F() : D(), { setTheme(e) { m || (h = +(e === `light`), o ? O() : (g = h, C(y))); }, render: C, destroy: F }; }
function c(e, t, n, r) { let i = e.createShader(n); if (!i)
    throw Error(`WebGL could not create a shader object.`); if (e.shaderSource(i, r), e.compileShader(i), !e.getShaderParameter(i, e.COMPILE_STATUS))
    throw Error(`Shader failed to compile: ${e.getShaderInfoLog(i)}`); e.attachShader(t, i), e.deleteShader(i); }
function l(e, t) { let n = e.createProgram(); if (!n)
    throw Error(`WebGL could not create a program.`); if (c(e, n, e.VERTEX_SHADER, _), c(e, n, e.FRAGMENT_SHADER, t), e.linkProgram(n), !e.getProgramParameter(n, e.LINK_STATUS))
    throw Error(`Shader failed to link: ${e.getProgramInfoLog(n)}`); return n; }
function u(e, t, n) { return Object.fromEntries(n.map(n => [n, e.getUniformLocation(t, n)])); }
function d() { let e = x.width * 10, t = x.height, n = document.createElement(`canvas`); n.width = e, n.height = t; let r = n.getContext(`2d`, { willReadFrequently: !0 }); if (!r)
    throw Error(`A 2D canvas context is needed to draw the glyph atlas.`); r.fillStyle = `#000`, r.fillRect(0, 0, e, t), r.fillStyle = `#fff`, r.textAlign = `center`, r.textBaseline = `middle`, r.font = C; for (let e = 0; e < 10; e++)
    r.fillText(b[e], e * x.width + x.width / 2, t / 2 + t * .04); let i = [r.getImageData(0, 0, e, t).data]; for (let n = 1, r = e, a = t; n < S; n++) {
    let e = i[n - 1], t = new Uint8ClampedArray(r / 2 * (a / 2) * 4);
    for (let n = 0; n < a / 2; n++)
        for (let i = 0; i < r / 2; i++) {
            let a = (n * 2 * r + i * 2) * 4, o = a + 4, s = a + r * 4, c = s + 4;
            for (let l = 0; l < 4; l++)
                t[(r / 2 * n + i) * 4 + l] = e[a + l] + e[o + l] + e[s + l] + e[c + l] + 2 >> 2;
        }
    i.push(t), r /= 2, a /= 2;
} return { width: e, height: t, levels: i }; }
function f(e) { let t = d(), n = e.createTexture(); return e.bindTexture(e.TEXTURE_2D, n), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, 1), t.levels.forEach((n, r) => { e.texImage2D(e.TEXTURE_2D, r, e.RGBA, t.width >> r, t.height >> r, 0, e.RGBA, e.UNSIGNED_BYTE, n); }), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, 0), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAX_LEVEL, t.levels.length - 1), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), n; }
function p(e) { let t = l(e, v), n = u(e, t, [`iResolution`, `iTime`, `uLightMode`, `uDarkBackground`, `uLightBackground`]), r = l(e, y), i = u(e, r, [`tScene`, `tGlyphs`, `iResolution`, `iTime`, `uLightMode`, `uDarkBackground`, `uLightBackground`, `uPixelRatio`]), a = e.createFramebuffer(), o = e.createTexture(); return e.bindTexture(e.TEXTURE_2D, o), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), { field: t, fieldUniforms: n, post: r, postUniforms: i, framebuffer: a, scene: o, sceneWidth: 0, sceneHeight: 0, glyphs: f(e) }; }
function m(e, t = {}) { var n, r, i, a; let c = e.getContext(`webgl2`, { alpha: !1, antialias: !1, depth: !1, stencil: !1 }); if (!c)
    throw Error(`WebGL2 is not available in this browser.`); let l = o((n = (r = t.background) == null ? void 0 : r.dark) == null ? `#090909` : n), u = o((i = (a = t.background) == null ? void 0 : a.light) == null ? `#ffffff` : i), d = p(c), f = (e, t, n, r, i) => { c.uniform2f(e.iResolution, r, i), c.uniform1f(e.iTime, t), c.uniform1f(e.uLightMode, n), c.uniform3fv(e.uDarkBackground, l), c.uniform3fv(e.uLightBackground, u); }; return s(t, e, { draw: (t, n, r) => { let { field: i, fieldUniforms: a, post: o, postUniforms: s, framebuffer: l, scene: u, glyphs: p } = d, { width: m, height: h } = e, g = Math.min(1, Math.sqrt(T / (m * h))), _ = Math.max(1, Math.floor(m * g)), v = Math.max(1, Math.floor(h * g)); (d.sceneWidth !== _ || d.sceneHeight !== v) && (d.sceneWidth = _, d.sceneHeight = v, c.activeTexture(c.TEXTURE0), c.bindTexture(c.TEXTURE_2D, u), c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, _, v, 0, c.RGBA, c.UNSIGNED_BYTE, null), c.bindFramebuffer(c.FRAMEBUFFER, l), c.framebufferTexture2D(c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, u, 0), c.bindFramebuffer(c.FRAMEBUFFER, null)); let y = e => { c.bindFramebuffer(c.FRAMEBUFFER, l), c.viewport(0, 0, _, v), c.useProgram(i), f(a, t, e, _, v), c.drawArrays(c.TRIANGLES, 0, 3), c.bindFramebuffer(c.FRAMEBUFFER, null), c.viewport(0, 0, m, h), c.useProgram(o), f(s, t, e, m, h), c.uniform1f(s.uPixelRatio, r), c.activeTexture(c.TEXTURE0), c.bindTexture(c.TEXTURE_2D, u), c.uniform1i(s.tScene, 0), c.activeTexture(c.TEXTURE1), c.bindTexture(c.TEXTURE_2D, p), c.uniform1i(s.tGlyphs, 1), c.drawArrays(c.TRIANGLES, 0, 3); }; n <= 0 || n >= 1 ? y(n) : (y(0), c.enable(c.BLEND), c.blendColor(0, 0, 0, n), c.blendFunc(c.CONSTANT_ALPHA, c.ONE_MINUS_CONSTANT_ALPHA), y(1), c.disable(c.BLEND)); }, restore: () => { d = p(c); }, release: () => { var t; c.deleteProgram(d.field), c.deleteProgram(d.post), c.deleteFramebuffer(d.framebuffer), c.deleteTexture(d.scene), c.deleteTexture(d.glyphs), e.isConnected || (t = c.getExtension(`WEBGL_lose_context`)) == null || t.loseContext(); } }, Math.min(c.getParameter(c.MAX_TEXTURE_SIZE), c.getParameter(c.MAX_RENDERBUFFER_SIZE))); }
_ = `#version 300 es
void main() {
  vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}
`;
v = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
out vec4 fragColor;

const float HUE = 0.477657557;
const float HUE_SPREAD = 0.466392517;
const float HUE_TRAVEL = 2.19353557;
const float CHROMA = 0.0826955885;
const float LIGHTNESS = 0.605422735;
const float COLOUR_CYCLE = 0.176071271;
const float THETA = 2.12341928;
const float SHEAR = 0.967681348;
const float SHRINK = 0.946786463;
const float LAYERS = 81.0;
const float WARP_FREQ_X = 0.473849267;
const float WARP_FREQ_Y = 2.58443379;
const float WARP_AMP_X = 0.151704207;
const float WARP_AMP_Y = 0.0200081579;
const float ASPECT_X = 2.57895756;
const float ASPECT_Y = 0.164377093;
const float OFFSET_X = 0.342980981;
const float OFFSET_Y = -0.0112323957;
const float TILT = -2.80319786;
const float ZOOM = 1.08432472;
const float CENTRE_X = 0.207393199;
const float CENTRE_Y = 0.665306985;
const float GLOW_SIZE = 0.00155267201;
const float FALLOFF = 0.265273809;
const float VIGNETTE = 0.120154113;
const float FLOW_SPEED = 0.443953097;
const float FLOW_DIRECTION = -1.0;
const float BREATH_RATE = 0.414085954;
const float BREATH_AMOUNT = 0.0788669065;
const float PHASE = 66.6956635;
const float ECHO = 0.0;
const float ECHO_SHIFT = 0.157066181;
const float SOFTNESS = 0.001665305;
const float LIGHT_SWING = 0.214426324;

const float TAU = 6.28318530718;

vec3 oklchToLinear(float L, float C, float h) {
  float a = C * cos(h), b = C * sin(h);
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  vec3 lms = vec3(l_, m_, s_);
  lms = lms * lms * lms;
  return mat3(4.0767416621, -1.2684380046, -0.0041960863,
              -3.3077115913, 2.6097574011, -0.7034186147,
              0.2309699292, -0.3413193965, 1.7076147010) * lms;
}

float blueNoise(vec2 p, float frame) {
  p += 5.588238 * mod(frame, 64.0);
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

void main() {
  vec2 R = iResolution.xy;
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.y;
  float t = iTime * FLOW_SPEED * FLOW_DIRECTION + PHASE;
  float breath = (-sin(iTime * BREATH_RATE * 1.5) + sin(iTime * BREATH_RATE + 1.0)) * 0.25 + 0.5;

  vec2 u = (pos - vec2(CENTRE_X, CENTRE_Y)) * (ZOOM - breath * BREATH_AMOUNT);
  float ct = cos(TILT), st = sin(TILT);
  u = mat2(ct, st, -st, ct) * u;

  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

  float hue0 = HUE * TAU;
  float hue1 = hue0 + HUE_SPREAD * TAU;
  vec3 color = vec3(0.0);

  for (float i = 1.0; i <= 96.0; i += 1.0) {
    if (i > LAYERS) break;
    u.x += -sin(u.y * WARP_FREQ_X + t + i * 0.007) * WARP_AMP_X;
    u.y += -sin(u.x * WARP_FREQ_Y - t + i * 0.02) * WARP_AMP_Y;
    u = fold * u * SHRINK;

    vec2 q = u - vec2(OFFSET_X + breath * 0.1, OFFSET_Y);
    vec2 s = vec2(q.x * ASPECT_X, q.y * ASPECT_Y);
    float glow = GLOW_SIZE / (dot(s, s) + SOFTNESS);
#ifndef SKIP_ECHO
    vec2 e = vec2((q.x - ECHO_SHIFT) * ASPECT_X, s.y);
    glow += ECHO * GLOW_SIZE / (dot(e, e) + SOFTNESS);
#endif
    glow *= 0.25 + breath * 0.4;

    float r = length(u);
    float k = sin(i * COLOUR_CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    vec3 tint = clamp(oklchToLinear(LIGHTNESS + LIGHT_SWING * k, CHROMA * (0.75 + 0.35 * k), mix(hue0, hue1, k)), 0.0, 1.0);
    color += glow * tint * exp2(-r * FALLOFF);
  }

  vec3 x = max(color, 0.0);
  color = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  color = pow(clamp(color, 0.0, 1.0), vec3(0.85, 0.92, 0.98));

  float edge = smoothstep(0.5, 1.6, length(pos));
  color *= 1.0 - edge * VIGNETTE;

  vec3 dark = uDarkBackground + color * (1.0 - uDarkBackground);
  float strength = max(color.r, max(color.g, color.b));
  vec3 light = uLightBackground * (1.0 - strength) + color * 0.96;
  color = mix(dark, light, uLightMode);

  color += (blueNoise(gl_FragCoord.xy, floor(iTime * 24.0)) - 0.5) / 255.0;
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;
y = `#version 300 es
precision highp float;

uniform sampler2D tScene;
uniform sampler2D tGlyphs;
uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
uniform float uPixelRatio;
out vec4 fragColor;

const float uStrength = 1.26609457;
const float uScale = 1.14603078;
const float uSeed = 0.154316574;
const float uGlyphCount = 10.0;

const float TAU = 6.28318530718;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

vec3 toInk(vec3 c) { return mix(c - uDarkBackground, uLightBackground - c, uLightMode); }
vec3 fromInk(vec3 ink) { return mix(uDarkBackground + ink, uLightBackground - ink, uLightMode); }
vec3 sceneInk(vec2 uv) { return toInk(texture(tScene, clamp(uv, 0.0, 1.0)).rgb); }

vec3 ascii(vec2 frag) {
  vec2 cellPx = vec2(0.62, 1.0) * floor(uScale * 9.0 * uPixelRatio + 0.5);
  vec2 cell = floor(frag / cellPx);
  vec2 centre = (cell + 0.5) * cellPx;
  vec3 ink = vec3(0.0);
  ink += sceneInk(centre / iResolution) * 2.0;
  ink += sceneInk((centre + cellPx * vec2(0.3, 0.3)) / iResolution);
  ink += sceneInk((centre + cellPx * vec2(-0.3, 0.3)) / iResolution);
  ink += sceneInk((centre + cellPx * vec2(0.3, -0.3)) / iResolution);
  ink += sceneInk((centre + cellPx * vec2(-0.3, -0.3)) / iResolution);
  ink /= 6.0;
  float level = pow(clamp(dot(ink, LUMA) * (0.9 + 0.3 * uStrength), 0.0, 1.0), 0.9);
  float glyph = floor(level * (uGlyphCount - 1.0) + 0.5);
  vec2 local = (frag - cell * cellPx) / cellPx;
  vec2 atlas = vec2((glyph + local.x) / uGlyphCount, local.y);
  float mask = texture(tGlyphs, atlas).r;
  vec3 under = sceneInk(frag / iResolution) * 0.45;
  return under + ink * mask * (1.0 + 0.7 * uLightMode);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 ink = ascii(frag);
  vec3 color = fromInk(clamp(ink, 0.0, 1.0));
  color = vec3(dot(color, LUMA));
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;
b = ` .:;+*oO8@`;
x = { width: 48, height: 80 };
S = 5;
C = `500 62px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
w = 24e5;
T = 15e4;
E = 7;
export { m as createReferenceShader };
