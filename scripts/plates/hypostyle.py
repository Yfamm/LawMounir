"""Hypostyle hall: papyrus-bundle columns, carved registers, sun shafts through the roof."""
import sys
import time
import numpy as np
from common import *

W = int(sys.argv[1]) if len(sys.argv) > 1 else 1200
H_IMG = int(W * 9 / 16) if len(sys.argv) <= 2 else int(sys.argv[2])
OUT = sys.argv[3] if len(sys.argv) > 3 else "hypostyle.webp"
VARIANT = sys.argv[4] if len(sys.argv) > 4 else "aisle"

S = 8.4          # column spacing
R = 1.3          # shaft radius
HT = 16.0        # roof height
L = norm(np.array([0.62, 1.0, 0.5], f32)) if VARIANT == "aisle" else norm(np.array([0.2, 0.8, 0.75], f32))
SUN = np.array([1.0, 0.70, 0.40], f32) * 5.2


def col_radius(y, ang):
    r = R * (1 - 0.05 * y / HT)
    r = r + 0.07 * R * (0.5 + 0.5 * np.cos(8 * ang))                      # papyrus bundle ribs
    r = r + 0.95 * smoothstep(HT - 4.2, HT - 1.5, y) ** 1.6                 # open papyrus capital
    band = smoothstep(HT - 4.9, HT - 4.7, y) * (1 - smoothstep(HT - 4.3, HT - 4.1, y))
    r = r + 0.08 * band
    r = np.where(y < 0.55, R + 0.3, r)                                        # base drum
    return r


def sdf_parts(p):
    x, y, z = p[..., 0], p[..., 1], p[..., 2]
    lx = np.mod(x, S) - S / 2
    lz = np.mod(z, S) - S / 2
    ang = np.arctan2(lz, lx)
    rho = np.sqrt(lx * lx + lz * lz)
    d_col = np.maximum(rho - col_radius(y, ang), y - (HT - 1.3))
    # abacus block on top of each capital
    d_ab = np.maximum(np.maximum(np.abs(lx), np.abs(lz)) - R * 0.95, np.abs(y - (HT - 1.1)) - 0.22)
    d_col = np.minimum(d_col, d_ab)
    d_arch = np.maximum(np.abs(lz) - 1.05, np.abs(y - (HT - 0.45)) - 0.45)
    d_floor = y
    return d_col, d_arch, d_floor


def sdf(p):
    a, b, c = sdf_parts(p)
    return np.minimum(np.minimum(a, b), c)


def gap(x, z):
    """Openings in the roof slabs (between architraves)."""
    ix = np.floor(x / S)
    jz = np.floor((z - S / 2) / S)
    lxs = np.mod(x, S)
    lzs = np.mod(z - S / 2, S)
    open_cell = hash2(ix + 3.0, jz + 11.0) < 0.5
    inside = (lxs > 0.9) & (lxs < S - 0.9) & (lzs > 1.3) & (lzs < S - 1.3)
    # a narrow slot along every slab gives thin blade-like shafts
    slot = (lzs > S / 2 - 0.22) & (lzs < S / 2 + 0.22) & (hash2(ix + 7.0, jz + 1.0) < 0.5)
    return (open_cell & inside) | slot


