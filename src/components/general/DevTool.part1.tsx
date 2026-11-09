// Part 1 of 3 — split from DevTool.tsx on 2026-11-04. Edit here; DevTool.tsx re-exports.

export const HTTP_STATUS: Record<string, string> = {
  "200": "OK",
  "201": "Created",
  "204": "No Content",
  "301": "Moved Permanently",
  "302": "Found",
  "304": "Not Modified",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "409": "Conflict",
  "422": "Unprocessable Content",
  "429": "Too Many Requests",
  "500": "Internal Server Error",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
};
