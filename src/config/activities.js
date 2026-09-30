// Single source of truth for every activity: its route, display copy and
// accessibility labels. Activity cards, the Activity filter dropdown, route
// validation and page titles are all generated from this list so the same
// activity never has to be typed out in more than one place.

export const activities = [
  {
    id: 'aks-upgrades',
    displayName: 'AKS Upgrades',
    pageTitle: 'AKS UPGRADES',
    route: '/activities/aks-upgrades',
    cardOrder: 1,
    ariaLabel: 'View the AKS Upgrades dashboard',
  },
  {
    id: 'rman-backup-encryption',
    displayName: 'RMAN Backup Encryption',
    pageTitle: 'RMAN BACKUP ENCRYPTION',
    route: '/activities/rman-backup-encryption',
    cardOrder: 2,
    ariaLabel: 'View the RMAN Backup Encryption dashboard',
  },
  {
    id: 'encryption-at-host-ifs-cloud',
    displayName: 'Encryption at Host for IFS Cloud',
    pageTitle: 'ENCRYPTION AT HOST FOR IFS CLOUD',
    route: '/activities/encryption-at-host-ifs-cloud',
    cardOrder: 3,
    ariaLabel: 'View the Encryption at Host for IFS Cloud dashboard',
  },
  {
    id: 'os-patching',
    displayName: 'OS Patching',
    pageTitle: 'OS PATCHING',
    route: '/activities/os-patching',
    cardOrder: 4,
    ariaLabel: 'View the OS Patching dashboard',
  },
  {
    id: 'encryption-at-host-apps10',
    displayName: 'Encryption at Host for Apps10',
    pageTitle: 'ENCRYPTION AT HOST FOR APPS10',
    route: '/activities/encryption-at-host-apps10',
    cardOrder: 5,
    ariaLabel: 'View the Encryption at Host for Apps10 dashboard',
  },
];

export const getActivityById = (activityId) =>
  activities.find((activity) => activity.id === activityId);

export const isValidActivityId = (activityId) => Boolean(getActivityById(activityId));
