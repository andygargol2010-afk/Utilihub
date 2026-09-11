import type { EducationDifficulty, EducationLevel } from "../education-engine";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});

// Canonical bank: exactly 40 independent questions.
export const ARITMETICA:Q[]=[
 q("What is 37 + 48?",["85","75","95","86"],"85",["primaria"],"facil"),
 q("What is 96 − 27?",["69","63","79","73"],"69",["primaria"],"facil"),
 q("What is 14 × 6?",["84","74","94","76"],"84",["primaria"],"facil"),
 q("What is 144 ÷ 12?",["12","10","14","16"],"12",["primaria"],"facil"),
 q("Which fraction is equivalent to 3/4?",["6/8","4/6","5/8","9/16"],"6/8",["primaria"],"facil"),
 q("What is 25% of 80?",["20","15","25","30"],"20",["primaria"],"facil"),
 q("What is the value of 2³ + 5?",["13","11","16","10"],"13",["primaria"],"media"),
 q("What is the least common multiple of 6 and 8?",["24","18","12","48"],"24",["primaria"],"media"),
 q("What is the greatest common divisor of 36 and 48?",["12","6","18","24"],"12",["primaria"],"media"),
 q("If a ticket costs 240 and has a 15% discount, what is the final price?",["204","216","225","200"],"204",["secundaria"],"media"),
 q("Which decimal represents 7/20?",["0.35","0.25","0.45","0.7"],"0.35",["primaria"],"media"),
 q("A ratio is 3:5. If the first quantity is 18, what is the second?",["30","24","27","36"],"30",["secundaria"],"dificil"),
 q("What is the result of 2.5 + 0.75?",["3.25","3.15","2.80","3.75"],"3.25",["primaria"],"facil"),
 q("If 5 notebooks cost 350, how much does each cost at the same unit price?",["70","65","75","60"],"70",["primaria"],"facil"),
 q("What is the sum of the first five positive natural numbers?",["15","10","20","12"],"15",["primaria"],"facil"),
 q("What is 18 × 25?",["450","400","425","475"],"450",["primaria"],"media"),
 q("What is the result of 3/5 + 1/10?",["7/10","4/15","2/5","3/10"],"7/10",["secundaria"],"dificil"),
 q("What is 2.4 × 0.5?",["1.2","1.4","0.12","12"],"1.2",["secundaria"],"media"),
 q("A number increases from 80 to 100. What was the percentage increase?",["25%","20%","15%","30%"],"25%",["secundaria"],"dificil"),
 q("What is the result of 5/6 ÷ 10/9?",["3/4","5/4","2/3","9/12"],"3/4",["secundaria"],"dificil"),
 q("What is the value of 125 − 68?",["57","53","63","67"],"57",["primaria"],"facil"),
 q("What is 17 × 9?",["153","143","163","136"],"153",["primaria"],"facil"),
 q("What is 360 ÷ 15?",["24","20","30","18"],"24",["secundaria"],"facil"),
 q("Which fraction represents 0.6?",["3/5","1/2","2/3","6/100"],"3/5",["secundaria"],"facil"),
 q("What is 40% of 250?",["100","90","110","125"],"100",["secundaria"],"media"),
 q("What is the result of 4² − 3²?",["7","5","1","9"],"7",["universidad"],"media"),
 q("What is the least common multiple of 9 and 12?",["36","18","24","48"],"36",["secundaria"],"media"),
 q("What is the greatest common divisor of 54 and 72?",["18","9","27","36"],"18",["secundaria"],"media"),
 q("A recipe uses 3/4 liter per batch. How much for 4 batches?",["3 liters","2 liters","4 liters","2.5 liters"],"3 liters",["universidad"],"facil"),
 q("If 8 units cost 520, how much do 15 cost at the same unit price?",["975","900","1040","850"],"975",["secundaria"],"dificil"),
 q("Which number is divisible by 3?",["741","742","743","745"],"741",["universidad"],"facil"),
 q("What is the result of 1.25 + 2.375?",["3.625","3.525","3.75","3.125"],"3.625",["secundaria"],"media"),
 q("What is 12.5% of 64?",["8","6","10","12"],"8",["universidad"],"media"),
 q("A price of 500 increases by 8%. What is the new price?",["540","508","580","550"],"540",["universidad"],"dificil"),
 q("What is the result of 7/8 − 1/4?",["5/8","3/8","6/8","1/2"],"5/8",["universidad"],"media"),
 q("What is 0.72 ÷ 0.08?",["9","0.9","90","8"],"9",["universidad"],"dificil"),
 q("If an amount of 240 is split in the ratio 2:3, what is the larger part?",["144","96","120","160"],"144",["universidad"],"dificil"),
 q("What is the absolute value of −17?",["17","−17","0","1"],"17",["universidad"],"facil"),
 q("What number follows in the sequence 4, 8, 12, 16, …?",["20","18","22","24"],"20",["primaria"],"facil"),
 q("If 3 kg of fruit cost 420, how much do 5 kg cost at the same price?",["700","600","720","650"],"700",["universidad"],"media")
];
