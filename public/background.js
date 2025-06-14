// Background script para a extensão Definitive URL Saver
// Este script ficará ativo em segundo plano

// Ouve quando a extensão é instalada pela primeira vez
chrome.runtime.onInstalled.addListener(() => {
  console.log('Definitive URL Saver foi instalado');
});

// Ouve mensagens de outros componentes da extensão
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getActiveTabUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        sendResponse({ url: tabs[0].url });
      } else {
        sendResponse({ url: null });
      }
    });
    // Retorna true para indicar que a resposta será assíncrona
    return true;
  }
});

// Ouve mudanças na aba ativa para atualizar o contexto
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Aba ativa alterada:', activeInfo);
});
