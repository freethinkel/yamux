export type InvocationInfo = {
  hostname: string;
  "req-id": string;
  "exec-duration-mills": string;
};

export type YandexMusicResponse<T> = {
  invocationInfo: InvocationInfo;
  result: T;
};
