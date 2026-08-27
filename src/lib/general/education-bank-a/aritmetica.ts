import type { EducationDifficulty, EducationLevel } from "../education-engine";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});

export const ARITMETICA:Q[]=[
 q("¿Cuánto es 37 + 48?",["85","75","95","86"],"85",["primaria","secundaria"],"facil"),
 q("¿Cuánto es 96 − 27?",["69","63","79","73"],"69",["primaria","secundaria"],"facil"),
 q("¿Cuánto es 14 × 6?",["84","74","94","76"],"84",["primaria","secundaria"],"facil"),
 q("¿Cuánto es 144 ÷ 12?",["12","10","14","16"],"12",["primaria","secundaria"],"facil"),
 q("¿Qué fracción es equivalente a 3/4?",["6/8","4/6","5/8","9/16"],"6/8",["primaria","secundaria"],"facil"),
 q("¿Cuál es el 25% de 80?",["20","15","25","30"],"20",["primaria","secundaria"],"facil"),
 q("¿Cuál es el valor de 2³ + 5?",["13","11","16","10"],"13",["primaria","secundaria"],"media"),
 q("¿Cuál es el mínimo común múltiplo de 6 y 8?",["24","18","12","48"],"24",["primaria","secundaria"],"media"),
 q("¿Cuál es el máximo común divisor de 36 y 48?",["12","6","18","24"],"12",["primaria","secundaria"],"media"),
 q("Si una entrada cuesta 240 y tiene un descuento del 15%, ¿cuál es su precio final?",["204","216","225","200"],"204",["secundaria","universidad"],"media"),
 q("¿Qué número decimal representa 7/20?",["0,35","0,25","0,45","0,7"],"0,35",["primaria","secundaria"],"media"),
 q("Una proporción es 3:5. Si la primera cantidad es 18, ¿cuánto vale la segunda?",["30","24","27","36"],"30",["secundaria","universidad"],"media"),
 q("¿Cuál es el resultado de 2,5 + 0,75?",["3,25","3,15","2,80","3,75"],"3,25",["primaria","secundaria"],"facil"),
 q("Si 5 cuadernos cuestan 350, ¿cuánto cuesta cada uno al mismo precio unitario?",["70","65","75","60"],"70",["primaria","secundaria"],"facil"),
 q("¿Cuál es la suma de los primeros cinco números naturales positivos?",["15","10","20","12"],"15",["primaria","secundaria"],"facil"),
 q("¿Cuánto es 18 × 25?",["450","400","425","475"],"450",["primaria","secundaria"],"media"),
 q("¿Cuál es el resultado de 3/5 + 1/10?",["7/10","4/15","2/5","3/10"],"7/10",["secundaria","universidad"],"media"),
 q("¿Cuánto es 2,4 × 0,5?",["1,2","1,4","0,12","12"],"1,2",["secundaria","universidad"],"media"),
 q("Un número aumenta de 80 a 100. ¿Cuál fue el porcentaje de aumento?",["25%","20%","15%","30%"],"25%",["secundaria","universidad"],"dificil"),
 q("¿Cuál es el resultado de 5/6 ÷ 10/9?",["3/4","5/4","2/3","9/12"],"3/4",["secundaria","universidad"],"dificil")
];