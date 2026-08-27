import type { EducationDifficulty, EducationLevel } from "../education-engine";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});

export const GEOMETRIA:Q[]=[
 q("¿Cuál es el perímetro de un cuadrado de lado 6 cm?",["24 cm","12 cm","36 cm","18 cm"],"24 cm",["primaria","secundaria"],"facil"),
 q("¿Cuál es el área de un cuadrado de lado 7 cm?",["49 cm²","28 cm²","14 cm²","56 cm²"],"49 cm²",["primaria","secundaria"],"facil"),
 q("¿Cuántos grados suman los ángulos interiores de un triángulo?",["180°","90°","270°","360°"],"180°",["primaria","secundaria"],"facil"),
 q("¿Cuántos lados tiene un hexágono?",["6","5","7","8"],"6",["primaria"],"facil"),
 q("¿Cuál es el área de un rectángulo de 9 cm por 4 cm?",["36 cm²","26 cm²","13 cm²","40 cm²"],"36 cm²",["primaria","secundaria"],"facil"),
 q("¿Cuál es el perímetro de un rectángulo de 8 cm por 3 cm?",["22 cm","24 cm","11 cm","16 cm"],"22 cm",["primaria","secundaria"],"facil"),
 q("¿Cuál es la fórmula del área de un círculo de radio r?",["πr²","2πr","πr","r²/π"],"πr²",["secundaria","universidad"],"media"),
 q("¿Cuál es la longitud de una circunferencia de radio 5?",["10π","25π","5π","20π"],"10π",["secundaria"],"media"),
 q("Un ángulo de 90° se denomina…",["recto","agudo","obtuso","llano"],"recto",["primaria","secundaria"],"facil"),
 q("Un ángulo de 120° es…",["obtuso","agudo","recto","llano"],"obtuso",["primaria","secundaria"],"facil"),
 q("¿Qué condición tienen dos rectas perpendiculares?",["Forman un ángulo de 90°","Son siempre paralelas","Nunca se intersectan","Forman 180°"],"Forman un ángulo de 90°",["secundaria"],"media"),
 q("¿Qué condición tienen dos rectas paralelas?",["No se intersectan en un plano","Forman siempre 90°","Tienen que ser verticales","Tienen el mismo punto medio"],"No se intersectan en un plano",["secundaria"],"media"),
 q("¿Cuál es la diagonal de un cuadrado de lado 4?",["4√2","8","16","2√2"],"4√2",["secundaria","universidad"],"dificil"),
 q("En un triángulo rectángulo con catetos 3 y 4, ¿cuánto mide la hipotenusa?",["5","6","7","4"],"5",["secundaria"],"media"),
 q("¿Cuál es el volumen de un cubo de arista 3?",["27 unidades cúbicas","9 unidades cúbicas","18 unidades cúbicas","12 unidades cúbicas"],"27 unidades cúbicas",["primaria","secundaria"],"facil"),
 q("¿Cuál es el volumen de un cilindro de radio r y altura h?",["πr²h","2πrh","πrh","r²+h²"],"πr²h",["secundaria","universidad"],"media"),
 q("¿Qué punto divide un segmento en dos partes de igual longitud?",["Punto medio","Vértice","Origen","Foco"],"Punto medio",["secundaria"],"facil"),
 q("¿Cuál es la distancia entre (0,0) y (3,4)?",["5","7","12","1"],"5",["secundaria","universidad"],"media"),
 q("¿Cuál es el área de un triángulo de base 10 y altura 6?",["30","60","16","36"],"30",["primaria","secundaria"],"media"),
 q("¿Cuánto mide cada ángulo interior de un cuadrado?",["90°","45°","120°","180°"],"90°",["primaria","secundaria"],"facil")
];