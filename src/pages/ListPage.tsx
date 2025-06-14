import { useState, useMemo, useEffect } from 'react'
import { useEmbeds } from '../contexts/IndexedDbContext';
import type { Embed } from '../services/SaveToIndexedDb';
import { ListPageComponent } from './components/ListPageComponent'

const ITEMS_PER_PAGE = 3;

function ListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = ITEMS_PER_PAGE;
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const { isLoading, getAllEmbeds, deleteEmbed } = useEmbeds();

  // Carregar todos os embeds quando o componente montar
  useEffect(() => {
    const loadEmbeds = async () => {
      try {
        const data = await getAllEmbeds();
        setEmbeds(data);
      } catch (error) {
        console.error('Erro ao carregar embeds:', error);
      }
    };

    loadEmbeds();
  }, []);

  // Filtrando os itens com base no termo de busca
  const filteredUrls = useMemo(() => {
    if (!searchTerm.trim()) return embeds;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return embeds.filter(item => 
      (item.title?.toLowerCase().includes(lowerSearchTerm) || 
      item.url.toLowerCase().includes(lowerSearchTerm) || 
      item.description?.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm, embeds]);
  
  // Reset para a primeira página quando o filtro muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Itens da página atual após filtragem
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUrls.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredUrls, itemsPerPage]);

  // Limpar a busca
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handler para copiar URL
  const handleCopy = (id: number) => {
    setCopiedId(id);
    // Limpar feedback após 2 segundos
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handler para deletar item
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) {
      return
    }

    try {
      await deleteEmbed(id);
      // Atualiza a lista após excluir
      setEmbeds(embeds.filter(embed => embed.id !== id));
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  }

  return <ListPageComponent 
    isLoading={isLoading}
    currentItems={currentItems}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    itemsPerPage={itemsPerPage}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    filteredUrls={filteredUrls}
    clearSearch={clearSearch}
    copiedId={copiedId}
    handleCopy={handleCopy}
    handleDelete={handleDelete}
    />
}

export default ListPage
