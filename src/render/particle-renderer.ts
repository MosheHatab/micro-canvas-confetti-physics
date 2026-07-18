import { computeSkewX, computeWobbleScale } from "../physics/wobble";
import type { Particle, PhysicsConfig } from "../types";

/** Draws one piece with wobble transform and the chosen shape. */
function drawParticleShape(
	ctx: CanvasRenderingContext2D,
	particle: Particle,
	config: PhysicsConfig,
	alpha: number,
): void {
	const scaleX = computeWobbleScale(particle.wobblePhase, config.minFlatness);
	const skewX = computeSkewX(particle.wobblePhase, config.skewFactor);

	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.translate(particle.x, particle.y);
	ctx.rotate(particle.rotation);
	ctx.transform(scaleX, skewX, 0, 1, 0, 0);
	ctx.fillStyle = particle.color;

	if (particle.shape === "circle") {
		ctx.beginPath();
		ctx.ellipse(0, 0, particle.width / 2, particle.height / 2, 0, 0, Math.PI * 2);
		ctx.fill();
	} else {
		ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
	}

	ctx.restore();
}

/** Draws one piece, including its motion trail when enabled. */
export function drawParticle(
	ctx: CanvasRenderingContext2D,
	particle: Particle,
	config: PhysicsConfig,
	trails: boolean,
): void {
	if (trails && particle.trailX.length > 1) {
		for (let i = 0; i < particle.trailX.length - 1; i++) {
			const trailAlpha = particle.opacity * ((i + 1) / particle.trailX.length) * 0.35;
			const trailParticle: Particle = {
				...particle,
				x: particle.trailX[i] as number,
				y: particle.trailY[i] as number,
				opacity: trailAlpha,
			};
			drawParticleShape(ctx, trailParticle, config, trailAlpha);
		}
	}

	drawParticleShape(ctx, particle, config, particle.opacity);
}

/** Draws every piece in the array. */
export function drawParticles(
	ctx: CanvasRenderingContext2D,
	particles: readonly Particle[],
	config: PhysicsConfig,
	trails: boolean,
): void {
	for (let i = 0; i < particles.length; i++) {
		drawParticle(ctx, particles[i] as Particle, config, trails);
	}
}

/** Debug view that colors pieces by current speed. */
export function drawParticlesHeatmap(
	ctx: CanvasRenderingContext2D,
	particles: readonly Particle[],
	config: PhysicsConfig,
): void {
	for (let i = 0; i < particles.length; i++) {
		const p = particles[i] as Particle;
		const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
		const t = Math.min(1, speed / 80);
		const heatColor = `hsl(${220 - t * 220}, 90%, ${45 + t * 20}%)`;
		const heatParticle: Particle = { ...p, color: heatColor };
		drawParticle(ctx, heatParticle, config, false);
	}
}
