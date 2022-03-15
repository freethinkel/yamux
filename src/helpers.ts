import type { Station } from "./models/station";

export const querystring = (payload: Record<string, any>): string => {
  const sp = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    sp.append(key, String(value));
  });

  return sp.toString();
};

export const getStationId = (station: Station): string =>
  `${station?.station?.id?.type}:${station?.station?.id?.tag}`;

export const delay = (ms: number) =>
  new Promise((rslv) => {
    setTimeout(() => {
      rslv(undefined);
    }, ms);
  });
