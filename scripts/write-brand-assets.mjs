/** Writes brand assets (favicon PNGs) into public/ at build time. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const assets = {
  'favicon-32.png': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAHBElEQVR42o1WW4yVVxld69v7P9e5wkAZYJiRKZSZQgFFESE2KYUYazVaEkN8aHwyadRE04eaauKjMU1UntT4UKPRaKKJprSRtBZUnF6YwhgDtAjDbRhm5szlzJzLf92fD/85Z87YpnHnJOffyc5ae69v7/UtFjbuAZj+SCiI9Isk2JwRAECQUCCdpUMV7x/peoUSFiAgKWYLOgVtEDBdkBJglSzFaEKhQbTKpwIAtoWu/4NOgtLaPikNULbB6CqbQtE4XYtKUwK0o5MCgCIUIYUklAoSUIKgoo2FbJ0E6lK1qA2O9M+2K5OiizGARLVEnRMjXjFDClSFbKrbFFo1CeqqMUTEy4JU55QtAUGobZSOBIUAjYlDFbihA/35/nx9MZoeLznnvJzntK2+InHoW2N6du1DrjdenK3du6pOxVhVB0Cbi602RRaAxkShruvvfPIHR3YeHu7L9s1FyxNv3Tz7/NjinbKX99QpCFKSIOjq3zL0lW89sG1Xp8r96ejWpYulf5wKKyWKp5o07pHSZDr6QSFJEUCskZO/ePz4Y48+oY9uiNbtkx2dO7r9PXby9C1NIEZIA9VsobDr69//zMHd334EJx/2PjakJTc0Vd/uT52DAhQlCCUhzStDMSasxg8dH9x9ePRx/9Ab/r9eq13cnF13zH9k994dW48OJnUVkxHJaRh37z0yMjz83G79yLr8pK/ffaf+5U9UR4ZHpfeAujpEAIImFSYtnoCkY+9I95AMeEbOVCc+Wtj56/lzl/27ezODue0dgowRKyLWGPRsPbDezgCv3K/cXA5ObM7uH+jYN2h',
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public");
mkdirSync(outDir, { recursive: true });
for (const [name, b64] of Object.entries(assets)) {
  try {
    const buf = Buffer.from(b64, "base64");
    writeFileSync(join(outDir, name), buf);
    console.log("wrote", name, buf.length, "bytes");
  } catch (e) {
    console.warn("skip", name, e.message);
  }
}
