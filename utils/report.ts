import allure from '@wdio/allure-reporter';

type StepStatus = Parameters<typeof allure.endStep>[0];
import { currentPlatform } from '@madark/config/capabilities';
import { I18n } from '@madark/i18n/i18n';
import { loadEnv } from '@madark/environment';
import { parseScenarioName, severityOf, tagList, type CaseTags } from '@madark/utils/tag';

const PREFIXES: { match: RegExp; action: string; keyword: 'Given' | 'When' | 'Then' }[] = [
  { match: /^clickOn(.+)$/, action: 'click on', keyword: 'When' },
  { match: /^enter(.+)$/, action: 'enter', keyword: 'When' },
  { match: /^select(.+)$/, action: 'select', keyword: 'When' },
  { match: /^check(.+)$/, action: 'check', keyword: 'When' },
  { match: /^uncheck(.+)$/, action: 'uncheck', keyword: 'When' },
  { match: /^goTo(.+)$/, action: 'go to', keyword: 'When' },
  { match: /^swipe(.+)$/, action: 'swipe', keyword: 'When' },
  { match: /^set(.+)$/, action: 'set', keyword: 'When' },
  { match: /^press(.+)$/, action: 'press', keyword: 'When' },
  { match: /^open(.+)$/, action: 'open', keyword: 'When' },
  { match: /^grant(.+)$/, action: 'grant', keyword: 'When' },
  { match: /^revoke(.+)$/, action: 'revoke', keyword: 'When' },
  { match: /^is(.+)$/, action: 'is', keyword: 'Then' },
  { match: /^get(.+)$/, action: 'get', keyword: 'Then' },
];

export function allureTitle(method: string, fallback: 'Given' | 'When' | 'Then' = 'When'): string {
  const parsed = parseMethod(method);
  return `${parsed.keyword ?? fallback} ${parsed.action} — ${method}`;
}

export async function given<T>(method: string, fn?: () => Promise<T> | T): Promise<T | void> {
  return step(allureTitle(method, 'Given'), fn);
}

export async function when<T>(method: string, fn: () => Promise<T> | T): Promise<T> {
  return step(allureTitle(method, 'When'), fn) as Promise<T>;
}

export async function then<T>(method: string, fn: () => Promise<T> | T): Promise<T> {
  return step(allureTitle(method, 'Then'), fn) as Promise<T>;
}

export async function step<T>(title: string, fn?: () => Promise<T> | T): Promise<T | void> {
  allure.startStep(title);
  try {
    const result = fn ? await fn() : undefined;
    allure.endStep('passed' as StepStatus);
    return result;
  } catch (err) {
    allure.endStep('failed' as StepStatus);
    throw err;
  }
}

export function annotateCase({
  title,
  specFile,
  tags,
  adoUrl,
}: {
  title: string;
  specFile: string;
  tags: CaseTags;
  adoUrl?: string;
}): void {
  const env = loadEnv();
  const platform = currentPlatform();
  const moduleName = titleCase(tags.module || 'unknown');
  const scenarioName = parseScenarioName(title);
  const severity = severityOf(tags.priority);

  allure.addEpic(process.env.APP_NAME || 'Madark Customer App');
  allure.addFeature(titleCase(tags.feature || tags.module || 'unknown'));
  allure.addStory(scenarioName || specFile);
  allure.addSuite(moduleName);
  allure.addSubSuite(specFile);
  allure.addLabel('package', `specs/${tags.module}/${specFile}`);
  allure.addLabel('parentSuite', moduleName);
  for (const item of tagList(tags)) allure.addTag(item);
  allure.addTag(platform);
  allure.addTag(I18n.lang);
  allure.addTag(env.name);
  if (severity) allure.addSeverity(severity);
  if (tags.bug) allure.addIssue(tags.bug);
  if (adoUrl) allure.addLink(adoUrl, `ADO ${tags.id ?? ''}`.trim(), 'tms');
  allure.addArgument('Encryption', String(env.encryption));
  allure.addArgument('Module', moduleName);
  if (tags.feature) allure.addArgument('Feature', tags.feature);
  allure.addArgument('Spec file', specFile);
  if (tags.id) allure.addArgument('Test case', tags.id);
  if (scenarioName) allure.addArgument('Scenario name', scenarioName);
  if (tags.scenario) allure.addArgument('Scenario', tags.scenario);
}

function parseMethod(method: string): { keyword?: 'Given' | 'When' | 'Then'; action: string } {
  for (const rule of PREFIXES) {
    const hit = method.match(rule.match);
    if (hit) return { keyword: rule.keyword, action: `${rule.action} ${words(hit[1])}`.trim() };
  }
  return { action: words(method) };
}

function words(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toLowerCase())
    .trim()
    .toLowerCase();
}

function titleCase(s: string): string {
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
