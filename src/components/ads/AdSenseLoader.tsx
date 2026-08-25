import { useEffect } from "react";
import { ADSENSE_ENABLED, adsenseClientId } from "@/lib/adsense";

/**
 * Loads the AdSense script only when a real publisher ID is configured.
 * Keeping this opt-in prevents accidental ad requests in development/preview.
 */
export function AdSenseLoader() {
  useEffect(() => {
    const clientId = adsenseClientId();
    if (!ADSENSE_ENABLED || !clientId || document.querySelector("script[data-utilihub-adsense]") ) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
    script.crossOrigin = "anonymous";
    script.dataset.utilihubAdsense = "true";
    document.head.appendChild(script);
  }, []);

  return null;
}
