[🇺🇸 English](../README.md) | [🇵🇹 Português](README.pt.md)

# Event Prize Wheel 🎡 (Roleta de Brindes)

<div align="center">
  <img src="../public/icon-192.png" alt="Logótipo Event Prize Wheel" width="120" />
</div>
<br/>

O **Event Prize Wheel** é uma Progressive Web App (PWA) gamificada e interativa, ideal para feiras tecnológicas, eventos de marketing e feiras escolares. Apresenta uma "Roleta de Brindes" totalmente personalizável com um bloqueio condicional de redes sociais integrado — obrigando os utilizadores a seguirem as tuas redes sociais antes de poderem jogar!

## ✨ Funcionalidades e Detalhes

- **Gamificação:** Uma roleta visualmente atraente, baseada em física, com prémios personalizáveis, efeitos sonoros e partículas (faíscas).
- **Bloqueio Social (Social Gating):** Um modal integrado que verifica se o utilizador já seguiu o teu Facebook, Instagram ou YouTube antes de desbloquear a roleta.
- **Pronto para PWA:** Instalável em iOS, Android e Desktop diretamente a partir do browser. Ocupa todo o ecrã sem barras de navegação e funciona offline após o primeiro carregamento!
- **Interface Moderna:** Desenvolvido com React, Tailwind CSS e Framer Motion para animações super fluidas, transições de cores e uma estética imersiva e iluminada.
- **Gerador de QR Codes:** Gera códigos QR de forma dinâmica na própria app, permitindo que os participantes usem a câmara do telemóvel para aceder diretamente às tuas redes sociais.

## 🚀 Guia Passo a Passo

Segue estas instruções detalhadas para clonares, instalares, configurares e veres o projeto a funcionar na tua própria máquina.

### 1. Pré-requisitos
Antes de começares, certifica-te de que tens as seguintes ferramentas instaladas:
- **Node.js** (v16.0 ou superior) - [Descarregar aqui](https://nodejs.org/)
- **Git** - [Descarregar aqui](https://git-scm.com/)
- Um editor de código, como o [VS Code](https://code.visualstudio.com/)

### 2. Clonar o Repositório
Abre o teu terminal ou linha de comandos e corre o seguinte comando para transferir o projeto:
```bash
git clone https://github.com/teu-utilizador/event-prize-wheel.git
```
Entra na pasta do projeto recém-criada:
```bash
cd event-prize-wheel
```

### 3. Instalar Dependências
Instala todos os pacotes necessários (como React, Tailwind, Framer Motion) com o comando:
```bash
npm install
```

### 4. Iniciar o Servidor de Desenvolvimento
Para veres a aplicação a correr no teu computador em tempo real, inicia o servidor Vite:
```bash
npm run dev
```
O terminal irá mostrar-te um endereço local (normalmente `http://localhost:5173`). Clica ou copia este endereço para o teu browser (navegador de internet) para veres o projeto ao vivo.

## 🛠 Configuração Detalhada

Podes adaptar facilmente este modelo (template) para se adequar à identidade visual e prémios da tua própria marca ou evento.

### Personalizar Prémios da Roleta
1. Abre o ficheiro `src/components/PrizeWheel.jsx` (ou se o array tiver sido movido para o componente pai, `src/pages/Roleta.jsx`).
2. Procura a lista (array) de `PRIZES`.
3. Altera o texto, as cores de fundo, os ícones e as probabilidades consoante os prémios que queres dar. A roleta desenha as fatias automaticamente com base neste código.

### Alterar Links das Redes Sociais e Restrições
1. Abre o ficheiro `src/components/SocialQRModal.jsx`.
2. Procura o objeto `SOCIAL_CONFIG`.
3. Atualiza os campos `url` com os links reais das tuas páginas (ex: `https://instagram.com/atuapagina`).
4. Podes também alterar se uma plataforma é `required: true` (o utilizador tem mesmo de a seguir para rodar) ou `required: false` (apenas opcional).

### Design e Logótipos
- **Logótipo e Ícones:** Substitui as imagens na pasta `public/` (como o `icon-192.png` e `icon-512.png`) pelo teu próprio logótipo. Lembra-te de manter o mesmo nome ou de atualizar as referências nos ficheiros `index.html` e `manifest.json`.
- **Cores e Estilo:** O fundo dinâmico e as luzes são gerados no ficheiro `src/components/BurningBackground.jsx`. As cores da interface principal podem ser ajustadas pelas classes do Tailwind no ficheiro `src/pages/Home.jsx`.

## 📦 Compilar para Produção

Quando estiveres satisfeito com as tuas alterações e quiseres alojar o teu site na internet (num serviço como Vercel, Netlify, ou GitHub Pages), corre o comando:
```bash
npm run build
```
Isto vai criar uma pasta chamada `dist` que contém os ficheiros otimizados, super leves e prontos para colocar online.

## 📜 Licença

Este projeto é de código aberto e está disponível sob a [Licença MIT](../LICENSE). Sente-te à vontade para o utilizares nos teus eventos escolares ou empresariais, altera o que quiseres e melhora o código!
