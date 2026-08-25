export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const GITHUB_CONTRIBUTIONS_PATH = "/api/github/contributions";

export const PORTFOLIO_PATHS = [
  "/api/portfolio",
  "/api/portfolio/ai-insight",
  "/api/portfolio/history",
  GITHUB_CONTRIBUTIONS_PATH,
];
