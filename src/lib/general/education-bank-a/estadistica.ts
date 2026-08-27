import type { EducationDifficulty, EducationLevel } from "../education-engine";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});

export const ESTADISTICA:Q[]=[
 q("¿Cuál es el promedio de 4, 6 y 8?",["6","5","7","18"],"6",["primaria","secundaria"],"facil"),
 q("¿Cuál es la mediana de 2, 5 y 9?",["5","2","9","16"],"5",["primaria","secundaria"],"facil"),
 q("¿Cuál es la moda de 3, 4, 4, 7?",["4","3","7","18"],"4",["primaria","secundaria"],"facil"),
 q("¿Cuál es el rango de 5, 8, 11 y 14?",["9","14","5","19"],"9",["primaria","secundaria"],"facil"),
 q("¿Qué medida divide los datos ordenados en dos mitades?",["Mediana","Media","Varianza","Desviación estándar"],"Mediana",["primaria","secundaria"],"facil"),
 q("¿Qué medida indica el valor que aparece con mayor frecuencia?",["Moda","Mediana","Rango","Percentil"],"Moda",["primaria","secundaria"],"facil"),
 q("Si todos los datos aumentan en 3, ¿qué ocurre con la media?",["Aumenta en 3","No cambia","Se triplica","Disminuye en 3"],"Aumenta en 3",["secundaria","universidad"],"media"),
 q("¿Qué medida de dispersión usa las diferencias respecto de la media elevadas al cuadrado?",["Varianza","Moda","Mediana","Rango"],"Varianza",["secundaria","universidad"],"media"),
 q("¿Qué indica una desviación estándar pequeña?",["Los datos están relativamente concentrados","Los datos son siempre negativos","La media es cero","No existen datos"],"Los datos están relativamente concentrados",["secundaria","universidad"],"media"),
 q("En una distribución perfectamente simétrica y unimodal, ¿qué relación suele cumplirse?",["Media = mediana = moda","Media > mediana siempre","Moda = 0 siempre","Mediana = rango"],"Media = mediana = moda",["universidad"],"dificil"),
 q("¿Qué representa un percentil 90?",["El valor por debajo del cual queda aproximadamente el 90% de los datos","El 90% de la media","La suma de los datos","La varianza multiplicada por 90"],"El valor por debajo del cual queda aproximadamente el 90% de los datos",["secundaria","universidad"],"media"),
 q("¿Qué gráfico es especialmente útil para mostrar la distribución de una variable cuantitativa por intervalos?",["Histograma","Gráfico circular únicamente","Mapa político","Diagrama de flujo"],"Histograma",["secundaria","universidad"],"media"),
 q("¿Qué representa la frecuencia relativa?",["Proporción de observaciones que pertenece a una categoría o intervalo","El valor máximo","La suma de las variables","La diferencia entre máximo y mínimo"],"Proporción de observaciones que pertenece a una categoría o intervalo",["secundaria","universidad"],"media"),
 q("Si 20 de 50 estudiantes eligen una opción, ¿qué frecuencia relativa representa?",["0,40","0,25","0,50","0,70"],"0,40",["secundaria"],"facil"),
 q("¿Qué tipo de variable es el número de hermanos?",["Cuantitativa discreta","Cuantitativa continua","Cualitativa nominal","Cualitativa ordinal"],"Cuantitativa discreta",["secundaria","universidad"],"media"),
 q("¿Qué tipo de variable es la temperatura medida con decimales?",["Cuantitativa continua","Cuantitativa discreta","Nominal","Binaria"],"Cuantitativa continua",["secundaria","universidad"],"media"),
 q("¿Qué mide la correlación entre dos variables?",["La fuerza y dirección de su asociación lineal","La causalidad con certeza","El promedio de ambas","El número de observaciones"],"La fuerza y dirección de su asociación lineal",["universidad"],"dificil"),
 q("Una correlación cercana a −1 indica una relación lineal…",["Negativa fuerte","Positiva fuerte","Nula","Perfectamente cuadrática"],"Negativa fuerte",["universidad"],"media"),
 q("¿Qué propiedad tiene la probabilidad de un evento?",["Está entre 0 y 1 inclusive","Siempre es mayor que 1","Siempre es negativa","Puede ser cualquier número real"],"Está entre 0 y 1 inclusive",["secundaria","universidad"],"facil"),
 q("Si dos eventos son mutuamente excluyentes, ¿cuál es su probabilidad conjunta?",["0","1","La suma de sus probabilidades","Siempre 0,5"],"0",["secundaria","universidad"],"media")
];