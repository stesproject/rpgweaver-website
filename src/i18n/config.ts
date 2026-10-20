export const DEFAULT_LANG = "en" as const;
export const SUPPORTED_LANGS = ["en", "it"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
