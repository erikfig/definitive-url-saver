import { useState, useEffect } from 'react'

export const WebHook = () => {
  const [url, setUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isWebhookEnabled, setIsWebhookEnabled] = useState<boolean>(false);
  
  // Carregar dados do localStorage quando o componente for montado
  useEffect(() => {
    const savedUrl = localStorage.getItem('webhook_url');
    const savedToken = localStorage.getItem('webhook_token');
    const savedEnabled = localStorage.getItem('webhook_enabled');
    
    if (savedUrl) setUrl(savedUrl);
    if (savedToken) setToken(savedToken);
    if (savedEnabled) setIsWebhookEnabled(savedEnabled === 'true');
  }, []);

  const handleSaveWebhookData = () => {
    if (!url) {
      alert('Por favor, insira uma URL válida.');
      return;
    }

    // Salvar dados no localStorage
    localStorage.setItem('webhook_url', url);
    localStorage.setItem('webhook_token', token);
    localStorage.setItem('webhook_enabled', String(isWebhookEnabled));
    
    // Manter os logs para debug
    console.log('Webhook URL salva:', url);
    console.log('Token salvo:', token);
    console.log('Webhook habilitado:', isWebhookEnabled);

    alert(`Configurações salvas:\nURL: ${url}\nToken: ${token}`);
  };

  return (
    <>
      <h2 className="text-md font-bold mb-4 text-center">Enviar para Webhook</h2>

      <div className="mb-4">
        <h3 className="mb-4 text-sm text-center text-gray-600 font-bold">
          Você pode enviar as URLs para um Webhook (N8N, Zapier, API Restfull) para integrações e automatizações.
        </h3>

        <input
          type="checkbox"
          checked={isWebhookEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              setIsWebhookEnabled(true);
            } else {
              setUrl('');
              setToken('');
              setIsWebhookEnabled(false);
              
              // Limpar os dados no localStorage quando desabilitar
              localStorage.removeItem('webhook_url');
              localStorage.removeItem('webhook_token');
              localStorage.setItem('webhook_enabled', 'false');
            }
          }
          }
        />
        <span className="ml-2 text-sm text-gray-600">Habilitar envio para Webhook</span>
      </div>

      {isWebhookEnabled && (
        <>
          <div className="mb-4">
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Digite a URL" 
              className="w-full p-2 border border-gray-300 bg-white rounded"
            />
          </div>

          <div className="mb-4">
            <input 
              type="password" 
              value={token} 
              onChange={(e) => setToken(e.target.value)}
              placeholder="Digite o token (ou deixe em branco para não enviar)" 
              className="w-full p-2 border border-gray-300 bg-white rounded"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleSaveWebhookData}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center"
            >
              Salvar Configuraçòes
            </button>
          </div>

          <pre className='mt-4 p-4 bg-gray-300 rounded text-xs overflow-auto'>
            <code>
              {token ? 
                `curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ******" \\
  -d '{"url": "https://example.com", "title": "Título da página", "description": "Descrição da página", "date": "${new Date().toLocaleDateString()}"}'` 
                : 
                `curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "title": "Título da página", "description": "Descrição da página", "date": "${new Date().toLocaleDateString()}"}'`
              }
            </code>
          </pre>
        </>
      )}
    </>
  )
}
