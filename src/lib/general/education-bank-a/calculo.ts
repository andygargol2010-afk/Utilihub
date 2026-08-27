import type { EducationDifficulty, EducationLevel } from "../education-engine";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});

export const CALCULO:Q[]=[
 q("¿Cuál es la derivada de x²?",["2x","x","x²","2"],"2x",["secundaria","universidad"],"facil"),
 q("¿Cuál es la derivada de 5x?",["5","x","5x","0"],"5",["secundaria","universidad"],"facil"),
 q("¿Cuál es la derivada de una constante 7?",["0","1","7","x"],"0",["secundaria","universidad"],"facil"),
 q("¿Cuál es una primitiva de 2x?",["x²","2x²","x","2"],"x²",["secundaria","universidad"],"facil"),
 q("¿Cuál es una primitiva de cos(x)?",["sin(x)","−sin(x)","cos(x)","x cos(x)"],"sin(x)",["universidad"],"media"),
 q("¿Cuál es la derivada de sin(x)?",["cos(x)","−cos(x)","sin(x)","1"],"cos(x)",["secundaria","universidad"],"media"),
 q("¿Cuál es la derivada de cos(x)?",["−sin(x)","sin(x)","cos(x)","−cos(x)"],"−sin(x)",["secundaria","universidad"],"media"),
 q("¿Cuál es la derivada de e^x?",["e^x","xe^(x−1)","1/e^x","x e^x"],"e^x",["universidad"],"media"),
 q("¿Cuál es la derivada de ln(x)?",["1/x","x","ln(x)/x","e^x"],"1/x",["universidad"],"media"),
 q("¿Cuál es el límite de x cuando x tiende a 3?",["3","0","∞","No existe"],"3",["secundaria","universidad"],"facil"),
 q("¿Cuál es el límite de 1/x cuando x tiende a infinito?",["0","1","∞","−1"],"0",["universidad"],"media"),
 q("¿Qué condición garantiza que una función sea continua en x=a?",["El límite existe y coincide con f(a)","f(a)=0 siempre","La derivada es infinita","No debe tener dominio"],"El límite existe y coincide con f(a)",["universidad"],"dificil"),
 q("¿Qué representa geométricamente la derivada en un punto?",["Pendiente de la recta tangente","Área total","Longitud del intervalo","Valor medio siempre"],"Pendiente de la recta tangente",["secundaria","universidad"],"media"),
 q("¿Qué representa una integral definida en muchos contextos?",["Área neta acumulada","Pendiente instantánea","Raíz cuadrada","Máximo siempre"],"Área neta acumulada",["secundaria","universidad"],"media"),
 q("¿Cuál es ∫₀¹ 2x dx?",["1","2","1/2","0"],"1",["universidad"],"media"),
 q("¿Cuál es la derivada de x³?",["3x²","x²","3x","x³/3"],"3x²",["secundaria","universidad"],"facil"),
 q("Si f'(x)>0 en un intervalo, ¿qué comportamiento tiene f allí?",["Es creciente","Es decreciente","Es constante necesariamente","No está definida"],"Es creciente",["secundaria","universidad"],"media"),
 q("Si f'(x)<0 en un intervalo, ¿qué comportamiento tiene f allí?",["Es decreciente","Es creciente","Es periódica necesariamente","Es constante"],"Es decreciente",["secundaria","universidad"],"media"),
 q("¿Cuál es la segunda derivada de x³?",["6x","3x²","6","x"],"6x",["universidad"],"media"),
 q("¿Qué prueba puede ayudar a clasificar un punto crítico con la segunda derivada?",["El criterio de la segunda derivada","La regla de tres","El teorema de Pitágoras","La ley de Ohm"],"El criterio de la segunda derivada",["universidad"],"dificil")
];