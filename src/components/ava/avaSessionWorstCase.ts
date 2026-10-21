/** Dev-only fixture for the session block. Realistic long and short copy, not production data. */
export const AVA_SESSION_WORST_CASE_COPY = {
  kicker: "Benachrichtigungseinstellungen",
  headline: "Aleksandra Wiśniewska-Kowalczyk",
  lede: "Paramètres de confidentialité et de sécurité para una sesión que el equipo revisa en vivo, con una nota larga que sigue siendo una sola frase de trabajo y no un párrafo de relleno.",
  withKicker: "Đặng Thị Ngọc Hân",
  steps: ["Jo", "Benachrichtigungseinstellungen", "Paramètres de confidentialité", "Đặng Thị Ngọc Hân", "Exportación"],
  aside:
    "AVA concatena al importar. El correo de la sala es bartholomew.fitzgerald@northwind-industries-holdings.example.com y el cambio a mitad de la presentación sigue siendo inmediato incluso cuando el archivo es Q3 Board Deck — FINAL (revised) v12 [approved by legal].pdf.",
} as const;
