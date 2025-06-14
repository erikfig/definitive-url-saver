export const isExtension = () => {
  // Verifica se o ambiente é uma extensão do Chrome
  return typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined';
}
