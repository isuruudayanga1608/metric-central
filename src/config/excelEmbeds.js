// Centralized filter-to-embed mapping for Option 1 (Excel Online view-only embeds).
//
// HOW TO FILL THIS IN
// --------------------
// 1. Prepare the workbook in OneDrive/SharePoint (see README.md > "Preparing the workbook").
// 2. For each Year + Month + Environment Type combination you want to support,
//    generate an approved, view-only "embed" URL for the matching chart, named
//    range, PivotChart or dashboard worksheet.
// 3. Paste that URL as the value for the matching key inside `views`.
// 4. Leave any combination you do not yet support as an empty string — the
//    dashboard will show the "no view configured" message for it instead of
//    guessing or falling back to another view.
//
// `defaultEmbedUrl` is only used when `filterMode` is switched to
// 'excel-native' (see README.md > "Future Excel-native filter mode"). It is
// not used by 'mapped-views' and can be left blank for now.
//
// Never put a real, unapproved, or editable sharing URL here. Use the
// PASTE_APPROVED_EXCEL_EMBED_URL_HERE placeholder until an approved,
// view-only embed URL has been generated and tested (README.md has the
// full checklist).

const PLACEHOLDER = '';

export const excelEmbedConfig = {
  'aks-upgrades': {
    displayName: 'AKS Upgrades',
    pageTitle: 'AKS UPGRADES',
    filterMode: 'mapped-views',
    defaultEmbedUrl: PLACEHOLDER,
    views: {
      '2025-January-Production': PLACEHOLDER,
      '2025-January-Non-Production': PLACEHOLDER,
      '2025-February-Production': PLACEHOLDER,
      '2025-February-Non-Production': PLACEHOLDER,
      '2026-January-Production': PLACEHOLDER,
      '2026-January-Non-Production': PLACEHOLDER,
      // Latest data currently in the source workbook (verified: 2026 June).
      // Each chart now lives alone on its own dedicated, dark-themed sheet
      // (see workbook-source/MetricCentral.xlsx) instead of sharing the
      // "Metrics" data sheet, and each chart has a unique name matching the
      // sheet name below.
      '2026-June-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=AKS_2026_June_Prod&wdDownloadButton=True&wdInConfigurator=True',
      '2026-June-Non-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=AKS_2026_June_NonProd&wdDownloadButton=True&wdInConfigurator=True',
    },
  },

  'rman-backup-encryption': {
    displayName: 'RMAN Backup Encryption',
    pageTitle: 'RMAN BACKUP ENCRYPTION',
    filterMode: 'mapped-views',
    defaultEmbedUrl: PLACEHOLDER,
    views: {
      // Sheet: RMAN_2026_June_Prod / RMAN_2026_June_NonProd
      '2026-June-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=RMAN_2026_June_Prod&wdDownloadButton=True&wdInConfigurator=True',
      '2026-June-Non-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=RMAN_2026_June_NonProd&wdDownloadButton=True&wdInConfigurator=True',
    },
  },

  'encryption-at-host-ifs-cloud': {
    displayName: 'Encryption at Host for IFS Cloud',
    pageTitle: 'ENCRYPTION AT HOST FOR IFS CLOUD',
    filterMode: 'mapped-views',
    defaultEmbedUrl: PLACEHOLDER,
    views: {
      // Sheet: EncIFS_2026_June_Prod / EncIFS_2026_June_NonProd
      '2026-June-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=EncIFS_2026_June_Prod&wdDownloadButton=True&wdInConfigurator=True',
      '2026-June-Non-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=EncIFS_2026_June_NonProd&wdDownloadButton=True&wdInConfigurator=True',
    },
  },

  'os-patching': {
    displayName: 'OS Patching',
    pageTitle: 'OS PATCHING',
    filterMode: 'mapped-views',
    defaultEmbedUrl: PLACEHOLDER,
    views: {
      // Sheet: OSPatch_2026_June_Prod / OSPatch_2026_June_NonProd
      '2026-June-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=OSPatch_2026_June_Prod&wdDownloadButton=True&wdInConfigurator=True',
      '2026-June-Non-Production':
        'https://ifs-my.sharepoint.com/personal/isuru_udayanga_ifs_com/_layouts/15/Doc.aspx?sourcedoc=%7Ba291b2b2-7829-436a-9e51-d32002190bd2%7D&action=embedview&wdAllowInteractivity=False&Item=OSPatch_2026_June_NonProd&wdDownloadButton=True&wdInConfigurator=True',
    },
  },

  // NOTE: the source workbook (MetricCentralData.xlsx) currently has no rows
  // at all for this activity. Its views are intentionally left empty until
  // data for it exists — do not fabricate a mapping here.
  'encryption-at-host-apps10': {
    displayName: 'Encryption at Host for Apps10',
    pageTitle: 'ENCRYPTION AT HOST FOR APPS10',
    filterMode: 'mapped-views',
    defaultEmbedUrl: PLACEHOLDER,
    views: {},
  },
};

// Placeholder text shown/checked for in code so a half-configured entry never
// silently renders an iframe pointed at nothing.
export const PLACEHOLDER_URL_TEXT = 'PASTE_APPROVED_EXCEL_EMBED_URL_HERE';
