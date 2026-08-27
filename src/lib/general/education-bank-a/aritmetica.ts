import type { EducationDifficulty, EducationLevel } from "../education-engine";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});

// Banco canónico: exactamente 40 preguntas independientes.
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
 q("¿Cuál es el resultado de 5/6 ÷ 10/9?",["3/4","5/4","2/3","9/12"],"3/4",["secundaria","universidad"],"dificil"),
 q("¿Cuál es el valor de 125 − 68?",["57","53","63","67"],"57",["primaria","secundaria"],"facil"),
 q("¿Cuánto es 17 × 9?",["153","143","163","136"],"153",["primaria","secundaria"],"facil"),
 q("¿Cuánto es 360 ÷ 15?",["24","20","30","18"],"24",["primaria","secundaria"],"facil"),
 q("¿Qué fracción representa 0,6?",["3/5","1/2","2/3","6/100"],"3/5",["primaria","secundaria"],"facil"),
 q("¿Cuál es el 40% de 250?",["100","90","110","125"],"100",["primaria","secundaria"],"media"),
 q("¿Cuál es el resultado de 4² − 3²?",["7","5","1","9"],"7",["primaria","secundaria"],"media"),
 q("¿Cuál es el mínimo común múltiplo de 9 y 12?",["36","18","24","48"],"36",["secundaria"],"media"),
 q("¿Cuál es el máximo común divisor de 54 y 72?",["18","9","27","36"],"18",["secundaria"],"media"),
 q("Una receta usa 3/4 de litro por tanda. ¿Cuánto usa para 4 tandas?",["3 litros","2 litros","4 litros","2,5 litros"],"3 litros",["primaria","secundaria"],"facil"),
 q("Si 8 unidades cuestan 520, ¿cuánto cuestan 15 al mismo precio unitario?",["975","900","1040","850"],"975",["secundaria","universidad"],"dificil"),
 q("¿Qué número es divisible por 3?",["741","742","743","745"],"741",["primaria","secundaria"],"facil"),
 q("¿Cuál es el resultado de 1,25 + 2,375?",["3,625","3,525","3,75","3,125"],"3,625",["secundaria","universidad"],"media"),
 q("¿Cuál es el 12,5% de 64?",["8","6","10","12"],"8",["secundaria","universidad"],"media"),
 q("Un precio de 500 aumenta un 8%. ¿Cuál es el nuevo precio?",["540","508","580","550"],"540",["secundaria","universidad"],"dificil"),
 q("¿Cuál es el resultado de 7/8 − 1/4?",["5/8","3/8","6/8","1/2"],"5/8",["secundaria","universidad"],"media"),
 q("¿Cuánto es 0,72 ÷ 0,08?",["9","0,9","90","8"],"9",["secundaria","universidad"],"dificil"),
 q("Si una cantidad de 240 se reparte en razón 2:3, ¿cuál es la parte mayor?",["144","96","120","160"],"144",["secundaria","universidad"],"dificil"),
 q("¿Cuál es el valor absoluto de −17?",["17","−17","0","1"],"17",["primaria","secundaria"],"facil"),
 q("¿Qué número sigue en la secuencia 4, 8, 12, 16, …?",["20","18","22","24"],"20",["primaria"],"facil"),
 q("Si 3 kg de fruta cuestan 420, ¿cuánto cuestan 5 kg al mismo precio?",["700","600","720","650"],"700",["primaria","secundaria"],"media")
];
