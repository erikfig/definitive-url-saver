import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { SaveToIndexedDb } from '../services/SaveToIndexedDb';
import type { Embed } from '../services/SaveToIndexedDb';

// Interface para o contexto
interface IndexedDbContextType {
  dbService: SaveToIndexedDb | null;
  isLoading: boolean;
  error: Error | null;
}

// Criação do contexto com valor inicial
const IndexedDbContext = createContext<IndexedDbContextType>({
  dbService: null,
  isLoading: true,
  error: null
});

// Props do Provider
interface IndexedDbProviderProps {
  children: ReactNode;
}

/**
 * Provider que inicializa o serviço de IndexedDB e o disponibiliza via contexto
 */
export const IndexedDbProvider: React.FC<IndexedDbProviderProps> = ({ children }) => {
  const [dbService] = useState<SaveToIndexedDb>(new SaveToIndexedDb());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Inicializa o banco de dados quando o componente for montado
    const initDb = async () => {
      try {
        await dbService.init();
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao inicializar o banco de dados:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao inicializar o banco'));
        setIsLoading(false);
      }
    };

    initDb();
  }, [dbService]);

  return (
    <IndexedDbContext.Provider
      value={{
        dbService,
        isLoading,
        error
      }}
    >
      {children}
    </IndexedDbContext.Provider>
  );
};

/**
 * Hook personalizado para usar o serviço de IndexedDB
 * @returns Contexto com o serviço de banco de dados, estado de carregamento e erro
 */
export const useIndexedDb = () => {
  const context = useContext(IndexedDbContext);
  
  if (context === undefined) {
    throw new Error('useIndexedDb deve ser usado dentro de um IndexedDbProvider');
  }
  
  return context;
};

/**
 * Hook que oferece métodos simplificados para trabalhar com embeds
 */
export const useEmbeds = () => {
  const { dbService, isLoading, error } = useIndexedDb();
  
  // Função para salvar um novo embed
  const saveEmbed = async (embed: Omit<Embed, 'id'>) => {
    if (!dbService) throw new Error('Serviço de banco de dados não inicializado');
    return await dbService.saveEmbed(embed as Embed);
  };
  
  // Função para obter todos os embeds
  const getAllEmbeds = async () => {
    if (!dbService) throw new Error('Serviço de banco de dados não inicializado');
    return await dbService.getAllEmbeds();
  };
  
  // Função para obter um embed específico por ID
  const getEmbedById = async (id: number) => {
    if (!dbService) throw new Error('Serviço de banco de dados não inicializado');
    return await dbService.getEmbedById(id);
  };
  
  // Função para obter um embed por URL
  const getEmbedByUrl = async (url: string) => {
    if (!dbService) throw new Error('Serviço de banco de dados não inicializado');
    return await dbService.getEmbedByUrl(url);
  };
  
  // Função para excluir um embed
  const deleteEmbed = async (id: number) => {
    if (!dbService) throw new Error('Serviço de banco de dados não inicializado');
    return await dbService.deleteEmbed(id);
  };
  
  // Função para limpar todos os embeds
  const clearAllEmbeds = async () => {
    if (!dbService) throw new Error('Serviço de banco de dados não inicializado');
    return await dbService.clearAllEmbeds();
  };
  
  return {
    isLoading,
    error,
    saveEmbed,
    getAllEmbeds,
    getEmbedById,
    getEmbedByUrl,
    deleteEmbed,
    clearAllEmbeds
  };
};
