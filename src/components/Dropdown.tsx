import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Copy, Trash2 } from 'lucide-react';

interface DropdownProps {
  itemId: number;
  url: string;
  onCopy: (id: number) => void;
  onDelete: (id: number) => void;
  copiedId: number | null;
}

/**
 * Componente de dropdown com ações para cada URL salva
 */
function Dropdown({ itemId, url, onCopy, onDelete, copiedId }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown quando clica fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manipula a cópia da URL
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        onCopy(itemId);
        setIsOpen(false); // Fecha o dropdown após copiar
      })
      .catch(err => {
        console.error('Erro ao copiar URL:', err);
        alert('Não foi possível copiar a URL');
      });
  };

  // Manipula a exclusão do item
  const handleDelete = () => {
    onDelete(itemId);
    setIsOpen(false); // Fecha o dropdown após confirmar a exclusão
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de três pontos vertical para abrir o dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
        aria-label="Opções"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>

      {/* Menu dropdown - posicionado para ser visível mesmo com overflow */}
      {isOpen && (
        <div 
          className="fixed mt-1 w-36 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200"
          style={{
            // Posicionamento dinâmico para evitar que seja cortado
            top: dropdownRef.current ? 
              `${dropdownRef.current.getBoundingClientRect().bottom + window.scrollY + 5}px` : 'auto',
            right: dropdownRef.current ? 
              `${window.innerWidth - dropdownRef.current.getBoundingClientRect().right - window.scrollX}px` : 'auto',
          }}
        >
          <button
            onClick={handleCopy}
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
          >
            <Copy className="h-4 w-4 mr-2 text-green-500" />
            {copiedId === itemId ? 'Copiado!' : 'Copiar URL'}
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
