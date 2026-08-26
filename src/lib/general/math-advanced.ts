import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"matematicas","stats",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const MATH_ADVANCED_TOOLS=[
 t("desviacion-media-absoluta","Desviación media absoluta","Calcula la media de las desviaciones absolutas respecto de la media.",["Datos"],"mad"),
 t("coeficiente-variacion","Coeficiente de variación","Calcula la desviación estándar relativa expresada como porcentaje.",["Datos"],"cv"),
 t("error-porcentual","Error porcentual","Calcula el error porcentual respecto de un valor aceptado.",["Valor experimental","Valor aceptado"],"percent-error"),
 t("error-absoluto","Error absoluto","Calcula la diferencia absoluta entre un valor medido y uno de referencia.",["Valor medido","Valor de referencia"],"absolute-error"),
 t("error-relativo","Error relativo","Calcula el error absoluto dividido por el valor de referencia.",["Valor medido","Valor de referencia"],"relative-error"),
 t("media-ponderada","Media ponderada","Calcula una media usando un peso para cada valor.",["Valores","Pesos"],"weighted-mean"),
 t("media-armonica","Media armónica","Calcula la media armónica de una lista de valores no nulos.",["Datos"],"harmonic-mean"),
 t("media-geometrica","Media geométrica","Calcula la media geométrica de valores positivos.",["Datos"],"geometric-mean"),
 t("probabilidad-condicional","Probabilidad condicional","Calcula P(A|B) a partir de P(A∩B) y P(B).",["P(A ∩ B)","P(B)"],"conditional"),
 t("teorema-bayes","Teorema de Bayes","Calcula P(A|B) usando P(A), P(B|A) y P(B|no A).",["P(A)","P(B|A)","P(B|no A)"],"bayes"),
 t("distribucion-binomial","Distribución binomial","Calcula la probabilidad de obtener exactamente k éxitos en n ensayos.",["n ensayos","k éxitos","p de éxito"],"binomial"),
 t("distribucion-normal","Distribución normal","Calcula la probabilidad acumulada de una distribución normal hasta x.",["x","Media","Desviación estándar"],"normal"),
 t("distribucion-poisson","Distribución de Poisson","Calcula la probabilidad de observar k eventos con tasa media λ.",["k eventos","λ"],"poisson"),
 t("puntuacion-t","Puntuación T","Calcula una puntuación T estandarizada a partir de un valor, media y desviación estándar.",["Valor","Media","Desviación estándar"],"t-score"),
 t("intervalo-confianza","Intervalo de confianza","Calcula un intervalo de confianza aproximado para una media usando un valor crítico z.",["Desviación estándar","Media muestral","Tamaño de muestra","Valor z"],"confidence"),
 t("tamano-muestra","Tamaño de muestra","Calcula el tamaño muestral para estimar una proporción con margen de error dado.",["Valor z","Margen de error","Proporción esperada"],"sample-size"),
 t("frecuencia-relativa","Frecuencia relativa","Calcula la proporción de una frecuencia respecto del total.",["Frecuencia","Total"],"relative-frequency"),
 t("frecuencia-acumulada","Frecuencia acumulada","Genera las frecuencias acumuladas a partir de una lista de frecuencias.",["Frecuencias"],"cumulative-frequency"),
 t("amplitud-clase","Amplitud de clase","Calcula la amplitud de cada clase a partir del rango y el número de clases.",["Mínimo","Máximo","Número de clases"],"class-width"),
 t("interpolacion-lineal","Interpolación lineal","Calcula y mediante interpolación lineal entre dos puntos conocidos.",["x","x1","x2","y1","y2"],"linear-interpolation"),
];
