export const UI_BASE_URL =
  process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://automationexercise.com';

export const API_BASE_URL = `${UI_BASE_URL}/api`;
