import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { rollChance } from "../ChanceRoll";

describe("ChanceRoll", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("rollChance", () => {
		it("should throw when probability is 0", async () => {
			await expect(rollChance(0)).rejects.toThrow("Probability must be between 1 and 99");
		});

		it("should throw when probability is 100", async () => {
			await expect(rollChance(100)).rejects.toThrow("Probability must be between 1 and 99");
		});

		it("should throw when probability is negative", async () => {
			await expect(rollChance(-10)).rejects.toThrow("Probability must be between 1 and 99");
		});

		it("should throw when probability is over 100", async () => {
			await expect(rollChance(110)).rejects.toThrow("Probability must be between 1 and 99");
		});

		it("should succeed for probability 99 when roll is 1", async () => {
			vi.spyOn(Math, "random").mockReturnValue(0.001);
			const result = await rollChance(99, "test context");
			expect(result).toBe(true);
		});

		it("should fail for probability 99 when roll is 99", async () => {
			vi.spyOn(Math, "random").mockReturnValue(0.99);
			const result = await rollChance(99, "test context");
			expect(result).toBe(false);
		});

		it("should succeed for probability 1 when roll is 1", async () => {
			vi.spyOn(Math, "random").mockReturnValue(0.001);
			const result = await rollChance(1, "test context");
			expect(result).toBe(true);
		});

		it("should fail for probability 1 when roll is 2", async () => {
			vi.spyOn(Math, "random").mockReturnValue(0.01);
			const result = await rollChance(1, "test context");
			expect(result).toBe(false);
		});

		it("should always succeed for probability 99 with many trials", async () => {
			const results: boolean[] = [];
			for (let i = 1; i <= 99; i++) {
				vi.spyOn(Math, "random").mockReturnValue(i / 100);
				const result = await rollChance(99, "test context");
				results.push(result);
			}
			vi.restoreAllMocks();

			const successes = results.filter((r) => r).length;
			expect(successes).toBe(99);
		});

		it("should succeed only once for probability 1 with many trials", async () => {
			const results: boolean[] = [];
			for (let i = 1; i <= 99; i++) {
				vi.spyOn(Math, "random").mockReturnValue(i / 100);
				const result = await rollChance(1, "test context");
				results.push(result);
			}
			vi.restoreAllMocks();

			const successes = results.filter((r) => r).length;
			expect(successes).toBe(1);
		});

		it("should throw when probability is not an integer", async () => {
			// @ts-expect-error - testing invalid input
			await expect(rollChance(50.5)).rejects.toThrow("Probability must be between 1 and 99");
		});

		it("should throw when probability is a decimal string", async () => {
			await expect(rollChance("50" as any)).rejects.toThrow("Probability must be between 1 and 99");
		});
	});
});
