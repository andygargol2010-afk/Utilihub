export const LEGACY_CATEGORY_REDIRECTS:Record<string,string>={calculadoras:"matematicas",conversores:"conversiones",texto:"texto",fechas:"fechas",seguridad:"seguridad"};

/**
 * Navigation curation: a tool keeps a single primary URL and category,
 * but may appear in additional categories when it serves a distinct
 * legitimate intent. Not used to create duplicate URLs.
 */
export const SECONDARY_CATEGORY_MAP:Record<string,string[]>={
  "generador-de-contrasenas":["texto","generadores"],
  "password-strength":["texto"],
  passphrase:["texto","generadores"],
  "token-seguro":["generadores"],
  "uuid-generator":["generadores"],
  "random-id-generator":["generadores"],
  "slug-generator":["texto","productividad"],
  "generador-nombres-archivos":["texto","generadores"],
  "json-a-csv":["conversiones"],
  "json-a-yaml":["conversiones"],
  "base64-encode":["conversiones","seguridad"],
  "base64-decode":["conversiones","seguridad"],
  "url-encode":["conversiones"],
  "url-decode":["conversiones"],
  "html-encode":["conversiones","texto"],
  "html-decode":["conversiones","texto"],
  "timestamp-generator":["fechas"],
  "timestamp-to-date":["fechas"],
  "conversor-datos":["desarrollo"],
};
