import { NextResponse } from "next/server";
import apiRoutePermissions from "./apiRoutesPermissions";
import path from "path";
/**
 * Returns a Response object with a JSON body
 */
export function jsonResponse(status: number, data: any, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });
}
export function matchRoute(pathname: string) {
  const singleroute = apiRoutePermissions.find((p) => p.route == pathname);
  if (singleroute) return true;

  const dynamicroutes = apiRoutePermissions.filter(
    (p) => p.route.includes("/[") && p.route.includes("]")
  );

  

  return true;
}
