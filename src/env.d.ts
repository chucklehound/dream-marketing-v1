/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    __dreamTicker?: {
      start: () => void;
      stop: () => void;
    } | undefined;
  }
}

export {};
