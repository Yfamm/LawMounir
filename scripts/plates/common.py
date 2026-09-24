"""Shared helpers for the procedural architectural plates."""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

f32 = np.float32


def norm(v):
    return v / np.linalg.norm(v, axis=-1, keepdims=True)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def hash2(a, b):
    return np.modf(np.abs(np.sin(a * 127.1 + b * 311.7) * 43758.5453))[0]


def hash3(a, b, c):
    return np.modf(np.abs(np.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453))[0]


def vnoise3(p):
    i = np.floor(p)
    f = p - i
    u = f * f * (3 - 2 * f)
    ix, iy, iz = i[..., 0], i[..., 1], i[..., 2]
    ux, uy, uz = u[..., 0], u[..., 1], u[..., 2]

    def h(dx, dy, dz):
        return hash3(ix + dx, iy + dy, iz + dz)

    x00 = h(0, 0, 0) * (1 - ux) + h(1, 0, 0) * ux
    x10 = h(0, 1, 0) * (1 - ux) + h(1, 1, 0) * ux
    x01 = h(0, 0, 1) * (1 - ux) + h(1, 0, 1) * ux
    x11 = h(0, 1, 1) * (1 - ux) + h(1, 1, 1) * ux
    y0 = x00 * (1 - uy) + x10 * uy
    y1 = x01 * (1 - uy) + x11 * uy
    return y0 * (1 - uz) + y1 * uz


def fbm3(p, octaves=4):
    s, a = 0.0, 0.5
    for _ in range(octaves):
        s = s + a * vnoise3(p)
        p = p * 2.03 + 1.7
        a *= 0.5
    return s


def aces(x):
    a, b, c, d, e = 2.51, 0.03, 2.43, 0.59, 0.14
    return np.clip((x * (a * x + b)) / (x * (c * x + d) + e), 0, 1)


def finish(hdr, path, exposure=1.0, bloom=0.18, vignette=0.55, grain=0.035, lift=0.0, warmth=(1.0, 0.97, 0.9),
           quality=84, out_width=None):
    """Film-style finish: bloom, filmic curve, warm split grade, vignette, grain."""
    h, w, _ = hdr.shape
    img = hdr * exposure
    if bloom:
        bright = np.clip(img - 0.9, 0, None)
        glow = np.stack([gaussian_filter(bright[..., k], sigma=w * 0.012) for k in range(3)], -1)
        glow2 = np.stack([gaussian_filter(bright[..., k], sigma=w * 0.04) for k in range(3)], -1)
        img = img + bloom * glow + bloom * 0.6 * glow2
    img = aces(img)
    # warm highlights, neutral-cool shadows kept near black
    lum = img.mean(-1, keepdims=True)
    tint = np.array(warmth, dtype=f32)
    img = img * (1 - lum * 0.35) + img * tint * (lum * 0.35)
    img = lift + img * (1 - lift)
    yy, xx = np.mgrid[0:h, 0:w].astype(f32)
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    img = img * (1 - vignette * smoothstep(0.55, 1.45, r))[..., None]
    rng = np.random.default_rng(7)
    img = img + (rng.standard_normal((h, w, 1)).astype(f32) * grain) * (0.4 + 0.6 * (1 - lum))
    img = np.clip(img, 0, 1) ** (1 / 1.0)
    im = Image.fromarray((img * 255 + 0.5).astype(np.uint8))
    if out_width and out_width != w:
        im = im.resize((out_width, int(h * out_width / w)), Image.LANCZOS)
    im.save(path, quality=quality, method=6)
    return im


def camera_rays(w, h, pos, target, fov_deg=50, roll=0.0):
    fwd = norm(np.array(target, f32) - np.array(pos, f32))
    up = np.array([np.sin(roll), np.cos(roll), 0], f32)
    right = norm(np.cross(fwd, up))
    up = np.cross(right, fwd)
    aspect = w / h
    t = np.tan(np.radians(fov_deg) / 2)
    ys, xs = np.mgrid[0:h, 0:w].astype(f32)
    u = ((xs + 0.5) / w * 2 - 1) * t * aspect
    v = (1 - (ys + 0.5) / h * 2) * t
    d = fwd[None, None] + u[..., None] * right[None, None] + v[..., None] * up[None, None]
    return norm(d.astype(f32))


def march(sdf, ro, rd, tmax=150.0, steps=160, eps=0.004, scale=0.85):
    n = rd.shape[0]
    t = np.zeros(n, f32)
    done = np.zeros(n, bool)
    for _ in range(steps):
        idx = np.nonzero(~done)[0]
        if idx.size == 0:
            break
        p = ro[idx] + rd[idx] * t[idx, None]
        d = sdf(p)
        t[idx] += d * scale
        hit = (d < eps * np.maximum(t[idx], 1)) | (t[idx] > tmax)
        done[idx[hit]] = True
    return np.minimum(t, tmax)


def normals(sdf, p, e=0.01):
    ex = np.array([e, 0, 0], f32)
    ey = np.array([0, e, 0], f32)
    ez = np.array([0, 0, e], f32)
    n = np.stack([sdf(p + ex) - sdf(p - ex), sdf(p + ey) - sdf(p - ey), sdf(p + ez) - sdf(p - ez)], -1)
    return norm(n + 1e-9)


def soft_shadow(sdf, p, L, tmax, steps=48, k=10.0):
    n = p.shape[0]
    res = np.ones(n, f32)
    t = np.full(n, 0.05, f32)
    active = np.ones(n, bool)
    for _ in range(steps):
        idx = np.nonzero(active)[0]
        if idx.size == 0:
            break
        q = p[idx] + L[None] * t[idx, None]
        d = sdf(q)
        res[idx] = np.minimum(res[idx], k * d / t[idx])
        t[idx] += np.clip(d, 0.04, 1.5)
        stop = (d < 0.001) | (t[idx] > tmax[idx])
        active[idx[stop]] = False
    return np.clip(res, 0, 1)


def ao(sdf, p, n, samples=5, step=0.35):
    occ = np.zeros(p.shape[0], f32)
    w = 1.0
    for i in range(1, samples + 1):
        h = step * i
        d = sdf(p + n * h)
        occ += w * (h - d)
        w *= 0.6
    return np.clip(1 - 0.55 * occ, 0, 1)