def shade_chunk(ro, rd):
    n = rd.shape[0]
    t = march(sdf, np.broadcast_to(ro, rd.shape).astype(f32), rd, tmax=140.0, steps=170)
    # roof plane
    with np.errstate(divide="ignore", invalid="ignore"):
        t_roof = np.where(rd[:, 1] > 1e-4, (HT - ro[1]) / rd[:, 1], np.inf)
    roof_first = t_roof < t
    t_hit = np.minimum(t, t_roof)
    p = ro + rd * t_hit[:, None]

    col = np.zeros((n, 3), f32)

    # ---------- surfaces
    surf = (~roof_first) & (t < 139.0)
    idx = np.nonzero(surf)[0]
    if idx.size:
        ps = p[idx]
        nr = normals(sdf, ps)
        dc, da, df = sdf_parts(ps)
        m_col = (dc <= da) & (dc <= df)
        m_arch = (da < dc) & (da <= df)
        x, y, z = ps[:, 0], ps[:, 1], ps[:, 2]
        base = np.array([0.66, 0.52, 0.37], f32)
        tex = fbm3(ps * np.array([0.9, 0.9, 0.9], f32), 4)
        alb = base[None] * (0.72 + 0.5 * tex)[:, None]
        # carved registers on the shafts
        lx = np.mod(x, S) - S / 2
        lz = np.mod(z, S) - S / 2
        ang = np.arctan2(lz, lx)
        cy = np.floor(y / 0.38)
        ca = np.floor((ang + np.pi) * R / 0.26)
        fy = np.mod(y / 0.38, 1)
        fa = np.mod((ang + np.pi) * R / 0.26, 1)
        glyph = (hash3(cy, ca, np.floor(x / S) * 3 + np.floor(z / S)) < 0.62) & (fy > 0.14) & (fy < 0.86) & (fa > 0.16) & (fa < 0.84)
        reg = np.abs(np.mod(y, 3.1) - 1.55) > 1.45
        zone = m_col & (y > 1.1) & (y < HT - 5.2)
        alb = np.where((zone & glyph)[:, None], alb * 0.78, alb)
        alb = np.where((zone & reg)[:, None], alb * 0.7, alb)
        # floor slabs
        m_floor = ~(m_col | m_arch)
        joint = (np.abs(np.mod(x, 2.2) - 1.1) > 1.07) | (np.abs(np.mod(z, 2.2) - 1.1) > 1.07)
        alb = np.where((m_floor & joint)[:, None], alb * 0.6, alb)
        alb = np.where(m_floor[:, None], alb * 0.85, alb)

        ndl = np.clip((nr * L[None]).sum(-1), 0, 1)
        tp = (HT - y) / L[1]
        q = ps + L[None] * tp[:, None]
        through = gap(q[:, 0], q[:, 2])
        sh = np.zeros(idx.size, f32)
        cand = np.nonzero(through & (ndl > 0))[0]
        if cand.size:
            sh[cand] = soft_shadow(sdf, ps[cand] + nr[cand] * 0.02, L, tp[cand], steps=56, k=12)
        occ = ao(sdf, ps, nr)
        amb = (np.array([0.05, 0.036, 0.025], f32) * (0.4 + 0.6 * np.clip(nr[:, 1], 0, 1))[:, None]) * occ[:, None]
        bounce = np.array([0.09, 0.06, 0.035], f32) * np.clip(-nr[:, 1] * 0.5 + 0.5, 0, 1)[:, None] * occ[:, None]
        c = alb * (SUN[None] * (ndl * sh)[:, None] + amb * 2.2 + bounce * 0.8)
        col[idx] = c

    # ---------- roof / sky
    idr = np.nonzero(roof_first)[0]
    if idr.size:
        pr = p[idr]
        op = gap(pr[:, 0], pr[:, 2])
        sky = np.array([3.2, 2.5, 1.7], f32)
        under = np.array([0.02, 0.015, 0.011], f32) * (0.7 + 0.6 * fbm3(pr * 0.7, 3))[:, None]
        col[idr] = np.where(op[:, None], sky[None], under)

    # ---------- volumetric sun shafts + haze
    NS = 56
    tmax = np.minimum(t_hit, 90.0)
    dt = tmax / NS
    trans = np.ones(n, f32)
    scat = np.zeros((n, 3), f32)
    cosang = (rd * L[None]).sum(-1)
    g = 0.55
    phase = (1 - g * g) / (4 * np.pi * (1 + g * g - 2 * g * cosang) ** 1.5)
    jitter = np.random.default_rng(3).random(n).astype(f32)
    for k in range(NS):
        tk = (k + jitter) * dt
        s = ro + rd * tk[:, None]
        tp = (HT - s[:, 1]) / L[1]
        q = s + L[None] * tp[:, None]
        lit = gap(q[:, 0], q[:, 2]).astype(f32)
        dust = 0.65 + 0.7 * vnoise3(s * np.array([0.25, 0.12, 0.25], f32))
        sigma = 0.018 + 0.0
        scat += (trans * sigma * dt * lit * dust * (7.5 if VARIANT == 'aisle' else 2.6) * phase)[:, None] * SUN[None] / 5.2
        scat += (trans * sigma * dt * 0.022)[:, None] * np.array([0.9, 0.62, 0.38], f32)
        trans *= np.exp(-sigma * 0.55 * dt)
    return col * trans[:, None] + scat


def main():
    t0 = time.time()
    if VARIANT == "aisle":
        ro = np.array([0.0, 1.7, -4.0], f32)
        target = [0.6, 7.0, 30.0]
        fov = 50
    else:  # "rows": long lens, diagonally across the rows into the light
        ro = np.array([-2.0, 1.5, -6.0], f32)
        target = [22.0, 6.5, 60.0]
        fov = 30
    rd_all = camera_rays(W, H_IMG, ro, target, fov)
    out = np.zeros((H_IMG, W, 3), f32)
    rows = max(1, 180000 // W)
    for r0 in range(0, H_IMG, rows):
        rd = rd_all[r0:r0 + rows].reshape(-1, 3)
        out[r0:r0 + rows] = shade_chunk(ro, rd).reshape(-1, W, 3)
        print(f"rows {r0}/{H_IMG} {time.time()-t0:.0f}s", flush=True)
    finish(out, OUT, exposure=1.5, bloom=0.22, vignette=0.6, grain=0.03, warmth=(1.08, 0.94, 0.78))
    print("done", time.time() - t0)


main()
