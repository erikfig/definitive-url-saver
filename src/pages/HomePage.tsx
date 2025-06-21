import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEmbeds } from '../contexts/IndexedDbContext';
import { CreateEmbed } from '../services/CreateEmbed'
import { isExtension } from '../utils/environment'
import { HomePageComponent } from './components/HomePageComponent'
import { useWebhook } from '../hooks/useWebhook'

function HomePage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPageUrl, setCurrentPageUrl] = useState<string | null>()
  const { saveEmbed } = useEmbeds();
  const createEmbed = new CreateEmbed();
  const navigate = useNavigate();
  const {handleWebhookCall} = useWebhook();

  useEffect(() => {
    let urlHandle = window.location.href;

    if (isExtension()) {
      // Em uma extensão, obtém a URL da aba ativa atual
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && tabs[0].url) {
          urlHandle = tabs[0].url;
          setCurrentPageUrl(urlHandle);
        } else {
          setCurrentPageUrl(urlHandle);
        }
      });
      return; // Retorna para evitar o setCurrentPageUrl abaixo
    }

    setCurrentPageUrl(urlHandle)
  }, [])

  useEffect(() => {
    if (currentPageUrl) {
      setUrl(currentPageUrl)
    }
  }, [currentPageUrl])
  
  const handleSaveUrl = async () => {
    if (isLoading) return

    setIsLoading(true);

    try {
      // Extrair dados da URL
      const embedData = await createEmbed.handle(url);
      
      // Salvar no IndexedDB e Webhook
      const resolver = Promise.all([
        saveEmbed(embedData),
        handleWebhookCall(embedData),
      ]);

      await resolver;

      // Limpar o campo
      setUrl('');
      alert('URL salva com sucesso!');
      
      // Redirecionar para a página de lista
      navigate('/list');
      
    } catch (error) {
      console.error('Erro ao salvar URL:', error);
      alert('Erro ao salvar URL');
    } finally {
      setIsLoading(false);
    }
  }

  return <HomePageComponent
    url={url}
    setUrl={setUrl}
    handleSaveUrl={handleSaveUrl}
    isLoading={isLoading} />
}

export default HomePage
