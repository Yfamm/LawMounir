"""Neoclassical courthouse portico at golden hour: fluted columns, steps, raking shadows."""
import sys
import time
import numpy as np
from common import *

W = int(sys.argv[1]) if len(sys.argv) > 1 else 1200
H_IMG = int(sys.argv[2]) if len(sys.argv) > 2 else int(W * 9 / 16)
OUT = sys.argv[3] if len(sys.argv) > 3 else "colonnade.webp"
VARIANT = sys.argv[4] if len(sys.argv) > 4 else "wide"

S = 3.8
R = 0.74
Y0 = 1.8           # top of stylobate
YC = 12.0          # top of capital
ZC = 9.0           # column row
L = norm(np.array([-0.78, 0.4, -0.42], f32))
SUN = np.array([1.0, 0.66, 0.36], f32) * 4.6


def col_r(y, ang):
    h = np.clip((y - Y0) / (YC - Y0), 0, 1)
    r = R * (1 - 0.1 * h)
    flute = 0.5 + 0.5 * np.cos(20 * ang)
    r = r - 0.035 * flute ** 3
    r = r + 0.16 * (smoothstep(Y0 + 0.35, Y0, y))                       # base
    r = r + 0.3 * smoothstep(YC - 0.75, YC - 0.1, y) ** 2                # echinus
    return r


def parts(p):
    x, y, z = p[..., 0], p[..., 1], p[..., 2]
    lx = np.mod(x, S) - S / 2
    lz = z - ZC
    ang = np.arctan2(lz, lx)
    rho = np.sqrt(lx * lx + lz * lz)
    d_col = np.maximum(rho - col_r(y, ang), np.maximum(Y0 - y, y - YC))
    d_ab = np.maximum(np.maximum(np.abs(lx), np.abs(lz)) - 1.0, np.abs(y - (YC + 0.15)) - 0.15)
    d_col = np.minimum(d_col, d_ab)
    # entablature, cornice, portico roof
    d_ent = np.maximum(np.abs(z - (ZC + 3.5)) - 4.6, np.abs(y - (YC + 1.35)) - 1.05)
    d_cor = np.maximum(np.abs(z - (ZC + 3.3)) - 5.0, np.abs(y - (YC + 2.6)) - 0.22)
    d_roof = np.maximum(np.abs(z - (ZC + 3.5)) - 4.6, np.abs(y - (YC + 3.2)) - 0.4)
    d_top = np.minimum(d_ent, d_cor)
    # back wall with tall door recesses between the columns
    d_wall = (ZC + 6.0) - z
    dx = np.mod(x, S) - 0.0
    dx = np.minimum(dx, S - dx)
    door = np.maximum(np.maximum(dx - 0.85, np.abs(y - (Y0 + 3.6)) - 3.6), np.abs(z - (ZC + 6.35)) - 0.35)
    d_wall = np.maximum(np.maximum(d_wall, -door), y - (YC + 2.4))
    # stylobate and steps rising toward the portico
    d_steps = y
    for k in range(9):
        zs = ZC - 7.0 + k * 0.62
        d_steps = np.minimum(d_steps, np.maximum(zs - z, y - 0.2 * (k + 1)))
    return d_col, d_top, d_wall, d_steps


def sdf(p):
    a, b, c, d = parts(p)
    return np.minimum(np.minimum(a, b), np.minimum(c, d))


def sky(rd):
    t = np.clip(rd[:, 1], 0, 1)[:, None]
    horizon = np.array([0.9, 0.5, 0.26], f32)
    zen = np.array([0.03, 0.025, 0.028], f32)
    s = horizon * (1 - t) ** 3 + zen * (1 - (1 - t) ** 3)
    sun = np.clip((rd * L[None]).sum(-1), 0, 1) ** 400 * 40
    return s + sun[:, None] * np.array([1, 0.8, 0.5], f32)


def shade(ro, rd):
    n = rd.shape[0]
    t = march(sdf, np.broadcast_to(ro, rd.shape).astype(f32), rd, tmax=160.0, steps=180)
    hit = t < 159
    col = np.zeros((n, 3), f32)
    col[~hit] = sky(rd[~hit])
    idx = np.nonzero(hit)[0]
    p = ro + rd[idx] * t[idx, None]
    nr = normals(sdf, p)
    dc, dt_, dw, ds = parts(p)
    m = np.argmin(np.stack([dc, dt_, dw, ds], -1), -1)
    stone = np.array([0.74, 0.66, 0.54], f32)
    tex = fbm3(p * 1.3, 4)
    alb = stone[None] * (0.78 + 0.4 * tex)[:, None]
    alb = np.where((m == 2)[:, None], alb * 0.78, alb)
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    dx = np.mod(x, S)
    dx = np.minimum(dx, S - dx)
    in_door = (m == 2) & (z > ZC + 6.05) & (dx < 0.85) & (y < Y0 + 7.2)
    alb = np.where(in_door[:, None], np.array([0.05, 0.035, 0.025], f32)[None], alb)
    # frieze band and triglyph rhythm on the entablature
    frieze = (m == 1) & (y > YC + 0.9) & (y < YC + 2.2)
    trig = frieze & (np.abs(np.mod(x + S / 2, S / 2) - S / 4) < 0.28)
    alb = np.where(trig[:, None], alb * 0.72, alb)
    joints = (m == 3) & (np.abs(np.mod(x, 1.9) - 0.95) > 0.93)
    alb = np.where((m == 3)[:, None], alb * 0.7, alb)
    alb = np.where(joints[:, None], alb * 0.7, alb)

    ndl = np.clip((nr * L[None]).sum(-1), 0, 1)
    sh = np.zeros(idx.size, f32)
    c = np.nonzero(ndl > 0)[0]
    sh[c] = soft_shadow(sdf, p[c] + nr[c] * 0.02, L, np.full(c.size, 60, f32), steps=64, k=16)
    occ = ao(sdf, p, nr, step=0.25)
    skyfill = np.array([0.03, 0.024, 0.022], f32) * (0.5 + 0.5 * np.clip(nr[:, 1], 0, 1))[:, None]
    bounce = np.array([0.06, 0.04, 0.026], f32) * np.clip(-nr[:, 1], 0, 1)[:, None]
    col[idx] = alb * (SUN[None] * (ndl * sh)[:, None] + (skyfill + bounce) * occ[:, None] * 2.2)
    # aerial perspective
    fog = 1 - np.exp(-t * 0.006)
    col = col * (1 - fog[:, None]) + np.array([0.5, 0.34, 0.2], f32)[None] * fog[:, None] * 0.12
    return col


def main():
    t0 = time.time()
    if VARIANT == "wide":
        ro = np.array([-9.0, 1.1, -3.0], f32)
        target = [8.0, 8.4, 14.0]
        fov = 52
    else:  # "detail": close, looking up the shafts toward the capitals
        ro = np.array([-1.6, 2.4, 5.2], f32)
        target = [6.0, 11.2, 12.0]
        fov = 44
    rd_all = camera_rays(W, H_IMG, ro, target, fov)
    out = np.zeros((H_IMG, W, 3), f32)
    rows = max(1, 150000 // W)
    for r0 in range(0, H_IMG, rows):
        rd = rd_all[r0:r0 + rows].reshape(-1, 3)
        out[r0:r0 + rows] = shade(ro, rd).reshape(-1, W, 3)
    finish(out, OUT, exposure=0.95, bloom=0.2, vignette=0.6, grain=0.03, warmth=(1.08, 0.95, 0.8))
    print("done", time.time() - t0)


main()
