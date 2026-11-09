import { createContext, useContext } from "react";

/** Per-format Adsterra kill switch. Fail closed when Edge Config is unavailable. */
export type AdsFormats = {
  banner: boolean;
  native: boolean;
  socialBar: boolean;
  popunder: boolean;
};

export type AdsConfig = {
  enabled: boolean;
  formats: AdsFormats;
};

export const ADS_OFF: AdsConfig = {
  enabled: false,
  formats: {
    banner: false,
    native: false,
    socialBar: false,
    popunder: false,
  },
};

export function isAdFormatOn(config: AdsConfig, format: keyof AdsFormats): boolean {
  return config.enabled === true && config.formats[format] === true;
}

export const AdsConfigContext = createContext<AdsConfig>(ADS_OFF);

export function useAdsConfig(): AdsConfig {
  return useContext(AdsConfigContext);
}

export function useAdFormat(format: keyof AdsFormats): boolean {
  return isAdFormatOn(useAdsConfig(), format);
}
