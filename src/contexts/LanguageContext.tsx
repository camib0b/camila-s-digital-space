import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Hero
    "hero.location": "Santiago, Chile",
    "hero.tagline": "One year to graduation. Crafting thoughtful web experiences.",
    "hero.subtagline": "Realize that everything connects to everything else.",
    "hero.note": "Web dev is so much more than front end.",
    "hero.cta.contact": "Get in Touch",
    "hero.cta.work": "See My Work",
    "hero.cta.cv": "View CV",

    // About
    "about.label": "About",
    "about.title": "Tech, but very human.",
    "about.description": "I'm a 26-year-old engineering student in Santiago, one year away from graduation. When I'm not coding, I'm on the field—playing and coaching field hockey. I genuinely enjoy working, and I approach every project with the same energy I bring to the game: focused, collaborative, and always pushing to improve.",
    "about.highlight1.title": "Web Developer",
    "about.highlight1.description": "Focused on building clean, performant interfaces with modern frameworks.",
    "about.highlight2.title": "Team Player",
    "about.highlight2.description": "3 summer internships, collaborating with diverse teams on real projects.",
    "about.highlight3.title": "Always Building",
    "about.highlight3.description": "Constantly seeking side projects to learn, experiment, and grow.",

    // Dashboard
    "dashboard.label": "Life Dashboard",
    "dashboard.title": "Metrics That Matter",
    "dashboard.description": "A snapshot of where I am — balancing engineering, athletics, and continuous learning.",
    "dashboard.stats.yearsCoding": "Years Coding",
    "dashboard.stats.booksThisYear": "Books This Year",
    "dashboard.stats.internships": "Internships",
    "dashboard.stats.projects": "Projects",
    "dashboard.weeklyActivity": "Weekly Activity",
    "dashboard.weeklyActivityDesc": "Hours distribution across activities",
    "dashboard.skillFocus": "Skill Focus",
    "dashboard.skillFocusDesc": "Current proficiency levels",
    "dashboard.degreeProgress": "Degree Progress",
    "dashboard.degreeProgressDetail": "4th year / 5 years",
    "dashboard.internshipsLabel": "Internships",
    "dashboard.internshipsDetail": "3 completed",
    "dashboard.hockeyYears": "Hockey Years",
    "dashboard.hockeyYearsDetail": "Playing & coaching",
    "dashboard.sideProjects": "Side Projects",
    "dashboard.sideProjectsDetail": "Always building",
    "dashboard.coding": "Coding",
    "dashboard.hockey": "Hockey",
    "dashboard.study": "Study",
    "dashboard.frontend": "Frontend",
    "dashboard.backend": "Backend",
    "dashboard.design": "Design",

    // Skills
    "skills.label": "Skills",
    "skills.title": "What I work with.",
    "skills.description": "I focus on web development, building responsive and accessible applications with modern tools and frameworks.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.tools": "Tools",

    // Experience
    "experience.label": "Experience",
    "experience.title": "Where I've learned.",
    "experience.description": "Three summer internships that shaped how I think about code, collaboration, and building products.",
    "experience.job1.title": "Software Engineering Intern",
    "experience.job1.company": "Finapsys (health tech B2B SaaS)",
    "experience.job1.period": "Summer 2024",
    "experience.job1.description": "Built reactive frontend views and components in TypeScript + Vue.js.",
    "experience.job2.title": "Asset Management Intern",
    "experience.job2.company": "A3 Property Investments",
    "experience.job2.period": "Summer 2023",
    "experience.job2.description": "Developed responsive landing pages and contributed to a React component library.",
    "experience.job3.title": "Retail & E-commerce Intern",
    "experience.job3.company": "Visionary",
    "experience.job3.period": "Sabbatical 2021",
    "experience.job3.description": "Owned e-commerce/PDV/distributor operations across Shopify + BSale; built sales & inventory forecasts and tracked core KPIs (conversion rate, avg. ticket, margin) to coordinate pricing, promos, and replenishment.",

    // Books
    "books.label": "Reading List",
    "books.title": "Books That Shaped My Thinking",
    "books.description": "Click any book to read my review. These texts have influenced how I approach problems, understand systems, and see the world.",
    "books.myTake": "My Take",
    "books.book1.review": "A foundational text that shaped my understanding of justice and the ideal society. Plato's dialogues challenge you to question everything — governance, truth, and the nature of reality itself.",
    "books.book2.review": "Philosophy made accessible through storytelling. This book ignited my curiosity about the big questions when I was younger. A perfect gateway into Western philosophical thought.",
    "books.book3.review": "Essential reading for understanding Chile's industrial history. Bonnefoy captures the human stories behind the world's largest open-pit copper mine — a lens into labor, community, and progress.",
    "books.book4.review": "A masterpiece of historical fiction wrapped in mystery. Eco weaves semiotics, medieval history, and detective narrative into something utterly captivating. Dense but rewarding.",

    // Hockey
    "hockey.label": "Hockey Journey",
    "hockey.title": "Playing & Coaching",
    "hockey.description": "Two parallel paths — years on the pitch as a player and now sharing that passion through coaching.",
    "hockey.playerTrajectory": "Player Trajectory",
    "hockey.coachingTrajectory": "Coaching Trajectory",
    "hockey.player1.title": "Started Playing",
    "hockey.player1.description": "Began my hockey journey as a player",
    "hockey.player2.title": "Early retirement",
    "hockey.player2.description": "Focused on university & then got trapped in the pandemic",
    "hockey.player3.title": "Returned to playing and competing",
    "hockey.player3.description": "Continuing to play and develop skills",
    "hockey.player4.title": "ACL rupture",
    "hockey.player4.description": "Mid November. Expected return to competition: August 2026",
    "hockey.coaching1.description": "Sub-12 y Sub-16",
    "hockey.coaching2.description": "Youth teams coaching assistant",
    "hockey.coaching3.description": "Ladies Junior World Cup in Santiago",

    // Contact
    "contact.label": "Contact",
    "contact.title": "Let's connect.",
    "contact.description": "Looking for internships, freelance projects, or just want to chat about web development? I'd love to hear from you.",
    "contact.location": "Location",
    "contact.email": "Email",
    "contact.preferEmail": "Prefer email? Send me a message directly.",
    "contact.sendEmail": "Send Email",

    // Footer
    "footer.builtWith": "Built with care.",
    "footer.cv": "CV",

    // CV Page
    "cv.back": "Back",
    "cv.downloadPdf": "Download PDF",
    "cv.photo": "Photo",
    "cv.role": "Software Engineering Intern · Web Developer",
    "cv.summary": "Engineering student with 3 internships building production web applications. I ship clean, user-focused code and bring the same discipline from coaching athletes to collaborating on technical teams. Graduating 2026, seeking product engineering roles.",
    "cv.selectedProjects": "Selected Projects",
    "cv.workExperience": "Work Experience",
    "cv.education": "Education",
    "cv.skills": "Skills",
    "cv.leadershipAthletics": "Leadership & Athletics",
    "cv.languages": "Languages",
    "cv.frameworks": "Frameworks",
    "cv.tools": "Tools",
    "cv.availableFor": "Available for Summer 2025 Internships",
    "cv.project1.title": "Sports Video Analysis & Clips Workflow",
    "cv.project1.type": "Personal Project",
    "cv.project1.description": "Built a web app to upload game footage, tag key moments, and automatically generate highlight clips. Designed for coaches and players to streamline video review.",
    "cv.project1.impact": "Reduced video review time by 60% for my hockey team",
    "cv.project2.title": "Aircraft Fleet Engine Allocation Optimizer",
    "cv.project2.type": "Course Project — Optimization Methods",
    "cv.project2.description": "Developed an optimization tool to allocate engines across an aircraft fleet minimizing maintenance costs while meeting flight schedule constraints.",
    "cv.project2.impact": "Achieved 12% cost reduction vs. baseline heuristic in simulated scenarios",
    "cv.job1.title": "Software Engineering Intern",
    "cv.job1.company": "Tech Company",
    "cv.job1.period": "Summer 2024",
    "cv.job1.bullet1": "Shipped 3 full-stack features for internal tools used by 200+ employees",
    "cv.job1.bullet2": "Designed and implemented REST APIs handling 10k+ daily requests",
    "cv.job1.bullet3": "Reduced page load time by 40% through code splitting and lazy loading",
    "cv.job2.title": "Web Development Intern",
    "cv.job2.company": "Digital Agency",
    "cv.job2.period": "Summer 2023",
    "cv.job2.bullet1": "Built responsive client websites with 95+ Lighthouse performance scores",
    "cv.job2.bullet2": "Implemented accessibility improvements reaching WCAG 2.1 AA compliance",
    "cv.job2.bullet3": "Collaborated with designers to establish component library patterns",
    "cv.job3.title": "Frontend Developer Intern",
    "cv.job3.company": "Startup",
    "cv.job3.period": "Summer 2022",
    "cv.job3.bullet1": "Created reusable UI components adopted across 4 product teams",
    "cv.job3.bullet2": "Integrated Figma design system reducing design-to-code handoff time",
    "cv.job3.bullet3": "Wrote unit tests achieving 80% coverage on critical user flows",
    "cv.education.degree": "Engineering Degree",
    "cv.education.institution": "University",
    "cv.education.period": "2020 – 2026 (Expected)",
    "cv.education.details": "Focus: Software Engineering & Web Development",
    "cv.education.coursework": "Optimization Methods, Data Structures, Databases, UI/UX Design",
    "cv.leadership1.role": "Field Hockey Coach",
    "cv.leadership1.organization": "Female U-14 National Team",
    "cv.leadership1.description": "Lead training sessions and game strategy for 20+ athletes. Coordinate with technical staff on player development.",
    "cv.leadership2.role": "Field Hockey Player",
    "cv.leadership2.organization": "Club & Regional Teams",
    "cv.leadership2.description": "Competitive player with 10+ years experience. Team captain roles developing communication and on-field leadership.",
  },
  es: {
    // Hero
    "hero.location": "Santiago, Chile",
    "hero.tagline": "A un año de graduarme. Creando experiencias web con propósito.",
    "hero.subtagline": "Cada cosa está conectada con todo lo demás.",
    "hero.note": "El desarrollo web es mucho más que frontend.",
    "hero.cta.contact": "Contacto",
    "hero.cta.work": "Ver Mi Trabajo",
    "hero.cta.cv": "Ver CV",

    // About
    "about.label": "Sobre Mí",
    "about.title": "Tecnología, pero humana.",
    "about.description": "Tengo 26 años y estudio ingeniería en Santiago, a un año de graduarme. Cuando no estoy programando, estoy en la cancha jugando y entrenando hockey. Me gusta trabajar, y abordo cada proyecto con la misma energía que llevo al juego: enfocada, colaborativa, y siempre buscando mejorar.",
    "about.highlight1.title": "Desarrolladora Web",
    "about.highlight1.description": "Enfocada en construir interfaces limpias y eficientes con frameworks modernos.",
    "about.highlight2.title": "Trabajo en Equipo",
    "about.highlight2.description": "3 prácticas profesionales, colaborando con equipos diversos en proyectos reales.",
    "about.highlight3.title": "Siempre Construyendo",
    "about.highlight3.description": "Constantemente buscando proyectos paralelos para aprender, experimentar y crecer.",

    // Dashboard
    "dashboard.label": "Dashboard de Vida",
    "dashboard.title": "Métricas Importantes",
    "dashboard.description": "Una foto de dónde estoy — equilibrando ingeniería, deporte y aprendizaje continuo.",
    "dashboard.stats.yearsCoding": "Años Programando",
    "dashboard.stats.booksThisYear": "Libros Este Año",
    "dashboard.stats.internships": "Prácticas",
    "dashboard.stats.projects": "Proyectos",
    "dashboard.weeklyActivity": "Actividad Semanal",
    "dashboard.weeklyActivityDesc": "Distribución de horas por actividad",
    "dashboard.skillFocus": "Foco de Habilidades",
    "dashboard.skillFocusDesc": "Niveles de competencia actuales",
    "dashboard.degreeProgress": "Avance Carrera",
    "dashboard.degreeProgressDetail": "4to año / 5 años",
    "dashboard.internshipsLabel": "Prácticas",
    "dashboard.internshipsDetail": "3 completadas",
    "dashboard.hockeyYears": "Años de Hockey",
    "dashboard.hockeyYearsDetail": "Jugando y entrenando",
    "dashboard.sideProjects": "Proyectos Personales",
    "dashboard.sideProjectsDetail": "Siempre construyendo",
    "dashboard.coding": "Programación",
    "dashboard.hockey": "Hockey",
    "dashboard.study": "Estudio",
    "dashboard.frontend": "Frontend",
    "dashboard.backend": "Backend",
    "dashboard.design": "Diseño",

    // Skills
    "skills.label": "Habilidades",
    "skills.title": "Con qué trabajo.",
    "skills.description": "Me enfoco en desarrollo web, construyendo aplicaciones responsivas y accesibles con herramientas y frameworks modernos.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.tools": "Herramientas",

    // Experience
    "experience.label": "Experiencia",
    "experience.title": "Donde he aprendido.",
    "experience.description": "Tres prácticas profesionales que formaron mi manera de pensar sobre código, colaboración y construcción de productos.",
    "experience.job1.title": "Práctica en Ingeniería de Software",
    "experience.job1.company": "Finapsys (health tech B2B SaaS)",
    "experience.job1.period": "Verano 2024",
    "experience.job1.description": "Construí vistas y componentes frontend reactivos en TypeScript + Vue.js.",
    "experience.job2.title": "Práctica en Gestión de Activos",
    "experience.job2.company": "A3 Property Investments",
    "experience.job2.period": "Verano 2023",
    "experience.job2.description": "Desarrollé landing pages responsivas y contribuí a una biblioteca de componentes React.",
    "experience.job3.title": "Práctica en Retail y E-commerce",
    "experience.job3.company": "Visionary",
    "experience.job3.period": "Sabático 2021",
    "experience.job3.description": "Manejé operaciones de e-commerce/PDV/distribuidor en Shopify + BSale; construí pronósticos de ventas e inventario y rastreé KPIs clave (tasa de conversión, ticket promedio, margen) para coordinar precios, promociones y reposición.",

    // Books
    "books.label": "Lista de Lectura",
    "books.title": "Libros en los que pienso frecuentemente",
    "books.description": "Haz clic en cualquier libro para leer mi reseña. Estos textos han influenciado cómo abordo problemas, entiendo sistemas y veo el mundo.",
    "books.myTake": "Mi Opinión",
    "books.book1.review": "Un texto fundacional que formó mi comprensión de la justicia y la sociedad ideal. Los diálogos de Platón te desafían a cuestionar todo — gobierno, verdad y la naturaleza de la realidad misma.",
    "books.book2.review": "Filosofía accesible a través de la narrativa. Este libro encendió mi curiosidad sobre las grandes preguntas cuando era más joven. Una puerta perfecta al pensamiento filosófico occidental.",
    "books.book3.review": "Lectura esencial para entender la historia industrial de Chile. Bonnefoy captura las historias humanas detrás de la mina de cobre a cielo abierto más grande del mundo — una lente hacia el trabajo, la comunidad y el progreso.",
    "books.book4.review": "Una obra maestra de ficción histórica envuelta en misterio. Eco teje semiótica, historia medieval y narrativa detectivesca en algo completamente cautivador. Denso pero gratificante.",

    // Hockey
    "hockey.label": "Mi Camino en Hockey",
    "hockey.title": "Jugando y Entrenando",
    "hockey.description": "Dos caminos paralelos — años en la cancha como jugadora y ahora compartiendo esa pasión a través del entrenamiento.",
    "hockey.playerTrajectory": "Trayectoria como jugadora",
    "hockey.coachingTrajectory": "Trayectoria como entrenadora",
    "hockey.player1.title": "Empecé a Jugar",
    "hockey.player1.description": "Comencé mi camino en hockey como jugadora",
    "hockey.player2.title": "Retiro temprano",
    "hockey.player2.description": "Me enfoqué en la universidad y luego pandemia",
    "hockey.player3.title": "Volví a jugar y competir",
    "hockey.player3.description": "Continuando jugando y desarrollando habilidades",
    "hockey.player4.title": "Ruptura de LCA",
    "hockey.player4.description": "Mediados de noviembre. Retorno esperado a competir: agosto 2026",
    "hockey.coaching1.description": "Sub-12 y Sub-16",
    "hockey.coaching2.description": "Asistente de entrenamiento de equipos juveniles",
    "hockey.coaching3.description": "Copa del Mundo Junior Femenino en Santiago",

    // Contact
    "contact.label": "Contacto",
    "contact.title": "Conectemos.",
    "contact.description": "¿Buscando prácticas, proyectos freelance, o simplemente quieres hablar sobre desarrollo web? Me encantaría saber de ti.",
    "contact.location": "Ubicación",
    "contact.email": "Email",
    "contact.preferEmail": "¿Prefieres email? Escríbeme directamente.",
    "contact.sendEmail": "Enviar Email",

    // Footer
    "footer.builtWith": "Hecho con cariño.",
    "footer.cv": "CV",

    // CV Page
    "cv.back": "Volver",
    "cv.downloadPdf": "Descargar PDF",
    "cv.photo": "Foto",
    "cv.role": "Práctica Ingeniería de Software · Desarrolladora Web",
    "cv.summary": "Estudiante de ingeniería con 3 prácticas construyendo aplicaciones web en producción. Entrego código limpio y enfocado en el usuario, y traigo la misma disciplina de entrenar atletas a colaborar en equipos técnicos. Graduación 2026, buscando roles de ingeniería de producto.",
    "cv.selectedProjects": "Proyectos Seleccionados",
    "cv.workExperience": "Experiencia Laboral",
    "cv.education": "Educación",
    "cv.skills": "Habilidades",
    "cv.leadershipAthletics": "Liderazgo y Deporte",
    "cv.languages": "Lenguajes",
    "cv.frameworks": "Frameworks",
    "cv.tools": "Herramientas",
    "cv.availableFor": "Disponible para Prácticas Verano 2025",
    "cv.project1.title": "Análisis de Video Deportivo y Flujo de Clips",
    "cv.project1.type": "Proyecto Personal",
    "cv.project1.description": "Construí una app web para subir grabaciones de partidos, marcar momentos clave, y generar automáticamente clips destacados. Diseñada para entrenadores y jugadores para agilizar la revisión de video.",
    "cv.project1.impact": "Redujo el tiempo de revisión de video en 60% para mi equipo de hockey",
    "cv.project2.title": "Optimizador de Asignación de Motores de Flota de Aeronaves",
    "cv.project2.type": "Proyecto de Curso — Métodos de Optimización",
    "cv.project2.description": "Desarrollé una herramienta de optimización para asignar motores a través de una flota de aeronaves minimizando costos de mantenimiento mientras cumple restricciones de horarios de vuelo.",
    "cv.project2.impact": "Logró 12% de reducción de costos vs. heurística base en escenarios simulados",
    "cv.job1.title": "Práctica en Ingeniería de Software",
    "cv.job1.company": "Empresa de Tecnología",
    "cv.job1.period": "Verano 2024",
    "cv.job1.bullet1": "Desarrollé 3 características full-stack para herramientas internas usadas por 200+ empleados",
    "cv.job1.bullet2": "Diseñé e implementé APIs REST manejando 10k+ solicitudes diarias",
    "cv.job1.bullet3": "Reduje tiempo de carga de página en 40% a través de code splitting y lazy loading",
    "cv.job2.title": "Práctica en Desarrollo Web",
    "cv.job2.company": "Agencia Digital",
    "cv.job2.period": "Verano 2023",
    "cv.job2.bullet1": "Construí sitios web responsivos para clientes con puntajes Lighthouse 95+",
    "cv.job2.bullet2": "Implementé mejoras de accesibilidad alcanzando cumplimiento WCAG 2.1 AA",
    "cv.job2.bullet3": "Colaboré con diseñadores para establecer patrones de biblioteca de componentes",
    "cv.job3.title": "Práctica en Desarrollo Frontend",
    "cv.job3.company": "Startup",
    "cv.job3.period": "Verano 2022",
    "cv.job3.bullet1": "Creé componentes UI reutilizables adoptados por 4 equipos de producto",
    "cv.job3.bullet2": "Integré sistema de diseño Figma reduciendo tiempo de handoff diseño-código",
    "cv.job3.bullet3": "Escribí tests unitarios alcanzando 80% de cobertura en flujos críticos de usuario",
    "cv.education.degree": "Título de Ingeniería",
    "cv.education.institution": "Universidad",
    "cv.education.period": "2020 – 2026 (Esperado)",
    "cv.education.details": "Enfoque: Ingeniería de Software y Desarrollo Web",
    "cv.education.coursework": "Métodos de Optimización, Estructuras de Datos, Bases de Datos, Diseño UI/UX",
    "cv.leadership1.role": "Entrenadora de Hockey",
    "cv.leadership1.organization": "Selección Nacional Femenina U-14",
    "cv.leadership1.description": "Dirijo sesiones de entrenamiento y estrategia de juego para 20+ atletas. Coordino con el staff técnico en desarrollo de jugadoras.",
    "cv.leadership2.role": "Jugadora de Hockey",
    "cv.leadership2.organization": "Equipos de Club y Regionales",
    "cv.leadership2.description": "Jugadora competitiva con 10+ años de experiencia. Roles de capitana de equipo desarrollando comunicación y liderazgo en cancha.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
