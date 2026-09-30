import { excelEmbedConfig } from '../config/excelEmbeds';
import { ENVIRONMENT_TYPES, MONTHS, YEARS } from '../config/filters';

// Builds the mapped-view lookup key from the three filter values, e.g.
// buildViewKey('2026', 'January', 'Non Production') -> '2026-January-Non-Production'
export function buildViewKey(year, month, environmentType) {
  if (!year || !month || !environmentType) return null;
  const environmentKey = environmentType.trim().replace(/\s+/g, '-');
  return `${year}-${month}-${environmentKey}`;
}

function isPlaceholder(url) {
  if (!url) return true;
  const trimmed = url.trim();
  return trimmed === '' || trimmed.includes('PASTE_APPROVED_EXCEL_EMBED_URL_HERE');
}

export function isValidYear(value) {
  return YEARS.includes(value);
}

export function isValidMonth(value) {
  return MONTHS.includes(value);
}

export function isValidEnvironmentType(value) {
  return ENVIRONMENT_TYPES.includes(value);
}

// Resolves what the dashboard should render for a given activity + filter
// selection. Returns a discriminated-union-style object: { status, ... }.
//
// status values:
//   'unsupported-activity' - the activityId is not in excelEmbedConfig
//   'incomplete'           - one or more of year/month/environment is missing
//   'missing'              - the activity/filter combination has no embed URL configured
//   'ready'                - embedUrl is populated and safe to render
export function resolveEmbedView(activityId, { year, month, environment } = {}) {
  const activityConfig = excelEmbedConfig[activityId];

  if (!activityConfig) {
    return { status: 'unsupported-activity' };
  }

  if (!year || !month || !environment) {
    return { status: 'incomplete', activityConfig };
  }

  if (activityConfig.filterMode === 'excel-native') {
    const url = activityConfig.defaultEmbedUrl;
    if (isPlaceholder(url)) {
      return { status: 'missing', activityConfig };
    }
    return { status: 'ready', embedUrl: url, activityConfig };
  }

  // 'mapped-views' (the only mode active in this initial implementation)
  const viewKey = buildViewKey(year, month, environment);
  const url = activityConfig.views?.[viewKey];

  if (isPlaceholder(url)) {
    return { status: 'missing', activityConfig, viewKey };
  }

  return { status: 'ready', embedUrl: url, activityConfig, viewKey };
}
