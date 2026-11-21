"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useHydrated() {
  // A deferred boundary can hydrate after its session provider has already updated.
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
