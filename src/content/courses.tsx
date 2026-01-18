// src/content/courses.ts
// Source: “Informe de Avance Curricular” (PUC)
// Rule applied: if the report shows the course as fully completed (e.g., 10/10, 20/20, or approved labs/tests),
// we set `status: "completed"`. Otherwise we omit `status`.

export type CourseStatus = "completed";

export interface Course {
  /** Course code (typically 7 chars; some codes are shorter in the report and are kept as-is). */
  id: string;
  /** Course name as shown in the report. */
  name: string;
  /** Present only when completed. */
  status?: CourseStatus;
}

const completed = (id: string, name: string): Course => ({ id, name, status: "completed" });
const notCompleted = (id: string, name: string): Course => ({ id, name });

export const courses: Course[] = [
  // Plan Común – Ciencias Básicas
  completed("MAT1610", "CÁLCULO I"),
  completed("QIM100A", "QUÍMICA GENERAL II"),
  completed("ICE1513", "ESTATICA Y DINAMICA"),
  completed("FIS0151", "LABORATORIO DE ESTATICA Y DINAMICA"),
  completed("MAT1620", "CÁLCULO II"),
  completed("ICS1513", "INTRODUCCIÓN A LA ECONOMÍA"),
  completed("IIC1103", "INTRODUCCIÓN A LA PROGRAMACIÓN"),
  completed("IIQ1003", "TERMODINÁMICA"),
  completed("FIS0152", "LABORATORIO DE TERMODINÁMICA"),
  completed("EYP1113", "PROBABILIDADES Y ESTADÍSTICA"),
  completed("FIS1533", "ELECTRICIDAD Y MAGNETISMO"),
  completed("FIS0153", "LABORATORIO DE ELECTRICIDAD Y MAGNETISMO"),
  completed("ING2030", "INVESTIGACIÓN, INNOVACIÓN Y EMPRENDIMIENTO"),
  completed("BIO141C", "BIOLOGÍA DE LA CÉLULA"),
  completed("IMM2003", "GEOLOGÍA MINERA"),

  // Base General para Major
  completed("MAT1203", "ÁLGEBRA LINEAL"),
  completed("ING1004", "DESAFÍOS DE LA INGENIERÍA"),
  completed("MAT1630", "CÁLCULO III"),
  completed("MAT1640", "ECUACIONES DIFERENCIALES"),
  completed("IMM1003", "INTRODUCCIÓN A LA MINERÍA"),

  // Major (Investigación Operativa) – cursos
  completed("ICS113H", "OPTIMIZACIÓN-HONORS"),
  completed("ICS2123", "MODELOS ESTOCÁSTICOS"),
  completed("ICS2121", "MÉTODOS DE OPTIMIZACIÓN"),
  completed("ICS2523", "MICROECONOMÍA"),
  completed("ICS2813", "ORGANIZACIÓN Y COMPORTAMIENTO EN LA EMPRESA"),
  completed("ICS2613", "CONTABILIDAD Y CONTROL DE GESTIÓN"),
  completed("ICS2122", "TALLER DE INVESTIGACIÓN OPERATIVA (CAPSTONE)"),
  completed("ICS2563", "ECONOMETRÍA APLICADA"),

  // Minor (Programación)
  completed("IIC1253", "MATEMÁTICAS DISCRETAS"),
  completed("IIC2233", "PROGRAMACIÓN AVANZADA"),
  completed("IIC2133", "ESTRUCTURAS DE DATOS Y ALGORITMOS"),
  completed("IIC2143", "INGENIERÍA DE SOFTWARE"),
  notCompleted("IIC2413", "BASES DE DATOS"),
  completed("IIC2713", "SISTEMAS DE INFORMACIÓN"),

  // Formación General
  completed("AST0112", "ASTRONOMY"),
  completed("FIL012", "FILOSOFÍA DEL LENGUAJE"),
  completed("IHI0202", "HISTORIA MEDIEVAL"),
  completed("IHI0203", "HISTORIA MODERNA"),
  completed("IHI0205", "HISTORIA MUNDIAL CONTEMPORÁNEA"),
  completed("LET0003", "DESARROLLO DE HABILIDADES COMUNICATIVAS PARA INGENIEROS"),
  completed("TTF041", "FE Y RAZON. UNA PERSPECTIVA HISTORICA"),
  completed("FIL188", "ÉTICA PARA INGENIEROS"),

  // Requisitos / pruebas (aparecen en el informe)
  completed("VRA100C", "EXAMEN DE COMUNICACIÓN ESCRITA (ECE)"),
  completed("VRA3010", "ENGLISH TEST (SUFFICIENCY ALTE 3)"),
  completed("VRA2010", "ENGLISH PLACEMENT TEST ALTE 3"),
  notCompleted("ING1111", "INTRODUCCIÓN AL APRENDIZAJE UNIVERSITARIO"),
  notCompleted("ING1001", "PRÁCTICA I"),
  notCompleted("ING1110", "TALLER DE HÁBITOS Y ESTRATEGIAS DE ESTUDIO"),

  // Título: Ingeniero Civil de Industrias, Diploma en TI (estado según créditos en el informe)
  notCompleted("ICH1104", "MECÁNICA DE FLUIDOS"),
  notCompleted("ICS3013", "EVALUACIÓN DE PROYECTOS"),
  notCompleted("ICS3213", "GESTIÓN DE OPERACIONES"),
  completed("ICS3313", "MARKETING"),
  notCompleted("ICS3413", "FINANZAS"),
  notCompleted("IIC2154", "PROYECTO DE ESPECIALIDAD"),
  notCompleted("IIC2333", "SISTEMAS OPERATIVOS Y REDES"),
  notCompleted("IIC2343", "ARQUITECTURA DE COMPUTADORES"),
  completed("IIC2733", "MODELOS DE PROCESOS"),
  notCompleted("IIC3103", "TALLER DE INTEGRACIÓN"),
  notCompleted("IIC3113", "GESTIÓN DE PROYECTOS DE TI"),
  completed("IIC3703", "GESTIÓN DE OPERACIONES TI"),
  notCompleted("IIC3743", "ESTRATEGIAS Y TECNOLOGÍAS DE INFORMACIÓN"),

  // Cursos no aplicables al plan (igual aparecen en el informe)
  completed("ING1024", "PROPIEDADES Y RESISTENCIA DE MATERIALES"),
  completed("IMM2013", "MINERÍA A CIELO ABIERTO"),

  // Requisitos adicionales (sin créditos cursados en el informe)
  notCompleted("ING2001", "PRÁCTICA II"),
  notCompleted("ING2005", "TALLER DE EMPLEABILIDAD"),
];
