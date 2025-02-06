# 🍅 ProModoro

**Vue + TypeScript**.

## 📌 Recursos
- **Modos do Timer**:
  - **Focus** → Tempo de foco
  - **Flow** → Tempo contínuo de trabalho, sem pausas
  - **Break** → Período de descanso
- **Atalhos de Teclado**:
  - `space` → Iniciar timer
  - `enter` → Manter o foco após término do tempo
  - `n` → Iniciar pausa
- **Configuração Personalizada**: Defina tempos de trabalho e pausa conforme necessário.
- **Persistência de Estado**: O estado do timer é salvo no `localStorage` e restaurado automaticamente.

## 🚀 Instalação e Execução
Clone o repositório, instale as dependências e inicie o projeto:

```bash
git clone https://github.com/K3yg/pp.git
cd pp
npm install
npm run dev
```

## 🎯 Como Usar
1. **Iniciar Timer**: Pressione `space` ou clique no botão **Iniciar**.
2. **Manter o Foco**: Após o término do tempo de trabalho, se quiser, pressione `enter` para continuar sem pausas.
3. **Iniciar Pausa**: Pressione `n` para entrar no **modo Break**.
4. **Configurar Tempos**: Clique no botão **⚙️** e defina tempos personalizados.

## 📂 Estrutura do Projeto
```
src/
 ├── components/
 │   ├── TimerDisplay.vue       # Exibe o cronômetro e progresso visual.
 │   ├── TimerControls.vue      # Botões de controle e atalhos de teclado.
 │   ├── TimerConfigModal.vue   # Modal de configuração dos tempos.
 ├── composables/
 │   ├── useTimer.ts            # Lógica do timer encapsulada.
 ├── App.vue                    # Componente principal.
 ├── main.ts                    # Ponto de entrada do Vue.
 ├── styles.css                 # Estilos globais.
```

## 🛠️ Tecnologias Utilizadas
- **Vue 3** + **TypeScript**
- **Composition API**
- **Vue Hotkeys (`vue-use-hotkeys`)** para atalhos de teclado
- **LocalStorage** para salvar o estado do timer
- **CSS puro** para estilização


## 📩 Contato
Desenvolvido por **Eduardo Brandt**  
📧 Email: **eduardobrandt.dev@gmail.com**  
🔗 GitHub: **[github.com/K3yg](https://github.com/K3yg)**

Desenvolvido por **Henrique Heiderscheidt**  
📧 Email: **henrique.heid@gmail.com**  
🔗 GitHub: **[github.com/Heidoco](https://github.com/Heidoco)**  

🎯 **Mantenha seu foco e produtividade com o ProModoro!**
