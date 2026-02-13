// utils/softAssert.ts
import { test, expect } from "@playwright/test";

type Failure = { message: string };

export class SoftAssert {
  private failures: Failure[] = [];

  async assertTrue(condition: boolean, message: string): Promise<void> {
    if (!condition) this.failures.push({ message });
    await test.step(`assertTrue: ${message}`, async () => {
      expect(condition, message).toBeTruthy();
    }).catch(() => {
    });
  }

  async assertFalse(condition: boolean, message: string): Promise<void> {
    if (condition) this.failures.push({ message });
    await test.step(`assertFalse: ${message}`, async () => {
      expect(condition, message).toBeFalsy();
    }).catch(() => {});
  }

  async assertEqual<T>(actual: T, expected: T, message: string): Promise<void> {
    const ok = actual === expected;
    if (!ok) this.failures.push({ message: `${message}. Actual=${String(actual)} Expected=${String(expected)}` });

    await test.step(`assertEqual: ${message}`, async () => {
      expect(actual, message).toBe(expected);
    }).catch(() => {});
  }

  async assertAll(): Promise<void> {
    if (this.failures.length === 0) return;

    const msg =
      "Soft assertion failures:\n" +
      this.failures.map((f, i) => `${i + 1}) ${f.message}`).join("\n");

    throw new Error(msg);
  }
}