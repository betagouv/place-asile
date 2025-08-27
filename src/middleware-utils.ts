import { NextRequest } from "next/server";

import { apiProtections, Protection } from "./middleware-config";

export const matchApiRoute = (
  request: NextRequest,
  pathname: string
): {
  pattern: string;
  method: string;
  protection: Protection;
} | null => {
  for (const pattern in apiProtections) {
    const regex = new RegExp("^" + pattern.replace(/\[id\]/g, "[^\\/]+") + "$");
    if (regex.test(pathname)) {
      const method = Object.keys(apiProtections[pattern]).find(
        (m) => m === request.method
      );
      if (method) {
        return { pattern, method, protection: apiProtections[pattern][method] };
      }
    }
  }
  return null;
};
