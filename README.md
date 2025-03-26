# Pokedex React App

## Descrição

Este é um projeto desenvolvido com React que utiliza a PokeAPI para exibir uma Pokédex interativa. O aplicativo permite a busca, visualização de detalhes e rolagem infinita de Pokémons, além de sugerir pokémons automaticamente conforme o usuário digita na barra de pesquisa. O modal exibe informações detalhadas sobre o Pokémon, incluindo tipos, altura, peso e descrição.

## Funcionalidades

- **Busca por nome**: Ao digitar na barra de pesquisa, sugestões de Pokémon aparecem abaixo da barra. Pressionar Enter exibe o primeiro Pokémon sugerido ou o Pokémon exato caso seja encontrado.
- **Exibição dos detalhes**: Ao clicar em um Pokémon, suas informações são exibidas em um modal, incluindo tipos, altura, peso e descrição.
- **Scroll infinito**: Carrega Pokémons em blocos de 20 conforme o usuário rola para baixo.
- **Responsividade**: A interface foi projetada para se ajustar bem a diferentes tamanhos de tela.

## Tecnologias Usadas

- **React.js**: Para criação da interface do usuário.
- **PokeAPI**: API pública usada para obter os dados de Pokémons.
- **CSS**: Estilização da interface.
- **React Hooks**: Para gerenciamento de estado e efeitos.

## Como Rodar o Projeto

1. **Clone o repositório**:
   git clone https://github.com/FelipeBattarra/Pokedex_.git

2. **Entre no diretório do projeto**:
    cd pokedex

3. **Instale as dependências:**
    npm install

4. **Inicie o servidor de desenvolvimento:**
    npm start

5. **Abra o navegador e acesse o http://localhost:3000.** (Em caso de quaisquer erros ou bugs basta recarregar a página)

## Como Usar
Digite o nome de um Pokémon na barra de pesquisa.

Veja sugestões à medida que você digita.

Clique em um Pokémon da lista ou pressione Enter para visualizar seu modal com detalhes.

Desça para carregar mais Pokémons automaticamente.

## Exemplo de Resultado:

![Captura de tela 2025-03-26 113039](https://github.com/user-attachments/assets/68ac67f2-53cd-4cb1-922b-ad4732729f61)


![Captura de tela 2025-03-26 113024](https://github.com/user-attachments/assets/c18de7f6-21b5-4a70-8fc2-a247bc5e7301)


![Captura de tela 2025-03-26 113056](https://github.com/user-attachments/assets/f8ec8aab-a79d-4b9e-a43c-3849b12384b3)

## Vídeo demonstrando a interação do usuário: [Clique aqui para assistir](https://www.youtube.com/watch?v=mN_LjcDxYsw)