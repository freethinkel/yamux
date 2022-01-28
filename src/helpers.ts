export const querystring = (payload: Record<string, any>): string => {
  const sp = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    sp.append(key, String(value));
  });

  return sp.toString();
};
