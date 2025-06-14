import { isExtension } from '../utils/environment'
import { getBaseUrl } from '../utils/url'

type ExtractedData = {
  url: string;
  title?: string;
  date: string;
  description?: string;
  imageUrl?: string;
}

export class CreateEmbed {
  private url!: string

  /**
   * Manipula a URL para extrair dados e criar um embed
   * @param url URL da página a ser processada
   * @returns Promise com os dados extraídos
   */
  async handle(url: string): Promise<ExtractedData> {
    this.url = url;

    try {
      // Obter o HTML da página
      const html = await this.getHtml(url);
      
      // Extrair os dados do HTML
      const data = await this.extractData(html);
      
      // Adicionar a URL e data atual
      return {
        ...data,
        url,
        date: new Date().toLocaleDateString()
      };
    } catch (error) {
      console.error('Erro ao criar embed:', error);
      // Retornar dados mínimos em caso de erro
      return {
        url,
        date: new Date().toLocaleDateString()
      };
    }
  }

  private async getHtml(url: string): Promise<string> {
    if (isExtension()) {
      try {
        const tabs = await this.getCurrentTabs();
        
        const matchingTab = tabs.find(tab => 
          tab.url && (tab.url === url || this.normalizeUrl(tab.url) === this.normalizeUrl(url))
        );
        
        if (matchingTab && matchingTab.id) {
          console.log('Página aberta encontrada, obtendo HTML diretamente');
          return await this.getHtmlFromTab(matchingTab.id);
        } else {
          console.log('URL não encontrada nas abas abertas, usando método alternativo');
          return await this.getHtmlFromLink(url);
        }
      } catch (error) {
        console.error('Erro ao tentar usar APIs da extensão:', error);
        return await this.getHtmlFromLink(url);
      }
    }

    return this.getHtmlFromLink(url);
  }

  private async getHtmlFromLink(url: string): Promise<string> {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Falha ao buscar URL: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Erro ao obter HTML:', error);
      throw error;
    }
  }

  private async extractData(html: string): Promise<ExtractedData> {
    // Criar um DOM para analisar o HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Objeto para armazenar os dados extraídos
    const data: Partial<ExtractedData> = {};
    
    // 1. Tentar extrair título
    data.title = this.extractTitle(doc);
    
    // 2. Tentar extrair descrição
    data.description = this.extractDescription(doc);
    
    // 3. Tentar extrair imagem
    data.imageUrl = this.extractImage(doc);
    
    return data as ExtractedData;
  }
  
  // Funções auxiliares para extração de dados específicos
  
  private extractTitle(doc: Document): string | undefined {
    // 1. Tentar obter de Open Graph
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    if (ogTitle) return ogTitle;
    
    // 2. Tentar obter de Twitter Card
    const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    if (twitterTitle) return twitterTitle;
    
    // 3. Fallback para a tag title
    const title = doc.querySelector('title')?.textContent;
    if (title) return title;
    
    // 4. Último recurso: tentar o primeiro h1
    const h1 = doc.querySelector('h1')?.textContent;
    if (h1) return h1.trim();
    
    return undefined;
  }
  
  private extractDescription(doc: Document): string | undefined {
    // 1. Tentar obter de Open Graph
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    if (ogDescription) return ogDescription;
    
    // 2. Tentar obter de Twitter Card
    const twitterDescription = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
    if (twitterDescription) return twitterDescription;
    
    // 3. Tentar obter da meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDescription) return metaDescription;
    
    // 4. Fallback para o primeiro parágrafo significativo
    const paragraphs = Array.from(doc.querySelectorAll('main p, article p, .content p, #content p, p'));
    for (const p of paragraphs) {
      const text = p.textContent?.trim();
      // Buscar por parágrafos que tenham conteúdo significativo
      if (text && text.length > 50 && text.length < 300) {
        return text;
      }
    }
    
    return undefined;
  }
  
  private extractImage(doc: Document): string | undefined {
    // 1. Tentar obter de Open Graph
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (ogImage) return ogImage;
    
    // 2. Tentar obter de Twitter Card
    const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    if (twitterImage) return twitterImage;
    
    // 3. Fallback para a primeira imagem significativa
    const images = Array.from(doc.querySelectorAll('main img, main picture cover, article img, .content img, #content img, img'));
    for (const img of images) {
      const src = img.getAttribute('src');
      const width = parseInt(img.getAttribute('width') || '0');
      const height = parseInt(img.getAttribute('height') || '0');

      // Verificar se é uma imagem significativa (não ícones ou imagens pequenas)
      if (src && !src.includes('icon') && !src.includes('logo') && 
          ((width > 200 && height > 200) || (!width && !height))) {

          const srcCleaned = src
            .trim()
            .replace(/^\\/, '')
            .replace(/^"/, '')
            .replace(/"$/, '')
            .replace(/\\$/, '');

          console.log('Imagem encontrada:', src, srcCleaned);

        // Converter URL relativa para absoluta se necessário
        if (!srcCleaned.startsWith('http')) {
          const baseURL = getBaseUrl(this.url)
          return `${baseURL}${srcCleaned}`;
        }
        return srcCleaned;
      }
    }

    return undefined;
  }

  /**
   * Obtém todas as abas abertas no Chrome
   * @returns Promise com array de abas
   */
  private getCurrentTabs(): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({}, (tabs) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(tabs);
          }
        });
      } else {
        reject(new Error('API chrome.tabs não disponível'));
      }
    });
  }

  /**
   * Obtém o HTML de uma aba específica usando executeScript
   * @param tabId ID da aba
   * @returns Promise com o HTML da página
   */
  private getHtmlFromTab(tabId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.executeScript(
          tabId,
          { code: 'document.documentElement.outerHTML' },
          (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else if (result && result[0]) {
              resolve(result[0] as string);
            } else {
              reject(new Error('Não foi possível obter o HTML'));
            }
          }
        );
      } else {
        reject(new Error('API chrome.tabs não disponível'));
      }
    });
  }

  /**
   * Normaliza uma URL para comparação
   * Remove protocolo, www, e barra final
   * @param url URL a ser normalizada
   * @returns URL normalizada
   */
  private normalizeUrl(url: string): string {
    return url
      .replace(/^https?:\/\//, '') // Remove protocolo
      .replace(/^www\./, '')       // Remove www
      .replace(/\/$/, '');         // Remove barra final
  }
}
