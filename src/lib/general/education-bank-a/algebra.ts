import type { EducationDifficulty, EducationLevel } from "../education-engine";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});

export const ALGEBRA:Q[]=[
 q("Si x + 7 = 15, ¿cuánto vale x?",["8","7","9","22"],"8",["primaria","secundaria"],"facil"),
 q("Si 4x = 28, ¿cuánto vale x?",["7","6","8","9"],"7",["primaria","secundaria"],"facil"),
 q("¿Cuál es el valor de 3x + 2 cuando x = 5?",["17","15","12","20"],"17",["primaria","secundaria"],"facil"),
 q("Simplifica 5x + 3x.",["8x","15x","8","2x"],"8x",["secundaria"],"facil"),
 q("¿Cuál es la expresión factorizada de x² − 9?",["(x−3)(x+3)","(x−9)(x+1)","(x−3)²","x(x−9)"],"(x−3)(x+3)",["secundaria","universidad"],"media"),
 q("Resuelve 2x + 5 = 17.",["6","5","7","11"],"6",["secundaria"],"facil"),
 q("¿Cuál es la pendiente de y = 3x − 4?",["3","−4","4","1/3"],"3",["secundaria","universidad"],"media"),
 q("¿Cuál es la ordenada al origen de y = −2x + 9?",["9","−2","2","−9"],"9",["secundaria"],"media"),
 q("Si 2(x + 3) = 14, ¿cuánto vale x?",["4","5","7","2"],"4",["secundaria"],"media"),
 q("¿Qué solución satisface x² = 49?",["x = 7 o x = −7","x = 49","x = 14","x = −49"],"x = 7 o x = −7",["secundaria","universidad"],"media"),
 q("Simplifica 2a + 5 − a + 3.",["a + 8","a + 2","3a + 8","a − 8"],"a + 8",["secundaria"],"media"),
 q("Si x/4 = 6, ¿cuánto vale x?",["24","10","12","2"],"24",["secundaria"],"facil"),
 q("¿Cuál es el desarrollo de (x + 2)²?",["x² + 4x + 4","x² + 4","x² + 2x + 4","x² + 4x + 2"],"x² + 4x + 4",["secundaria","universidad"],"media"),
 q("Resuelve 3(x − 2) = 2x + 5.",["11","1","7","−11"],"11",["secundaria","universidad"],"media"),
 q("Si f(x)=2x−1, ¿cuál es f(4)?",["7","8","6","9"],"7",["secundaria"],"facil"),
 q("¿Qué ecuación representa una recta horizontal que pasa por y = 5?",["y = 5","x = 5","y = x + 5","y = 5x"],"y = 5",["secundaria","universidad"],"media"),
 q("Resuelve el sistema x+y=10 y x−y=2.",["x=6, y=4","x=4, y=6","x=8, y=2","x=5, y=5"],"x=6, y=4",["secundaria","universidad"],"dificil"),
 q("¿Cuál es el dominio de f(x)=1/(x−2)?",["Todos los reales excepto 2","Todos los reales","Solo x>2","Solo x<2"],"Todos los reales excepto 2",["universidad"],"dificil"),
 q("Si 3^x = 81, ¿cuánto vale x?",["4","3","9","27"],"4",["secundaria","universidad"],"media"),
 q("Resuelve 2^x = 1/8.",["−3","3","−2","8"],"−3",["secundaria","universidad"],"dificil")
];