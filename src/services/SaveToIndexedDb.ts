/**
 * Serviço para salvar, buscar e excluir embeds no IndexedDB
 */

// Definição do tipo de dado que será armazenado
export interface Embed {
  id: number;
  url: string;
  title?: string;
  date: string;
  description?: string;
  imageUrl?: string;
}

// Nome do banco de dados e store
const DB_NAME = 'definite-url-saver';
const DB_VERSION = 1;
const STORE_NAME = 'embeds';

export class SaveToIndexedDb {
  private db: IDBDatabase | null = null;

  /**
   * Inicializa o banco de dados
   * @returns Promise que resolve quando o banco está pronto
   */
  async init(): Promise<void> {
    if (this.db) {
      return; // Banco já inicializado
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Erro ao abrir o banco de dados:', event);
        reject(new Error('Não foi possível abrir o banco de dados'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('Banco de dados aberto com sucesso');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Cria o object store se não existir
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
          
          // Cria índices para busca rápida
          store.createIndex('url', 'url', { unique: true });
          store.createIndex('date', 'date', { unique: false });
          
          console.log('Object store criado');
        }
      };
    });
  }

  /**
   * Salva um novo embed no banco de dados ou atualiza se já existir (upsert)
   * @param embed Dados do embed a ser salvo
   * @returns Promise com o ID do embed salvo
   */
  async saveEmbed(embed: Partial<Embed>): Promise<number> {
    await this.init();
    
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        // Verificar se o embed já tem um ID definido
        if (embed.id) {
          // Se tem ID, é uma atualização direta
          const transaction = this.db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const request = store.put(embed);
          
          request.onsuccess = () => {
            console.log('Embed atualizado com sucesso (por ID)');
            resolve(request.result as number);
          };
          
          request.onerror = (event) => {
            console.error('Erro ao atualizar embed por ID:', event);
            reject(new Error('Não foi possível atualizar o embed'));
          };
          
          return;
        }
        
        // Se não tem ID, verificar se já existe por URL
        const existingEmbed = await this.getEmbedByUrl(embed.url!);
        
        if (existingEmbed) {
          // Se existir, atualizar usando o ID existente
          const updatedEmbed = {
            ...existingEmbed,            // Base: dados existentes
            ...embed,                     // Sobrescrever com novos dados
            id: existingEmbed.id,        // Garantir que o ID seja mantido
            url: existingEmbed.url       // Manter a URL original para evitar violações de unicidade
          };
          
          const transaction = this.db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const request = store.put(updatedEmbed);
          
          request.onsuccess = () => {
            console.log('Embed atualizado com sucesso (por URL)');
            resolve(existingEmbed.id);
          };
          
          request.onerror = (event) => {
            console.error('Erro ao atualizar embed por URL:', event);
            reject(new Error('Não foi possível atualizar o embed'));
          };
        } else {
          // Se não existir, criar novo
          const newEmbed = {
            ...embed,
          };
          
          const transaction = this.db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const request = store.add(newEmbed);
          
          request.onsuccess = () => {
            console.log('Novo embed criado com sucesso');
            resolve(request.result as number);
          };
          
          request.onerror = (event) => {
            console.error('Erro ao criar novo embed:', event);
            reject(new Error('Não foi possível criar novo embed'));
          };
        }
      } catch (error) {
        console.error('Erro na operação de saveEmbed:', error);
        reject(error);
      }
    });
  }

  /**
   * Busca todos os embeds salvos
   * @returns Promise com array de embeds
   */
  async getAllEmbeds(): Promise<Embed[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => {
          console.log(`${request.result.length} embeds encontrados`);
          resolve(request.result as Embed[]);
        };
        
        request.onerror = (event) => {
          console.error('Erro ao buscar embeds:', event);
          reject(new Error('Não foi possível buscar os embeds'));
        };
      } catch (error) {
        console.error('Erro na transação:', error);
        reject(error);
      }
    });
  }

  /**
   * Busca um embed pelo ID
   * @param id ID do embed
   * @returns Promise com o embed ou null se não encontrado
   */
  async getEmbedById(id: number): Promise<Embed | null> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);
        
        request.onsuccess = () => {
          const embed = request.result as Embed;
          console.log(embed ? 'Embed encontrado' : 'Embed não encontrado');
          resolve(embed || null);
        };
        
        request.onerror = (event) => {
          console.error('Erro ao buscar embed:', event);
          reject(new Error('Não foi possível buscar o embed'));
        };
      } catch (error) {
        console.error('Erro na transação:', error);
        reject(error);
      }
    });
  }

  /**
   * Busca um embed pela URL
   * @param url URL do embed
   * @returns Promise com o embed ou null se não encontrado
   */
  async getEmbedByUrl(url: string): Promise<Embed | null> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('url');
        const request = index.get(url);
        
        request.onsuccess = () => {
          const embed = request.result as Embed;
          console.log(embed ? 'Embed encontrado pela URL' : 'Embed não encontrado pela URL');
          resolve(embed || null);
        };
        
        request.onerror = (event) => {
          console.error('Erro ao buscar embed pela URL:', event);
          reject(new Error('Não foi possível buscar o embed pela URL'));
        };
      } catch (error) {
        console.error('Erro na transação:', error);
        reject(error);
      }
    });
  }

  /**
   * Exclui um embed pelo ID
   * @param id ID do embed a ser excluído
   * @returns Promise que resolve quando a exclusão é concluída
   */
  async deleteEmbed(id: number): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        
        request.onsuccess = () => {
          console.log('Embed excluído com sucesso');
          resolve();
        };
        
        request.onerror = (event) => {
          console.error('Erro ao excluir embed:', event);
          reject(new Error('Não foi possível excluir o embed'));
        };
      } catch (error) {
        console.error('Erro na transação:', error);
        reject(error);
      }
    });
  }

  /**
   * Limpa todos os embeds do banco de dados
   * @returns Promise que resolve quando a limpeza é concluída
   */
  async clearAllEmbeds(): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        
        request.onsuccess = () => {
          console.log('Todos os embeds foram excluídos');
          resolve();
        };
        
        request.onerror = (event) => {
          console.error('Erro ao limpar embeds:', event);
          reject(new Error('Não foi possível limpar os embeds'));
        };
      } catch (error) {
        console.error('Erro na transação:', error);
        reject(error);
      }
    });
  }
}
