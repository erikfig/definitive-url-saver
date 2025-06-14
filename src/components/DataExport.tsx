import { useState } from 'react';
import type { Embed } from '../services/SaveToIndexedDb';
import { FileText, FileSpreadsheet, FileJson } from 'lucide-react';

interface DataExportProps {
  data: Embed[];
  fileName?: string;
}

/**
 * Componente para exportar dados para TXT, CSV e JSON
 */
function DataExport({ data, fileName = 'saved_urls' }: DataExportProps) {
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  
  // Limpa a mensagem de status após alguns segundos
  const showStatusMessage = (message: string) => {
    setExportStatus(message);
    setTimeout(() => {
      setExportStatus(null);
    }, 3000);
  };
  
  // Exporta para TXT (somente URLs)
  const exportToTxt = () => {
    try {
      // Lista simples de URLs
      const content = data.map(item => item.url).join('\n');
      downloadFile(content, `${fileName}.txt`, 'text/plain');
      showStatusMessage('Arquivo TXT exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar para TXT:', error);
      showStatusMessage('Erro ao exportar para TXT');
    }
  };
  
  // Exporta para CSV (todos os dados)
  const exportToCsv = () => {
    try {
      // Cabeçalho do CSV
      const headers = ['id', 'url', 'title', 'description', 'imageUrl', 'date'];
      
      // Função para escapar valores CSV (lidar com vírgulas, aspas, etc)
      const escapeCSV = (value: any) => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // Se contém vírgulas, quebras de linha ou aspas, coloca em aspas e escapa aspas internas
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };
      
      // Constrói as linhas do CSV
      const csvContent = [
        // Cabeçalho
        headers.join(','),
        // Dados
        ...data.map(item => [
          item.id,
          escapeCSV(item.url),
          escapeCSV(item.title || ''),
          escapeCSV(item.description || ''),
          escapeCSV(item.imageUrl || ''),
          escapeCSV(item.date)
        ].join(','))
      ].join('\n');
      
      downloadFile(csvContent, `${fileName}.csv`, 'text/csv');
      showStatusMessage('Arquivo CSV exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar para CSV:', error);
      showStatusMessage('Erro ao exportar para CSV');
    }
  };
  
  // Exporta para JSON (todos os dados em formato completo)
  const exportToJson = () => {
    try {
      const jsonContent = JSON.stringify(data, null, 2); // Formatado com indentação
      downloadFile(jsonContent, `${fileName}.json`, 'application/json');
      showStatusMessage('Arquivo JSON exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar para JSON:', error);
      showStatusMessage('Erro ao exportar para JSON');
    }
  };
  
  // Função auxiliar para download de arquivos
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Libera memória
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs font-medium text-gray-700 whitespace-nowrap">Exportar:</div>
      <div className="flex gap-1">
        <button
          onClick={exportToTxt}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded flex items-center"
          disabled={data.length === 0}
          title="Exportar URLs como texto simples (.txt)"
        >
          <FileText className="h-4 w-4 mr-0.5 stroke-current" />
          TXT
        </button>
        
        <button
          onClick={exportToCsv}
          className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded flex items-center"
          disabled={data.length === 0}
          title="Exportar para planilha (.csv)"
        >
          <FileSpreadsheet className="h-4 w-4 mr-0.5 stroke-current" />
          CSV
        </button>
        
        <button
          onClick={exportToJson}
          className="bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-2 rounded flex items-center"
          disabled={data.length === 0}
          title="Exportar dados completos (.json)"
        >
          <FileJson className="h-4 w-4 mr-0.5 stroke-current" />
          JSON
        </button>
      </div>
      
      {exportStatus && (
        <div className="text-xs text-green-600 animate-fade-in-out">
          {exportStatus}
        </div>
      )}
    </div>
  );
}

export default DataExport;
