import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tiempo-descarga",
  "Download Time Calculator",
  "utilidades",
  "calculator",
  "Calculate how long it will take to download a file based on its size and your internet speed.",
  [
    "download time calculator",
    "file download time",
    "bandwidth calculator",
    "calculadora tiempo de descarga",
    "tiempo descarga archivo",
    "calculadora velocidad descarga",
  ],
  {
    title: "Download Time Calculator — File Size & Speed | UtiliHub",
    description:
      "Free download time calculator. Enter file size and connection speed to estimate how long a download will take. Supports MB, GB, Mbps, and more. Runs in your browser.",
  },
);
tool.faq.push(
  faq(
    "How is download time calculated?",
    "Download time = file size in bits ÷ connection speed in bits per second. Bytes are converted to bits first (1 byte = 8 bits). Example: an 800 MB file on a 40 Mbps link takes about 2.7 minutes ((800 × 8) ÷ 40 = 160 seconds).",
  ),
);
tool.faq.push(
  faq(
    "What is the difference between Mbps and MB/s?",
    "Mbps counts megabits per second (1 Mbps = 1,000,000 bits/s); MB/s counts megabytes per second. Since 1 byte = 8 bits, a 50 Mbps connection transfers at most about 6.25 MB/s.",
  ),
);

export const DOWNLOAD_TIME_TOOLS = [tool];
