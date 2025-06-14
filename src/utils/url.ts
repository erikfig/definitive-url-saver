/**
 * Utilitários para manipulação de URLs
 */

/**
 * Extrai o domínio de uma URL
 * @param url URL completa
 * @returns O domínio da URL
 */
export const getDomain = (url: string): string => {
  try {
    // Cria um objeto URL para fazer o parsing correto
    const urlObj = new URL(url);
    
    // Retorna o hostname (domínio sem protocolo e caminho)
    return urlObj.hostname;
  } catch (error) {
    // Em caso de URL inválida
    console.error('URL inválida:', error);
    return '';
  }
};

/**
 * Extrai o protocolo de uma URL
 * @param url URL completa
 * @returns O protocolo da URL (com os dois pontos, ex: "https:")
 */
export const getProtocol = (url: string): string => {
  try {
    // Cria um objeto URL para fazer o parsing correto
    const urlObj = new URL(url);
    
    // Retorna o protocolo (incluindo os dois pontos, ex: "https:")
    return urlObj.protocol;
  } catch (error) {
    // Em caso de URL inválida
    console.error('URL inválida:', error);
    return '';
  }
};

/**
 * Extrai o protocolo de uma URL sem os dois pontos no final
 * @param url URL completa
 * @returns O protocolo da URL (sem os dois pontos, ex: "https")
 */
export const getProtocolClean = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Remove os dois pontos do final do protocolo
    return urlObj.protocol.replace(':', '');
  } catch (error) {
    console.error('URL inválida:', error);
    return '';
  }
};

/**
 * Extrai o protocolo e o hostname de uma URL
 * @param url URL completa
 * @returns O protocolo + hostname (ex: "https://example.com")
 */
export const getBaseUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}`;
  } catch (error) {
    console.error('URL inválida:', error);
    return '';
  }
};

/**
 * Extrai diferentes partes de uma URL
 * @param url URL completa
 * @returns Um objeto com as diferentes partes da URL
 */
export const parseUrl = (url: string): {
  protocol: string;
  domain: string;
  path: string;
  query: string;
  fragment: string;
  isValid: boolean;
} => {
  try {
    const urlObj = new URL(url);
    
    return {
      protocol: urlObj.protocol.replace(':', ''),
      domain: urlObj.hostname,
      path: urlObj.pathname,
      query: urlObj.search,
      fragment: urlObj.hash,
      isValid: true
    };
  } catch (error) {
    console.error('URL inválida:', error);
    return {
      protocol: '',
      domain: '',
      path: '',
      query: '',
      fragment: '',
      isValid: false
    };
  }
};

/**
 * Verifica se uma string é uma URL válida
 * @param url A string a ser verificada
 * @returns true se for uma URL válida, false caso contrário
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Normaliza uma URL para comparação
 * Remove protocolo, www, e barra final
 * @param url URL a ser normalizada
 * @returns URL normalizada
 */
export const normalizeUrl = (url: string): string => {
  return url
    .trim()
    .replace(/^https?:\/\//, '') // Remove protocolo
    .replace(/^www\./, '')       // Remove www
    .replace(/\/$/, '');         // Remove barra final
};
