import { Link } from 'react-router-dom'
import { ImageWithFallback } from '../../components/ImageWithFallback'
import Dropdown from '../../components/Dropdown'
import Pagination from '../../components/Pagination'
import DataExport from '../../components/DataExport'
import { Search, X, ArrowLeft } from 'lucide-react'
import type { Embed } from '../../services/SaveToIndexedDb'

type ListPageComponentProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  filteredUrls: Embed[];
  isLoading: boolean;
  currentItems: Embed[];
  handleCopy: (id: number) => void;
  handleDelete: (id: number) => void;
  copiedId: number | null;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const ListPageComponent = ({
  searchTerm,
  setSearchTerm,
  clearSearch,
  filteredUrls,
  isLoading,
  currentItems,
  handleCopy,
  handleDelete,
  copiedId,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: ListPageComponentProps) => (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">URLs Salvas</h1>
        <Link 
          to="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-center inline-flex items-center"
          role="button"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
      </div>
      
      {/* Linha dedicada aos botões de exportação */}
      {filteredUrls.length > 0 && (
        <div className="mb-3">
          <DataExport 
            data={filteredUrls} 
            fileName={`urls_salvas${searchTerm ? '_filtradas' : ''}`} 
          />
        </div>
      )}
      
      {/* Campo de busca */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar URLs..."
          className="w-full p-2 pl-8 border border-gray-300 bg-white rounded"
        />
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Resultados da busca */}
      {filteredUrls.length === 0 ? (
        <div className="text-center py-8 border border-gray-300 rounded">
          <p className="text-gray-500">
            { searchTerm ? 
              `Nenhum resultado encontrado para "${searchTerm}"` : 
              isLoading ?
              'Carregando URLs salvas...' :
              'Nenhuma URL salva ainda.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="border border-gray-300 rounded overflow-hidden">
            {currentItems.map(item => (
              <div key={item.id} className="p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-300 relative">
                <div className="flex-1 pr-20"> {/* Aumentei o padding à direita para dar mais espaço aos botões */}
                  <div className="flex gap-3">
                    {/* Exibe imagem quando disponível */}
                    {item.imageUrl && (
                      <div className="flex-shrink-0">
                        <ImageWithFallback 
                          src={item.imageUrl} 
                          alt={`${item.title} thumbnail`} 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 overflow-hidden">
                      { item.title && (
                        <h3 className="font-medium text-lg line-clamp-2 overflow-hidden text-ellipsis" 
                           title={item.title}>
                          {item.title}
                        </h3> 
                      )}
                      
                      {/* URL sempre presente - limitada a uma linha */}
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm block truncate"
                        title={item.url}
                      >
                        {item.url}
                      </a>
                      
                      {/* Descrição quando disponível */}
                      {item.description && (
                        <p className="text-gray-700 text-sm mt-1 line-clamp-2" title={item.description}>
                          {item.description}
                        </p>
                      )}
                      
                      {/* Data sempre presente */}
                      <p className="text-gray-500 text-xs mt-1">Salvo em: {item.date}</p>
                    </div>
                  </div>
                </div>
                
                {/* Menu de ações com dropdown */}
                <div className="absolute top-4 right-4">
                  <Dropdown 
                    itemId={item.id} 
                    url={item.url}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    copiedId={copiedId}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Usando o componente Pagination */}
          <Pagination 
            totalItems={filteredUrls.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}
    </>
)
