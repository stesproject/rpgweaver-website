import en from "./en.json";
import it from "./it.json";
import { DEFAULT_LANG, type SupportedLang } from "./config";

const dictionaries: Record<SupportedLang, Record<string, any>> = {
  en,
  it
};

export function getLangFromUrl(url: URL | string): SupportedLang {
  const pathname = typeof url === "string" ? url : url.pathname;
  if (pathname.startsWith("/it") || pathname === "/it") {
    return "it";
  }
  return DEFAULT_LANG;
}

export function localizeUrl(path: string, lang: SupportedLang = DEFAULT_LANG): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (lang === "it") {
    if (cleanPath === "/" || cleanPath === "") {
      return "/it";
    }
    if (cleanPath.startsWith("/it/")) {
      return cleanPath;
    }
    return `/it${cleanPath}`;
  }

  if (cleanPath.startsWith("/it/")) {
    return cleanPath.replace(/^\/it/, "") || "/";
  }
  if (cleanPath === "/it") {
    return "/";
  }
  return cleanPath;
}

export function getSwitchLocaleUrl(currentPath: string, targetLang: SupportedLang): string {
  return localizeUrl(currentPath, targetLang);
}

export function useTranslations(lang: SupportedLang = DEFAULT_LANG) {
  return function t(key: string, params?: Record<string, string | number>): any {
    const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG];
    const fallbackDict = dictionaries[DEFAULT_LANG];

    const keys = key.split(".");
    let value: any = dict;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      let fallbackVal: any = fallbackDict;
      for (const k of keys) {
        if (fallbackVal && typeof fallbackVal === "object" && k in fallbackVal) {
          fallbackVal = fallbackVal[k];
        } else {
          fallbackVal = undefined;
          break;
        }
      }
      value = fallbackVal;
    }

    if (value === undefined) {
      return key;
    }

    if (typeof value === "string" && params) {
      return Object.entries(params).reduce((acc, [paramKey, paramVal]) => {
        return acc.replaceAll(`{${paramKey}}`, String(paramVal));
      }, value);
    }

    return value;
  };
}
