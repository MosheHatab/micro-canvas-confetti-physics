import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { CanvasManager } from "../../src/dom/canvas-manager";

function createMockContext(): CanvasRenderingContext2D {
	return {
		setTransform: vi.fn(),
		clearRect: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		translate: vi.fn(),
		rotate: vi.fn(),
		transform: vi.fn(),
		fillRect: vi.fn(),
		beginPath: vi.fn(),
		ellipse: vi.fn(),
		fill: vi.fn(),
	} as unknown as CanvasRenderingContext2D;
}

beforeAll(() => {
	HTMLCanvasElement.prototype.getContext = vi.fn(
		() => createMockContext(),
	) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

describe("CanvasManager", () => {
	let manager: CanvasManager | null = null;

	afterEach(() => {
		manager?.destroy();
		manager = null;
		document.body.innerHTML = "";
	});

	it("mounts a canvas to document.body", () => {
		manager = new CanvasManager({ zIndex: 9999 });
		manager.mount();
		const canvas = document.querySelector("canvas");
		expect(canvas).not.toBeNull();
		expect(canvas?.style.pointerEvents).toBe("none");
	});

	it("reuses canvas on second mount", () => {
		manager = new CanvasManager({ zIndex: 9999 });
		const first = manager.mount().canvas;
		const second = manager.mount().canvas;
		expect(first).toBe(second);
	});

	it("destroys canvas and removes from DOM", () => {
		manager = new CanvasManager({ zIndex: 9999 });
		manager.mount();
		manager.destroy();
		expect(document.querySelector("canvas")).toBeNull();
	});

	it("does not duplicate canvases on remount after destroy", () => {
		manager = new CanvasManager({ zIndex: 9999 });
		manager.mount();
		manager.destroy();
		manager.mount();
		expect(document.querySelectorAll("canvas")).toHaveLength(1);
	});
});
