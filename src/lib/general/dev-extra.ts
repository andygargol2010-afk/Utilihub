import { makeTool } from "./types";

const d = (slug: string, name: string, summary: string, keywords: string[]) =>
  makeTool(slug, name, "desarrollo", "dev-advanced", summary, keywords);

export const DEV_EXTRA_TOOLS = [
  d("json-sort-keys", "Ordenar claves JSON", "Ordena recursivamente las claves de un objeto JSON para normalizar estructuras, facilitar comparaciones y preparar datos para control de versiones.", ["json", "ordenar json", "sort keys", "normalizar json", "developer"]),
  d("json-stringify", "JSON Stringify", "Parsea JSON válido y permite elegir entre JSON compacto en una línea o JSON indentado con 2 espacios.", ["json stringify", "json string", "serializar json", "json compacto", "json indentado", "javascript"]),
  d("json-unescape", "JSON Unescape", "Recibe una cadena JSON escapada, elimina sus escapes mediante JSON.parse y devuelve el contenido legible sin volver a envolverlo.", ["json unescape", "deserializar json", "decode json string", "json escape"]),
  d("json-path", "Extractor de valor JSON por ruta", "Extrae valores mediante un subconjunto explícito de JSONPath: puntos, corchetes, índices, comodines y filtros con comparaciones estrictas y && / ||.", ["json path", "extraer json", "json query", "json nested value", "json filter", "developer"]),
  d("json-diff", "Comparador JSON", "Compara dos documentos JSON ignorando el orden de las claves y señala rutas añadidas, eliminadas o modificadas.", ["json diff", "comparar json", "json comparison", "diff json", "developer"]),
  d("csv-to-json", "CSV a JSON", "Convierte CSV con encabezados en un array de objetos JSON, valida la estructura y bloquea encabezados duplicados antes del mapeo.", ["csv json", "csv a json", "convertir csv", "csv parser", "developer"]),
  d("csv-validator", "Validador CSV", "Valida columnas, conserva líneas vacías para el diagnóstico y reporta advertencias estructurales sin ocultar información.", ["validar csv", "csv validator", "csv errores", "csv columns"]),
  d("xml-formatter", "Formateador XML", "Formatea XML en el navegador preservando contenido mixto, texto significativo, CDATA y comentarios.", ["xml formatter", "formatear xml", "pretty xml", "xml online", "developer"]),
  d("xml-escape", "XML Escape", "Escapa texto según el contexto de contenido de nodo XML o atributo XML, convirtiendo caracteres reservados en entidades.", ["xml escape", "escapar xml", "xml entities", "developer"]),
  d("url-parser", "Analizador de URL", "Descompone una URL en protocolo, host, puerto, ruta, parámetros, hash, origen y credenciales visibles sin realizar peticiones.", ["url parser", "analizar url", "url components", "parse url", "developer"]),
  d("query-string-parser", "Parser de Query String", "Convierte los parámetros de una query string en una tabla de claves y valores, incluyendo parámetros repetidos.", ["query string", "url parameters", "parse query", "search params", "developer"]),
  d("query-string-builder", "Constructor de Query String", "Construye una query string codificada a partir de pares clave-valor y acepta también claves sin signo igual, que se serializan como clave=.", ["query builder", "query string builder", "url params", "searchparams", "developer"]),
  d("http-header-builder", "Analizador de Headers HTTP", "Analiza HTTP raw en un objeto JSON, conserva cabeceras repetidas y detecta líneas mal formadas.", ["http headers", "analizador headers", "http header json", "headers online", "developer"]),
  d("jwt-decoder", "Decodificador JWT", "Decodifica el header y payload de un JWT localmente sin verificar su firma y convierte iat, exp y nbf a fechas legibles cuando son válidos.", ["jwt decoder", "decode jwt", "json web token", "jwt payload", "developer"]),
  d("jwt-header-inspector", "Inspector de Header JWT", "Inspecciona el header de un JWT y destaca visualmente alg y typ sin validar criptográficamente el token.", ["jwt header", "jwt inspector", "alg jwt", "typ jwt", "developer"]),
  d("regex-match-extractor", "Extractor de coincidencias Regex", "Ejecuta una expresión regular respetando exactamente las flags introducidas y muestra coincidencias, grupos capturados e índices.", ["regex matches", "regex extractor", "regexp", "capturing groups", "developer"]),
  d("regex-replace", "Probador Regex Replace", "Prueba reemplazos con campos específicos para patrón, texto de entrada, flags y texto de reemplazo.", ["regex replace", "regexp replace", "buscar reemplazar regex", "developer"]),
  d("regex-split", "Regex Split", "Divide texto utilizando una expresión regular como separador con campos específicos para patrón, texto de entrada y flags.", ["regex split", "regexp split", "split regex", "developer"]),
  d("unicode-inspector", "Inspector Unicode", "Examina caracteres individualmente y muestra punto de código y los code units UTF-16 exactos, incluidos pares subrogados.", ["unicode inspector", "unicode codepoint", "utf 16", "caracteres unicode", "developer"]),
  d("html-table-generator", "Generador de tabla HTML", "Valida datos tabulares con separador de coma o tabulación y permite decidir si la primera fila actúa como encabezado.", ["html table", "generador tabla html", "html generator", "table html", "developer"]),
];
