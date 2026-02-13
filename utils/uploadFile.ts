// fixtures/uploadFile.ts
import { test as base } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

type Fixtures = {
  uploadFilePath: string;
};

export const test = base.extend<Fixtures>({
  uploadFilePath: async ({}, use, testInfo) => {
    const dir = testInfo.outputPath("uploads");
    fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, "upload.txt");
    fs.writeFileSync(filePath, "file upload test", { encoding: "utf-8" });

    await use(filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },
});

export { expect } from "@playwright/test";