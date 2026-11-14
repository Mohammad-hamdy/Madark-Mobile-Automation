import { FeatureTags, ModuleTags, TypeTags } from '@madark/generated/tag-catalog';

export type ScenarioTag = 'Happy' | 'Negative' | 'Corner';
export type SuiteTag = 'e2e' | 'smoke' | 'regression' | 'sanity';
export type PriorityTag = 'p0' | 'p1' | 'p2' | 'p3';

export const Tag = {
  Happy: 'Happy',
  Negative: 'Negative',
  Corner: 'Corner',
  e2e: 'e2e',
  smoke: 'smoke',
  regression: 'regression',
  sanity: 'sanity',
  p0: 'p0',
  p1: 'p1',
  p2: 'p2',
  p3: 'p3',
  type: TypeTags,
  module: ModuleTags,
  feature: FeatureTags,
  bug: (id: string) => id,
} as const;

export type CaseTags = {
  id?: string;
  module?: string;
  feature?: string;
  scenario?: ScenarioTag;
  suites?: SuiteTag[];
  priority?: PriorityTag;
  bug?: string;
  extra?: string[];
};

type TagToken = string | CaseTags;

const SUITES = new Set<string>([Tag.e2e, Tag.smoke, Tag.regression, Tag.sanity]);
const SCENARIOS = new Set<string>([Tag.Happy, Tag.Negative, Tag.Corner]);
const PRIORITIES = new Set<string>([Tag.p0, Tag.p1, Tag.p2, Tag.p3]);
const MODULES = () => new Set(Object.values(Tag.module));
const FEATURES = () => new Set(Object.values(Tag.feature));

export function tag(...items: TagToken[]): CaseTags {
  const out: CaseTags = { suites: [], extra: [] };
  for (const item of items) apply(out, item);
  out.suites = [...new Set(out.suites?.length ? out.suites : [Tag.e2e])];
  return out;
}

function apply(out: CaseTags, item: TagToken): void {
  if (typeof item !== 'string') {
    if (item.id) out.id = item.id;
    if (item.module) out.module = item.module;
    if (item.feature) out.feature = item.feature;
    if (item.scenario) out.scenario = item.scenario;
    if (item.priority) out.priority = item.priority;
    if (item.bug) out.bug = item.bug;
    if (item.suites) out.suites = [...(out.suites ?? []), ...item.suites];
    if (item.extra) out.extra = [...(out.extra ?? []), ...item.extra];
    return;
  }
  if (SCENARIOS.has(item)) {
    out.scenario = item as ScenarioTag;
    return;
  }
  if (SUITES.has(item)) {
    out.suites = [...(out.suites ?? []), item as SuiteTag];
    return;
  }
  if (PRIORITIES.has(item)) {
    out.priority = item as PriorityTag;
    return;
  }
  if (/^BUG[-_]/i.test(item)) {
    out.bug = item;
    return;
  }
  if (/^(\d+|[A-Z][A-Z0-9]*-[A-Z0-9]+-\d+)$/.test(item)) {
    out.id = item;
    return;
  }
  if (MODULES().has(item as (typeof Tag.module)[keyof typeof Tag.module])) {
    out.module = item;
    return;
  }
  if (FEATURES().has(item as (typeof Tag.feature)[keyof typeof Tag.feature])) {
    out.feature = item;
    return;
  }
  out.extra = [...(out.extra ?? []), item];
}

export function parseCaseId(title: string): string | undefined {
  return title.match(/^\[([A-Za-z0-9-]+)\]/)?.[1];
}

export function parseScenarioName(title: string): string {
  return title.replace(/^\[[A-Za-z0-9-]+\]\s*/, '').trim();
}

export function inferScenario(id?: string): ScenarioTag | undefined {
  if (!id) return undefined;
  if (/-HP-/.test(id)) return Tag.Happy;
  if (/-NG-/.test(id)) return Tag.Negative;
  if (/-CR-|-CN-/.test(id)) return Tag.Corner;
}

export function tagList(tags: CaseTags): string[] {
  return [
    tags.id,
    tags.module,
    tags.feature,
    tags.scenario,
    ...(tags.suites ?? []),
    tags.priority,
    tags.bug,
    ...(tags.extra ?? []),
  ].filter((v): v is string => Boolean(v));
}

export function matchesFilter(tags: CaseTags, filter?: string): boolean {
  if (!filter) return true;
  const wanted = filter.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const have = tagList(tags).map((s) => s.toLowerCase());
  return wanted.every((item) => have.includes(item));
}

export function severityOf(priority?: PriorityTag): 'blocker' | 'critical' | 'normal' | 'minor' | undefined {
  if (priority === Tag.p0) return 'blocker';
  if (priority === Tag.p1) return 'critical';
  if (priority === Tag.p2) return 'normal';
  if (priority === Tag.p3) return 'minor';
}
