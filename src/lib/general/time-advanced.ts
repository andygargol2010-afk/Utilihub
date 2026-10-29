import { makeTool } from "./types";
const t=(slug:string,name:string,summary:string,fields:string[],operation:string)=>makeTool(slug,name,"fechas","time",summary,name.toLowerCase().split(/\s+/),{mode:"date",operation,fields});
export const TIME_ADVANCED_TOOLS=[
 t("diferencia-fechas","Difference between two dates","Calculate the exact difference between two dates.",["Start date","End date"],"date-difference"),
 t("dias-entre-fechas","Days between dates","Calculate the number of days between two dates.",["Start date","End date"],"days-between"),
 t("semana-del-ano","Week of the year","Calculate the ISO week number of a date.",["Date"],"week-number"),
 {...t("fecha-despues","Date after N days","Calculate a date by adding a number of days.",["Start date","Number of days"],"date-after"),
  title:"Add Days to Date Calculator — Date After N Days | UtiliHub",
  description:"Free online date calculator: enter a start date and a number of days to get the exact resulting calendar date. Handles leap years, runs in your browser, no signup."},
 t("fecha-antes","Date before N days","Calculate a date by subtracting a number of days.",["End date","Number of days"],"date-before"),
 t("cuenta-regresiva-fecha","Countdown to a date","Calculate how many days remain until a given date.",["Target date","Reference date"],"countdown-date"),
];
