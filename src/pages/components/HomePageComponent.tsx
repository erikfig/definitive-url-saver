import { Link } from 'react-router-dom'
import { WebHook } from '../../components/WebHook'
import { Save, List, Link2 } from 'lucide-react'

type HomePageComponentProps = {
  url: string;
  setUrl: (url: string) => void;
  handleSaveUrl: () => Promise<void>;
  isLoading: boolean;
}

export const HomePageComponent = ({ url, setUrl, handleSaveUrl, isLoading }: HomePageComponentProps) => (
  <>
    <h1 className="text-xl font-bold mb-4 text-center">Definitive URL Saver</h1>
    
    <div className="mb-4 relative">
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
        <Link2 className="h-5 w-5 text-gray-400" />
      </div>
      <input 
        type="text" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Digite a URL" 
        className="w-full p-2 pl-8 border border-gray-300 bg-white rounded"
      />
    </div>
    
    <div className="flex flex-row gap-2">
      <Link 
        to="/list" 
        className="flex-1 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded inline-flex"
        role="button"
        aria-label="Ver lista de URLs salvas"
      >
        <List className="h-5 w-5 mr-2" />
        Ver URLs salvas
      </Link>

      <button 
        onClick={handleSaveUrl}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex"
        disabled={isLoading}
      >
        <Save className="h-5 w-5 mr-2" />
        { isLoading ? 'Aguarde...' : 'Salvar URL' } 
      </button>

    </div>

    <div className='border-b-1 border-gray-300 my-4' />

    <WebHook />
  </>
)
