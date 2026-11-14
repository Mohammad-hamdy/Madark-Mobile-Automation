import appMap from '@madark/generated/app-map.json';

export function endpoint(id: string): string {
  const hit = appMap.apis.find((a) => a.id === id);
  if (!hit) throw new Error(`endpoint ${id} not in generated/app-map.json — run npm run scan`);
  return hit.path;
}
