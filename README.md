[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/PedrooFerraz/Inventory-app)

# GMI Inventory Pro

## Descrição do Projeto

O **GMI Inventory Pro** é um sistema profissional de gestão de inventário industrial, desenvolvido para facilitar o controle, contagem e administração de estoques em ambientes industriais. A aplicação permite importar dados de inventário via arquivos CSV, realizar a contagem de itens utilizando QR Code, gerenciar operários responsáveis pela contagem, exportar relatórios em Excel e manter um histórico detalhado das operações realizadas. O objetivo é otimizar o processo de inventário, reduzir erros manuais e fornecer uma interface intuitiva para equipes de logística e gestão.

## Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Framework:** React Native (Expo)
- **Navegação:** Expo Router
- **Banco de Dados Local:** SQLite (expo-sqlite)
- **Gerenciamento de Arquivos:** expo-file-system, expo-document-picker
- **Leitura de CSV:** papaparse
- **Exportação para Excel:** xlsx
- **Componentes Visuais:** React Native, Expo Vector Icons, Linear Gradient
- **Gerenciamento de Estado:** React Hooks
- **Outras Bibliotecas:** AsyncStorage, expo-camera

## Instalação

1. **Pré-requisitos:**
   - Node.js (recomendado: versão 18 ou superior)
   - npm ou yarn
   - Expo CLI (`npm install -g expo-cli`)

2. **Clone o repositório:**
   ```sh
   git clone https://github.com/PedrooFerraz/Inventory-app.git
   cd Inventory-app/my-app
   ```

3. **Instale as dependências:**
   ```sh
   npm install
   # ou
   yarn install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm start
   # ou
   yarn start
   ```

5. **Abra o aplicativo no Expo Go:**
   - Escaneie o código QR exibido no terminal ou na página da web que se abre.
   - Certifique-se de que seu dispositivo móvel esteja conectado à mesma rede Wi-Fi que o seu computador.

## Uso

- **Tela de Login:**
  - Campos para e-mail e senha.
  - Botão de login que redireciona para a tela principal.

- **Tela Master:**
  - Visão geral podendo gerenciar operadores e inventários.
  - Acesso rápido às funções de importação e exportação.

- **Contagem de Itens:**
  - Leitura de QR Code para identificação de produtos.
  - Campos para entrada manual de dados, se necessário.
  - Botão para salvar a contagem.

- **Importação e Exportação:**
  - Opções para importar dados de inventário via CSV.
  - Geração de relatórios em Excel para exportação.
---

## Como importar o inventário (CSV)

> **Atenção:** Para importar corretamente o inventário, o arquivo CSV deve obrigatoriamente conter as seguintes colunas (com estes nomes exatos):

| Documento Inventário | Ano | centro | Depósito | Lote | Item Inventário | Material | Texto Breve | Estoque Utilização Livre | UN | Posição Depósito | Bloqueio
|----------------------|-----|--------|----------|------|-----------------|----------|-------------|--------------------------|----|------------------|----------

Exemplo de cabeçalho e linhas do arquivo CSV:
```
Material,Texto Breve,Posição Depósito,Estoque Utilização Livre,Unidade de Medida,Centro
100001,Parafuso M10,ALMOX 01,150,UN,0010
100002,Arruela A10,ALMOX 02,300,UN,0010
```

- O arquivo deve estar salvo em formato **CSV separado por vírgulas**.
- Não altere os nomes das colunas para garantir a correta importação dos dados.
- Caso o arquivo possua colunas extras, elas serão ignoradas.
- Certifique-se de que não há espaços extras nos nomes das colunas.

**Passos para importar:**
1. Acesse a tela de acesso master.
2. Clique em **"Importar Inventário"**.
3. Selecione o arquivo CSV conforme o modelo acima.
4. Confirme se os dados foram lidos corretamente na pré-visualização.
5. Clique em **"Importar Inventário"** para finalizar a importação.

---

## Como exportar o inventário

1. Acesse o **Histórico de Inventários**.
2. Selecione o inventário desejado.
3. Clique em **"Exportar Inventário"** para gerar e compartilhar um arquivo Excel (.xlsx) com todos os dados da contagem.

---

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests ou relatar problemas.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

- **Nome:** Pedro Ferraz
- **E-mail:** pedro@phflima.com
- **LinkedIn:** [linkedin.com/in/pedro-ferraz](https://www.linkedin.com/in/pedro-henrique-ferraz-lima-034691198/)
