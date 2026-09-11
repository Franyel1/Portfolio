// Each study keeps its own clock, so scrolling or pausing cannot cause animation jumps.
export function createCollageScheduler(start = performance.now()) {
  const queue = new Map(),
    clocks = new Map();
  return {
    request(callback, surface) {
      queue.set(callback, surface);
      return 0;
    },
    step(visible = (_surface) => true) {
      for (const [callback, surface] of [...queue]) {
        if (!visible(surface)) continue;
        queue.delete(callback);
        const now = (clocks.get(surface) ?? start) + 1000 / 30;
        clocks.set(surface, now);
        callback(now);
      }
    },
    clear() {
      queue.clear();
      clocks.clear();
    },
    get size() {
      return queue.size;
    },
  };
}
