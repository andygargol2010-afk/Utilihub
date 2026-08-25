import { makeTool } from "./types";

const d = (slug: string, name: string, summary: string, keywords: string[]) =>
  makeTool(slug, name, "desarrollo", "dev-advanced", summary, keywords);

export const DEV_EXTRA_TOOLS = [
  d("json-sort-keys", "Ordenar claves JSON", "Ordena recursivamente las claves de un objeto JSON para normalizar estructuras, facilitar comparaciones y preparar datos para control de versiones.", ["json", "ordenar json", "sort keys", "normalizar json", "developer"]),
  d("json-stringify", "JSON Stringify", "Parsea JSON válido y devuelve su representación JSON serializada, lista para incrustar en código o almacenar.", ["json stringify", "json string", "serializar json", "escape json", "javascript"]),
  d("json-unescape", "JSON Unescape", "Decodifica una cadena JSON escapada y muestra el valor resultante sin las secuencias de escape innecesarias.", ["json unescape", "deserializar json", "decode json string", "json escape"]),
  d("json-path", "Extractor de valor JSON por ruta", "Extrae valores de un documento JSON mediante notación de puntos, corchetes, índices, comodines y filtros básicos.", ["json path", "extraer json", "json query", "json nested value", "developer"]),
  d("json-diff", "Comparador JSON", "Compara dos documentos JSON ignorando el orden de las claves y señala rutas añadidas, eliminadas o modificadas.", ["json diff", "comparar json", "json comparison", "diff json", "developer"]),
  d("csv-to-json", "CSV a JSON", "Convierte CSV con encabezados en un array de objetos JSON respetando campos entre comillas, separadores y saltos de línea.", ["csv json", "csv a json", "convertir csv", "csv parser", "developer"]),
  d("csv-validator", "Validador CSV", "Detecta filas con diferente número de columnas y muestra una vista de los encabezados y errores estructurales del CSV.", ["validar csv", "csv validator", "csv errores", "csv columns"]),
  d("xml-formatter", "Formateador XML", "Indenta y normaliza XML en el navegador para inspeccionar documentos, configuraciones y respuestas estructuradas.", ["xml formatter", "formatear xml", "pretty xml", "xml online", "developer"]),
  d("xml-escape", "XML Escape", "Escapa texto según el contexto de contenido de nodo XML o atributo XML, convirtiendo caracteres reservados en entidades.", ["xml escape", "escapar xml", "xml entities", "developer"]),
  d("url-parser", "Analizador de URL", "Descompone una URL en protocolo, host, puerto, ruta, parámetros, hash, origen y credenciales visibles sin realizar peticiones.", ["url parser", "analizar url", "url components", "parse url", "developer"]),
  d("query-string-parser", "Parser de Query String", "Convierte los parámetros de una query string en una tabla de claves y valores, incluyendo parámetros repetidos.", ["query string", "url parameters", "parse query", "search params", "developer"]),
  d("query-string-builder", "Constructor de Query String", "Construye una query string codificada a partir de pares clave-valor y permite generar una URL completa.", ["query builder", "query string builder", "url params", "searchparams", "developer"]),
  d("http-header-builder", "Constructor de Headers HTTP", "Convierte líneas Nombre: Valor en un objeto JSON de cabeceras HTTP, conserva cabeceras repetidas y detecta líneas mal formadas.", ["http headers", "headers builder", "http header json", "headers online", "developer"]),
  d("jwt-decoder", "Decodificador JWT", "Decodifica el header y payload de un JWT localmente sin verificar su firma; muestra fechas JWT conocidas cuando existen.", ["jwt decoder", "decode jwt", "json web token", "jwt payload", "developer"]),
  d("jwt-header-inspector", "Inspector de Header JWT", "Inspecciona exclusivamente el header de un JWT y destaca algoritmo, tipo y campos adicionales sin validar criptográficamente el token.", ["jwt header", "jwt inspector", "alg jwt", "typ jwt", "developer"]),
  d("regex-match-extractor", "Extractor de coincidencias Regex", "Ejecuta una expresión regular sobre texto y muestra coincidencias, grupos capturados e índices de cada resultado.", ["regex matches", "regex extractor", "regexp", "capturing groups", "developer"]),
  d("regex-replace", "Probador Regex Replace", "Prueba reemplazos con una expresión regular usando campos específicos para patrón, texto, flags y reemplazo.", ["regex replace", "regexp replace", "buscar reemplazar regex", "developer"]),
  d("regex-split", "Regex Split", "Divide texto utilizando una expresión regular como separador con campos específicos para patrón, texto y flags.", ["regex split", "regexp split", "split regex", "developer"]),
  d("unicode-inspector", "Inspector Unicode", "Examina caracteres individualmente y muestra punto de código, representación U+, UTF-16 y nombre aproximado cuando es reconocible.", ["unicode inspector", "unicode codepoint", "utf 16", "caracteres unicode", "developer"]),
  d("html-table-generator", "Generador de tabla HTML", "Valida datos tabulares con separador de coma o tabulación y genera una tabla HTML escapada sin filas estructuralmente inconsistentes.", ["html table", "generador tabla html", "html generator", "table html", "developer"]),
];
