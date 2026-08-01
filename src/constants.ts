import type { ConfettiDuration, ConfettiOptions, ConfettiPreset, PhysicsConfig } from "./types";

/** Default number of pieces per burst. */
export const DEFAULT_PARTICLE_COUNT = 80;
export const MIN_PARTICLE_COUNT = 1;
export const MAX_PARTICLE_COUNT = 500;

export const DEFAULT_ANGLE = 270;
export const DEFAULT_SPREAD = 45;
export const DEFAULT_START_VELOCITY = 45;
export const DEFAULT_GRAVITY = 1.2;
export const DEFAULT_DRAG = 0.08;
export const DEFAULT_DECAY = 0;
export const DEFAULT_SCALAR = 1;

export const ROTATION_DRAG = 0.12;
export const WOBBLE_DRAG = 0.1;
export const MIN_FLATNESS = 0.15;
export const SKEW_FACTOR = 0.3;

export const DEFAULT_Z_INDEX = 9999;
export const CULL_MARGIN = 50;
export const SETTLE_VELOCITY_THRESHOLD = 0.05;
export const SETTLE_Y_OFFSET = 50;

export const MAX_DEVICE_PIXEL_RATIO = 3;
export const UNMOUNT_DEBOUNCE_MS = 500;
export const DEFAULT_TRAIL_LENGTH = 6;

/** No limit — pieces can travel anywhere on screen. */
export const DEFAULT_BURST_RADIUS = 0;
export const MAX_BURST_RADIUS = 5000;

/** Lifespan in ticks when duration is set and ticks are not explicit. */
export const DURATION_TICKS: Record<ConfettiDuration, number> = {
	short: 45,
	normal: 0,
	long: 220,
};

/** Default drag per duration preset. */
export const DURATION_DRAG: Record<ConfettiDuration, number> = {
	short: 0.16,
	normal: DEFAULT_DRAG,
	long: 0.05,
};

/** Default size multiplier per duration preset. */
export const DURATION_SCALAR: Record<ConfettiDuration, number> = {
	short: 0.55,
	normal: 1,
	long: 1.15,
};

export const DEFAULT_COLORS: readonly string[] = [
	"#FF2D55",
	"#FFCC00",
	"#34C759",
	"#007AFF",
	"#AF52DE",
	"#FF9500",
	"#5AC8FA",
	"#FF6B9D",
];

export const CELEBRATION_COLORS = [
	"#FFD700",
	"#FF2D55",
	"#FF1493",
	"#00E5FF",
	"#39FF14",
	"#FF9500",
	"#BF5AF2",
] as const;
export const SUBTLE_COLORS = ["#B8C5D6", "#D4A5A5", "#A8D8EA", "#C9B1FF"] as const;
export const CANNON_COLORS = ["#FF4500", "#FFA500", "#FFFF00", "#FF2D55", "#FF6347"] as const;
export const SPARK_COLORS = ["#FFFFFF", "#FFFACD", "#FFE4E1", "#E0FFFF"] as const;

export const DEFAULT_SHAPES = ["rect", "circle"] as const;

/** Baseline simulation values used when options are resolved. */
export const DEFAULT_PHYSICS: PhysicsConfig = {
	gravity: DEFAULT_GRAVITY,
	drag: DEFAULT_DRAG,
	rotationDrag: ROTATION_DRAG,
	wobbleDrag: WOBBLE_DRAG,
	minFlatness: MIN_FLATNESS,
	skewFactor: SKEW_FACTOR,
	decay: DEFAULT_DECAY,
};

/** Default option overrides for each named preset. */
export const PRESET_OPTIONS: Record<ConfettiPreset, Partial<ConfettiOptions>> = {
	celebration: {
		particleCount: 150,
		startVelocity: 62,
		spread: 85,
		gravity: 0.9,
		duration: "normal",
		scalar: 1.15,
		colors: CELEBRATION_COLORS,
		shapes: ["rect", "circle"],
	},
	subtle: {
		particleCount: 14,
		startVelocity: 16,
		spread: 22,
		gravity: 0.55,
		duration: "short",
		scalar: 0.6,
		drag: 0.14,
		colors: SUBTLE_COLORS,
		shapes: ["circle"],
	},
	cannon: {
		particleCount: 55,
		startVelocity: 88,
		spread: 14,
		gravity: 2.2,
		duration: "short",
		scalar: 1,
		angle: 270,
		colors: CANNON_COLORS,
		shapes: ["rect"],
	},
	spark: {
		particleCount: 8,
		startVelocity: 22,
		spread: 360,
		gravity: 0.4,
		duration: "short",
		scalar: 0.45,
		drag: 0.2,
		decay: 0.08,
		burstRadius: 80,
		colors: SPARK_COLORS,
		shapes: ["circle"],
	},
};

/** Human-readable labels and descriptions for demo and docs. */
export const PRESET_LABELS: Record<
	ConfettiPreset,
	{ readonly label: string; readonly description: string }
> = {
	celebration: {
		label: "Celebration",
		description: "Big, colorful burst — 150 pieces, wide spread",
	},
	subtle: {
		label: "Subtle",
		description: "Tiny whisper — few small flakes, ends fast",
	},
	cannon: {
		label: "Cannon",
		description: "Tight vertical blast — high speed, heavy fall",
	},
	spark: {
		label: "Spark",
		description: "Micro pop — 8 mini pieces, gone in ~1 second",
	},
};
