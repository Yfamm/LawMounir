"""Light falling through a mashrabiya screen onto a plaster wall."""
import sys
import numpy as np
from scipy.ndimage import gaussian_filter, map_coordinates
from common import f32, fbm3, finish, smoothstep

W = int(sys.argv[1]) if len(sys.argv) > 1 else 1600
H = int(sys.argv[2]) if len(sys.argv) > 2 else 1000
OUT = sys.argv[3] if len(sys.argv) > 3 else "mashrabiya.webp"


def lattice(u, v, bead=0.3, bar=0.09):
    """Turned-wood lattice: diagonal bars with round beads at the crossings.
    Returns 1 where light passes, 0 where wood blocks it (u, v in cell units)."""
    a = (u + v) / np.sqrt(2)
    b = (u - v) / np.sqrt(2)
    da = np.abs(np.mod(a, 1 / np.sqrt(2) * 2) - 1 / np.sqrt(2))
    db = np.abs(np.mod(b, 1 / np.sqrt(2) * 2) - 1 / np.sqrt(2))
    bars = np.minimum(1 / np.sqrt(2) - da, 1 / np.sqrt(2) - db) < bar
    cu = np.mod(u, 1) - 0.5
    cv = np.mod(v, 1) - 0.5
    beads = np.sqrt(cu * cu + cv * cv) < bead
    # small spindle beads midway along the bars
    su = np.mod(u + 0.5, 1) - 0.5
    sv = np.mod(v + 0.5, 1) - 0.5
    spindles = np.sqrt(su * su + sv * sv) < bead * 0.55
    wood = bars | beads | spindles
    return (~wood).astype(f32)


yy, xx = np.mgrid[0:H, 0:W].astype(f32)
X = xx / W
Y = yy / H

# ---------------------------------------------------------------- wall
p = np.stack([xx / 180, yy / 180, np.zeros_like(xx)], -1).astype(f32)
plaster = 0.62 + 0.55 * fbm3(p * 1.0, 5) + 0.12 * fbm3(p * 9.0, 3)
wall_alb = np.stack([0.72 * plaster, 0.6 * plaster, 0.46 * plaster], -1)

# ---------------------------------------------------------------- projected light
# the window's light lands as a sheared, foreshortened patch on the wall
cx, cy = 0.62, 0.52
u0 = ((X - cx) * 9.0 + (Y - cy) * 4.6) * 2.3   # shear: sun comes from the upper left
v0 = ((Y - cy) * 7.4 - (X - cx) * 1.2) * 2.3
persp = 1 + (X - 0.35) * 0.9                  # cells grow toward the right (closer to window)
u = u0 / persp
v = v0 / persp
light = lattice(u + 7.3, v + 3.1)
# patch bounds (window frame) with soft edges
pa = (X - 0.64) + (Y - 0.5) * 0.42
pb = (Y - 0.5) * (H / W) - (X - 0.64) * 0.12
patch = (1 - smoothstep(0.24, 0.3, np.abs(pa))) * (1 - smoothstep(0.2, 0.25, np.abs(pb)))
light = light * patch
# penumbra: sharper near the lower-left edge of the patch, softer as distance from screen grows
sharp = gaussian_filter(light, W * 0.0012)
soft = gaussian_filter(light, W * 0.006)
mixk = smoothstep(0.25, 0.95, X * 0.7 + (1 - Y) * 0.5)
light = sharp * (1 - mixk) + soft * mixk
beam = np.array([1.0, 0.72, 0.42], f32) * 3.0

amb = 0.012 + 0.05 * gaussian_filter(light, W * 0.1)  # light bouncing off the lit patch
img = wall_alb * (beam[None, None] * light[..., None] + np.array([1.0, 0.8, 0.62], f32) * amb[..., None])

# ---------------------------------------------------------------- dust in the beam (soft diagonal haze)
haze = gaussian_filter(light, W * 0.06) * smoothstep(0.0, 0.7, 1 - Y) * 0.12
img = img + haze[..., None] * np.array([0.9, 0.6, 0.34], f32)[None, None]

# ---------------------------------------------------------------- foreground screen, out of focus, left edge
fu = (xx / W) * 11.0 + 0.2
fv = (yy / H) * 6.9 + 0.35
screen = lattice(fu, fv, bead=0.3, bar=0.1)
screen_mask = 1 - smoothstep(0.2, 0.235, X + (Y - 0.5) * 0.02)    # the screen occupies the left fifth
glow = np.array([0.75, 0.46, 0.22], f32) * (0.6 + 0.4 * (1 - Y))[..., None]   # bright sky beyond the lattice
fg = screen[..., None] * glow
fg = np.stack([gaussian_filter(fg[..., k], W * 0.006) for k in range(3)], -1)
wood = (1 - screen)[..., None] * np.array([0.02, 0.014, 0.01], f32)
fg = fg + wood
img = img * (1 - screen_mask[..., None]) + fg * screen_mask[..., None]
# frame post of the window
post = smoothstep(0.228, 0.232, X) * (1 - smoothstep(0.262, 0.266, X))
img = img * (1 - post[..., None] * 0.97)

finish(img.astype(f32), OUT, exposure=0.9, bloom=0.28, vignette=0.7, grain=0.03, warmth=(1.06, 0.95, 0.82))
print("done")
