import { describe, expect, it } from 'vitest';
import { resources } from './resources';

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe('i18n resources', () => {
  it('has the same namespaces in every language', () => {
    expect(Object.keys(resources.en).sort()).toEqual(Object.keys(resources.es).sort());
  });

  it.each(Object.keys(resources.es))('namespace "%s" has identical keys in es and en', (namespace) => {
    const ns = namespace as keyof typeof resources.es;
    expect(keyPaths(resources.en[ns]).sort()).toEqual(keyPaths(resources.es[ns]).sort());
  });
});
