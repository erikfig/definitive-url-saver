# Automatização de Publicação da Extensão Chrome

Este documento explica como usar o GitHub Actions para automatizar o processo de build e publicação da sua extensão Chrome na Chrome Web Store.

## Como Funciona

O workflow configurado em `.github/workflows/publish.yml` automatiza:

1. **Build**: Compila a extensão quando há um push para a branch principal (main/master)
2. **Empacotamento**: Cria o arquivo ZIP necessário para a Chrome Web Store
3. **Publicação**: Envia automaticamente a nova versão para a Chrome Web Store quando uma tag é criada

## Configuração Inicial

### 1. Registrar a extensão na Chrome Web Store

Se ainda não fez isso, você precisará:

1. Criar uma conta de desenvolvedor na [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pagar a taxa única de cadastro ($5)
3. Criar uma nova entrada para sua extensão
4. Submeter uma versão inicial manualmente para obter um ID de extensão

### 2. Configurar a API da Chrome Web Store

Para permitir publicações automáticas, você precisará:

1. Acessar [Google Cloud Console](https://console.cloud.google.com/)
2. Criar um novo projeto
3. Habilitar a "Chrome Web Store API"
4. Configurar uma tela de consentimento OAuth
5. Criar credenciais OAuth (ID do Cliente, Segredo do Cliente)
6. Gerar um token de atualização (refresh token)

Você pode seguir [este guia](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md) para gerar as credenciais necessárias.

### 3. Configurar segredos no GitHub

Adicione os seguintes segredos nas configurações do seu repositório GitHub (Settings > Secrets and variables > Actions):

- `EXTENSION_ID`: O ID da sua extensão na Chrome Web Store
- `CLIENT_ID`: O ID do cliente da API OAuth
- `CLIENT_SECRET`: O segredo do cliente da API OAuth
- `REFRESH_TOKEN`: O token de atualização gerado

## Como usar o workflow

### Para desenvolvimento e testes

- Simplesmente faça push para a branch principal (main ou master)
- O GitHub Actions irá construir o projeto e criar um artefato ZIP
- Você pode baixar o ZIP dos artefatos da execução do workflow para testes

### Para publicar uma nova versão

1. Atualize a versão no `manifest.json`
2. Faça commit das alterações
3. Crie uma tag com o prefixo "v":
   ```
   git tag v1.0.1
   git push origin v1.0.1
   ```
4. O workflow irá construir e enviar automaticamente a extensão para a Chrome Web Store
5. Por padrão, a extensão será enviada para revisão, mas não será publicada automaticamente após a aprovação

### Para publicação automática

Se você quiser que a extensão seja publicada automaticamente após a aprovação, descomente a linha `publish: true` no arquivo de workflow.

## Dicas e Solução de Problemas

- Verifique o histórico de execuções no GitHub Actions para identificar possíveis erros
- Lembre-se de incrementar a versão no `manifest.json` antes de criar uma nova tag
- A primeira publicação ainda precisará ser feita manualmente
- O processo de revisão da Chrome Web Store pode levar de algumas horas a alguns dias
- Mesmo com a automação, você ainda precisará atualizar manualmente descrições, screenshots e outros metadados na página da Chrome Web Store

## Recursos Adicionais

- [Documentação da Chrome Web Store API](https://developer.chrome.com/docs/webstore/api_index/)
- [Documentação do GitHub Actions](https://docs.github.com/en/actions)
- [Documentação da ação chrome-addon](https://github.com/trmcnvn/chrome-addon)
