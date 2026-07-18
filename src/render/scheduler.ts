/** Drives requestAnimationFrame and only repaints when the scene is dirty. */
export class RenderScheduler {
	private readonly render: (timestamp: number) => void;
	private dirty = false;
	private running = false;
	private frameHandle = 0;
	private readonly loop: (timestamp: number) => void;
	private lastFrameTimestamp = 0;
	private lastFrameDurationMs = 0;

	public constructor(render: (timestamp: number) => void) {
		this.render = render;
		this.loop = (timestamp: number): void => this.tick(timestamp);
	}

	/** Starts the animation loop. */
	public start(): void {
		if (this.running) return;
		this.running = true;
		this.dirty = true;
		this.frameHandle = requestAnimationFrame(this.loop);
	}

	/** Stops the loop and cancels any pending frame. */
	public stop(): void {
		this.running = false;
		if (this.frameHandle !== 0) {
			cancelAnimationFrame(this.frameHandle);
			this.frameHandle = 0;
		}
	}

	/** Marks the next frame as needing a repaint. */
	public markDirty(): void {
		this.dirty = true;
	}

	/** Duration of the last paint pass in milliseconds. */
	public get lastFrameMs(): number {
		return this.lastFrameDurationMs;
	}

	/** Timestamp of the last completed paint frame. */
	public get lastPaintTimestamp(): number {
		return this.lastFrameTimestamp;
	}

	/** Whether the scheduler loop is active. */
	public get isRunning(): boolean {
		return this.running;
	}

	private tick(timestamp: number): void {
		if (!this.running) return;
		if (this.dirty) {
			this.dirty = false;
			const start = performance.now();
			this.render(timestamp);
			this.lastFrameDurationMs = performance.now() - start;
			this.lastFrameTimestamp = timestamp;
		}
		this.frameHandle = requestAnimationFrame(this.loop);
	}
}
