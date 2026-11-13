import { create } from 'zustand';
import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';

export function createAppStore<T>(
  initializer: StateCreator<T>,
): UseBoundStore<StoreApi<T>> {
  return create<T>()(initializer);
}
