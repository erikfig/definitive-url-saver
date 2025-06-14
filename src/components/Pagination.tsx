import { useEffect } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Componente de paginação reutilizável
 */
function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Quando o número total de itens mudar, verificar se a página atual ainda é válida
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(1);
    }
  }, [totalItems, totalPages, currentPage, onPageChange]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Não renderizar nada se não houver páginas para navegar
  if (totalPages <= 1) {
    return null;
  }

  return (
    <>
      {/* Controles de paginação */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          aria-label="Página anterior"
        >
          &lt;
        </button>
        
        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label={`Ir para página ${index + 1}`}
              aria-current={currentPage === index + 1 ? "page" : undefined}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          aria-label="Próxima página"
        >
          &gt;
        </button>
      </div>
      
      {/* Informação sobre a paginação */}
      <div className="text-center text-gray-500 text-sm mt-2">
        Mostrando {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} URLs
      </div>
    </>
  );
}

export default Pagination;
