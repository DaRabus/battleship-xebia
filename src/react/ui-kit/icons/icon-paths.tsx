// Get the basePath from Next.js config
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const ICONS = {
  GLOBE: `${basePath}/icons/globe.svg`,
  REGISTER: `${basePath}/icons/register.svg`,
  PROFILE: `${basePath}/icons/profile.svg`,
  MEME: `${basePath}/icons/meme.svg`,
  LOGIN: `${basePath}/icons/login.svg`,
  LOGOUT: `${basePath}/icons/logout.svg`,
  BOOK: `${basePath}/icons/book.svg`,
  AUTHOR: `${basePath}/icons/author.svg`,
  QUOTE: `${basePath}/icons/quote.svg`,
  EMAIL: `${basePath}/icons/email.svg`,
  GITHUB: `${basePath}/icons/github.svg`,
  LINKEDIN: `${basePath}/icons/linkedin.svg`,
  TELEGRAM: `${basePath}/icons/telegram.svg`,
  CLOSE: `${basePath}/icons/close.svg`,
  EDIT: `${basePath}/icons/edit.svg`,
  QUESTION: `${basePath}/icons/question.svg`,
  BOLD: `${basePath}/icons/bold.svg`,
  ITALIC: `${basePath}/icons/italic.svg`,
  UNDERLINE: `${basePath}/icons/underline.svg`
};
