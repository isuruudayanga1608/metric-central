// Allowed values for the Year / Month / Environment Type filters.
// Keep these in sync with the mapped-view keys built in src/services/embedResolver.js.

export const YEARS = ['2025', '2026'];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Display text is used verbatim in the URL query string and the mapped-view key.
export const ENVIRONMENT_TYPES = ['Production', 'Non Production'];

export const FILTER_QUERY_KEYS = {
  year: 'year',
  month: 'month',
  environment: 'environment',
};
