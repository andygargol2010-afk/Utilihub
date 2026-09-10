import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"matematicas","stats",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const MATH_ADVANCED_TOOLS=[
 t("desviacion-media-absoluta","Mean absolute deviation","Calculate the mean of absolute deviations from the mean.",["Data"],"mad"),
 t("coeficiente-variacion","Coefficient of variation","Calculate relative standard deviation as a percentage.",["Data"],"cv"),
 t("error-porcentual","Percentage error","Calculate percentage error relative to an accepted value.",["Experimental value","Accepted value"],"percent-error"),
 t("error-absoluto","Absolute error","Calculate the absolute difference between a measured and a reference value.",["Measured value","Reference value"],"absolute-error"),
 t("error-relativo","Relative error","Calculate absolute error divided by the reference value.",["Measured value","Reference value"],"relative-error"),
 t("media-ponderada","Weighted mean","Calculate a mean using a weight for each value.",["Values","Weights"],"weighted-mean"),
 t("media-armonica","Harmonic mean","Calculate the harmonic mean of a list of non-zero values.",["Data"],"harmonic-mean"),
 t("media-geometrica","Geometric mean","Calculate the geometric mean of positive values.",["Data"],"geometric-mean"),
 t("probabilidad-condicional","Conditional probability","Calculate P(A|B) from P(A∩B) and P(B).",["P(A ∩ B)","P(B)"],"conditional"),
 t("teorema-bayes","Bayes' theorem","Calculate P(A|B) using P(A), P(B|A), and P(B|not A).",["P(A)","P(B|A)","P(B|not A)"],"bayes"),
 t("distribucion-binomial","Binomial distribution","Calculate the probability of exactly k successes in n trials.",["n trials","k successes","p of success"],"binomial"),
 t("distribucion-normal","Normal distribution","Calculate the cumulative probability of a normal distribution up to x.",["x","Mean","Standard deviation"],"normal"),
 t("distribucion-poisson","Poisson distribution","Calculate the probability of observing k events with mean rate λ.",["k events","λ"],"poisson"),
 t("puntuacion-t","T-score","Calculate a standardized T-score from a value, mean, and standard deviation.",["Value","Mean","Standard deviation"],"t-score"),
 t("intervalo-confianza","Confidence interval","Calculate an approximate confidence interval for a mean using a critical z value.",["Standard deviation","Sample mean","Sample size","z value"],"confidence"),
 t("tamano-muestra","Sample size","Calculate sample size to estimate a proportion with a given margin of error.",["z value","Margin of error","Expected proportion"],"sample-size"),
 t("frecuencia-relativa","Relative frequency","Calculate the proportion of a frequency relative to the total.",["Frequency","Total"],"relative-frequency"),
 t("frecuencia-acumulada","Cumulative frequency","Generate cumulative frequencies from a list of frequencies.",["Frequencies"],"cumulative-frequency"),
 t("amplitud-clase","Class width","Calculate class width from the range and number of classes.",["Minimum","Maximum","Number of classes"],"class-width"),
 t("interpolacion-lineal","Linear interpolation","Calculate y by linear interpolation between two known points.",["x","x1","x2","y1","y2"],"linear-interpolation"),
];
