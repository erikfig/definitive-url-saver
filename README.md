# Definitive URL Saver

Uma extensão do Chrome para salvar, organizar e gerenciar suas URLs favoritas, incluindo metadados, imagens e descrições.

## Recursos

- **Salvar URLs automaticamente** com metadados (título, descrição, imagem)
- **Pesquisa rápida** nas suas URLs salvas
- **Exportação de dados** para TXT, CSV e JSON
- **Integração via Webhook** para automações com N8N, Zapier ou APIs REST
- **Interface amigável** com design responsivo
- **Armazenamento local** usando IndexedDB

## Como instalar

### Modo de Desenvolvimento

1. Clone este repositório para sua máquina local
2. Instale as dependências: `npm install`
3. Compile a extensão: `npm run build`
4. Abra o Chrome e navegue até `chrome://extensions/`
5. Ative o "Modo do desenvolvedor" no canto superior direito
6. Clique em "Carregar sem compactação" e selecione a pasta `dist` do projeto
7. A extensão agora deve aparecer na barra de ferramentas do Chrome

### Instalação a partir da Chrome Web Store

Em breve disponível na Chrome Web Store!

## Como usar

1. Clique no ícone da extensão na barra de ferramentas do Chrome
2. Para salvar a URL atual, clique em "Salvar URL"
3. Para ver todas as URLs salvas, clique em "Ver URLs salvas"
4. Use a barra de pesquisa para filtrar URLs salvas
5. Exporte suas URLs salvas em vários formatos (TXT, CSV, JSON)
6. Configure a integração via Webhook para automatizar fluxos de trabalho

### Configurando o Webhook

A extensão permite enviar automaticamente os dados das URLs salvas para um endpoint externo:

1. Na página inicial da extensão, role para baixo até a seção "Enviar para Webhook"
2. Marque a caixa "Habilitar envio para Webhook"
3. Digite a URL do seu endpoint (API, N8N, Zapier, etc.)
4. Opcionalmente, configure um token de autenticação
5. Clique em "Salvar Configurações"

Quando uma nova URL for salva, os dados serão enviados automaticamente para o endpoint configurado via POST com o seguinte formato:

```json
{
  "url": "https://example.com",
  "title": "Título da página",
  "description": "Descrição da página",
  "imageUrl": "https://example.com/image.jpg",
  "date": "13/06/2025"
}
```

## Desenvolvimento

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila a extensão para produção
- `npm run lint` - Verifica o código em busca de erros

## Automatização de Publicação

Esta extensão utiliza GitHub Actions para automatizar o processo de build e publicação:

1. **Build automático**: Cada push para a branch principal gera um novo build
2. **Versionamento**: Criar uma tag com prefixo "v" (ex: v1.0.1) inicia o processo de publicação
3. **Publicação na Chrome Web Store**: O workflow envia automaticamente a nova versão para revisão

Para configurar a publicação automatizada:
1. Configure as credenciais da Chrome Web Store API nos segredos do GitHub
2. Atualize a versão no `manifest.json` antes de criar uma nova tag
3. Crie e faça push de uma tag: `git tag v1.0.1 && git push origin v1.0.1`

Consulte o arquivo [AUTOMATION.md](AUTOMATION.md) para instruções detalhadas.

## Tecnologias

- React
- TypeScript
- TailwindCSS
- IndexedDB
- Vite
- Lucide Icons
- Webhook API Integration

## Licença

MIT
```
