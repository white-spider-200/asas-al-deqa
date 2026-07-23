export const SERVICE_SLUGS = [
  'tax-compliance',
  'accounting',
  'tax-management',
  'tax-litigation',
  'documentation',
  'inventory',
  'erp',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Map URL slug to i18n key suffix */
export const SLUG_TO_I18N_KEY: Record<ServiceSlug, string> = {
  'tax-compliance': 'tax_compliance',
  accounting: 'accounting',
  'tax-management': 'tax_management',
  'tax-litigation': 'tax_litigation',
  documentation: 'documentation',
  inventory: 'inventory',
  erp: 'erp',
};

export function isServiceSlug(value: string | undefined): value is ServiceSlug {
  return SERVICE_SLUGS.includes(value as ServiceSlug);
}
