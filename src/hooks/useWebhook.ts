export const useWebhook = () => {
  const handleWebhookCall = (embedData: any) => {
    // Executa chamada de webhook
    const webhookEnabled = localStorage.getItem('webhook_enabled') === 'true';

    if (!webhookEnabled) {
      return;
    }

    const webhookUrl = localStorage.getItem('webhook_url');
    const webhookToken = localStorage.getItem('webhook_token');
      
    if (!webhookUrl) {
      return
    }

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (webhookToken) {
        headers['Authorization'] = `Bearer ${webhookToken}`;
      }
      
      makeRequest(webhookUrl, headers, embedData);
    } catch (webhookError: any) {
      console.error('Erro ao processar webhook:', webhookError);
      alert('Erro ao processar webhook: ' + webhookError.message);
    }
  }

  return { handleWebhookCall };
}

const makeRequest = async (webhookUrl: string, headers: HeadersInit, embedData: any) => {
  try {
   const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(embedData)
    })

    if (response.ok) {
      console.log('Webhook enviado com sucesso');
    } else {
      console.error('Falha ao enviar webhook:', response.statusText);
      alert('Falha ao enviar webhook: ' + response.statusText);
    }

  } catch(err: any) {
    console.error('Erro ao enviar webhook:', err);
    alert('Erro ao enviar webhook: ' + err.message);
  };
}