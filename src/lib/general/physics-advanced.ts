import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"ciencia","science",summary,name.toLowerCase().split(/\s+/),{mode:"advanced",operation,fields});
export const PHYSICS_ADVANCED_TOOLS=[
 t("momento-lineal","Linear momentum","Calculate linear momentum as mass times velocity.",["Mass (kg)","Velocity (m/s)"],"momentum"),
 t("impulso","Impulse","Calculate impulse from force and time.",["Force (N)","Time (s)"],"impulse"),
 t("energia-mecanica","Mechanical energy","Calculate kinetic energy plus gravitational potential energy.",["Mass (kg)","Velocity (m/s)","Height (m)","Gravity (m/s²)"],"mechanical-energy"),
 t("potencia-mecanica","Mechanical power","Calculate power as work done per unit time.",["Work (J)","Time (s)"],"mechanical-power"),
 t("torque","Torque","Calculate the moment of a force about an axis.",["Force (N)","Lever arm (m)"],"torque"),
 t("coeficiente-friccion","Friction coefficient","Calculate the friction coefficient from friction force and normal force.",["Friction force (N)","Normal force (N)"],"friction-coefficient"),
 t("fuerza-centripeta","Centripetal force","Calculate the force needed to maintain circular motion.",["Mass (kg)","Velocity (m/s)","Radius (m)"],"centripetal-force"),
 t("aceleracion-centripeta","Centripetal acceleration","Calculate the acceleration toward the center of a circular path.",["Velocity (m/s)","Radius (m)"],"centripetal-acceleration"),
 t("caida-libre","Free fall","Calculate fall time from a height with zero initial velocity.",["Height (m)","Gravity (m/s²)"],"free-fall"),
 t("tiro-vertical","Vertical throw","Calculate the maximum height reached with an initial vertical velocity.",["Initial velocity (m/s)","Gravity (m/s²)"],"vertical-throw"),
 t("tiro-parabolico","Projectile motion","Calculate the horizontal range of a projectile launched from the same level as landing.",["Initial velocity (m/s)","Angle (°)","Gravity (m/s²)"],"projectile-range"),
 t("pendulo-simple","Simple pendulum","Calculate the period of an ideal pendulum.",["Length (m)","Gravity (m/s²)"],"pendulum"),
 t("periodo-resorte","Spring period","Calculate the oscillation period of a mass on a spring.",["Mass (kg)","Spring constant (N/m)"],"spring-period"),
 t("energia-resorte","Spring energy","Calculate the elastic potential energy stored.",["Spring constant (N/m)","Deformation (m)"],"spring-energy"),
 t("presion-hidrostatica","Hydrostatic pressure","Calculate pressure due to a fluid column.",["Density (kg/m³)","Gravity (m/s²)","Depth (m)"],"hydrostatic-pressure"),
 t("empuje-arquimedes","Archimedes' buoyant force","Calculate the buoyant force on a submerged body.",["Fluid density (kg/m³)","Gravity (m/s²)","Displaced volume (m³)"],"buoyancy"),
 t("calor-sensible","Sensible heat","Calculate the heat needed to change the temperature of a substance.",["Mass (kg)","Specific heat (J/kg·K)","Temperature change (K)"],"sensible-heat"),
 t("calor-latente","Latent heat","Calculate the energy needed for a phase change.",["Mass (kg)","Latent heat (J/kg)"],"latent-heat"),
 t("dilatacion-termica","Thermal expansion","Calculate the length increase from linear thermal expansion.",["Initial length (m)","Coefficient α (1/K)","Temperature change (K)"],"thermal-expansion"),
 t("eficiencia-energetica","Energy efficiency","Calculate efficiency as useful energy relative to input energy.",["Useful energy","Input energy"],"efficiency"),
];
