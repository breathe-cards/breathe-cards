/** Keeps exactly n particles in store.p, creating new ones with make(). */
export function particles(store, n, make) {
  const p = (store.p = store.p || []);
  while (p.length < n) p.push(make());
  if (p.length > n) p.length = n;
  return p;
}
