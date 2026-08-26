import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"ciencia","science",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const PHYSICS_ADVANCED_TOOLS=[
 t("momento-lineal","Momento lineal","Calcula el momento lineal como masa por velocidad.",["Masa (kg)","Velocidad (m/s)"],"momentum"),
 t("impulso","Impulso","Calcula el impulso a partir de fuerza y tiempo.",["Fuerza (N)","Tiempo (s)"],"impulse"),
 t("energia-mecanica","Energía mecánica","Calcula energía cinética más energía potencial gravitatoria.",["Masa (kg)","Velocidad (m/s)","Altura (m)","Gravedad (m/s²)"],"mechanical-energy"),
 t("potencia-mecanica","Potencia mecánica","Calcula potencia como trabajo realizado por unidad de tiempo.",["Trabajo (J)","Tiempo (s)"],"mechanical-power"),
 t("torque","Torque","Calcula el momento de una fuerza respecto de un eje.",["Fuerza (N)","Brazo (m)"],"torque"),
 t("coeficiente-friccion","Coeficiente de fricción","Calcula el coeficiente de fricción a partir de la fuerza de fricción y la normal.",["Fuerza de fricción (N)","Fuerza normal (N)"],"friction-coefficient"),
 t("fuerza-centripeta","Fuerza centrípeta","Calcula la fuerza necesaria para mantener un movimiento circular.",["Masa (kg)","Velocidad (m/s)","Radio (m)"],"centripetal-force"),
 t("aceleracion-centripeta","Aceleración centrípeta","Calcula la aceleración dirigida hacia el centro de la trayectoria circular.",["Velocidad (m/s)","Radio (m)"],"centripetal-acceleration"),
 t("caida-libre","Caída libre","Calcula el tiempo de caída desde una altura sin velocidad inicial.",["Altura (m)","Gravedad (m/s²)"],"free-fall"),
 t("tiro-vertical","Tiro vertical","Calcula la altura máxima alcanzada con una velocidad inicial vertical.",["Velocidad inicial (m/s)","Gravedad (m/s²)"],"vertical-throw"),
 t("tiro-parabolico","Tiro parabólico","Calcula el alcance horizontal de un proyectil lanzado desde el mismo nivel de llegada.",["Velocidad inicial (m/s)","Ángulo (°)","Gravedad (m/s²)"],"projectile-range"),
 t("pendulo-simple","Péndulo simple","Calcula el período de un péndulo ideal.",["Longitud (m)","Gravedad (m/s²)"],"pendulum"),
 t("periodo-resorte","Período de un resorte","Calcula el período de oscilación de una masa unida a un resorte.",["Masa (kg)","Constante elástica (N/m)"],"spring-period"),
 t("energia-resorte","Energía de un resorte","Calcula la energía potencial elástica almacenada.",["Constante elástica (N/m)","Deformación (m)"],"spring-energy"),
 t("presion-hidrostatica","Presión hidrostática","Calcula la presión debida a una columna de fluido.",["Densidad (kg/m³)","Gravedad (m/s²)","Profundidad (m)"],"hydrostatic-pressure"),
 t("empuje-arquimedes","Empuje de Arquímedes","Calcula el empuje sobre un cuerpo sumergido.",["Densidad del fluido (kg/m³)","Gravedad (m/s²)","Volumen desplazado (m³)"],"buoyancy"),
 t("calor-sensible","Calor sensible","Calcula el calor necesario para cambiar la temperatura de una sustancia.",["Masa (kg)","Calor específico (J/kg·K)","Cambio de temperatura (K)"],"sensible-heat"),
 t("calor-latente","Calor latente","Calcula la energía necesaria para un cambio de fase.",["Masa (kg)","Calor latente (J/kg)"],"latent-heat"),
 t("dilatacion-termica","Dilatación térmica","Calcula el aumento de longitud por expansión térmica lineal.",["Longitud inicial (m)","Coeficiente α (1/K)","Cambio de temperatura (K)"],"thermal-expansion"),
 t("eficiencia-energetica","Eficiencia energética","Calcula la eficiencia como energía útil respecto de energía de entrada.",["Energía útil","Energía de entrada"],"efficiency"),
];
