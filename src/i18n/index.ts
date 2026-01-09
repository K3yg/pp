import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    states: {
      focus: 'Focus',
      flow: 'Flow',
      break: 'Break',
      idle: 'Idle'
    },
    config: {
      title: 'Settings',
      workTime: 'Work Time (minutes):',
      breakTime: 'Break Time (minutes):',
      save: 'save',
      cancel: 'cancel'
    },
    controls: {
      toStart: 'to start',
      toKeepFocus: 'to keep focus',
      toStartBreak: 'to start break',
      start: 'start'
    }
  },
  'pt-BR': {
    states: {
      focus: 'Foco',
      flow: 'Flow',
      break: 'Pausa',
      idle: 'Inativo'
    },
    config: {
      title: 'Configuracoes',
      workTime: 'Tempo de Trabalho (minutos):',
      breakTime: 'Tempo de Pausa (minutos):',
      save: 'salvar',
      cancel: 'cancelar'
    },
    controls: {
      toStart: 'para iniciar',
      toKeepFocus: 'para manter o foco',
      toStartBreak: 'para iniciar pausa',
      start: 'iniciar'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: navigator.language || 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
