function readonly<T extends object> (x: T): { readonly [K in keyof T]: () => T[K] } {
  const ret = {} as { [K in keyof T]: () => T[K] };
  (Object.keys(x) as Array<keyof T>).forEach(k => ret[k] = () => x[k]);
  return ret;
}

export { readonly }
