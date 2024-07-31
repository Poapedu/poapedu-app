// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '../assets/fonts/Fixel/fonts.css';
// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    typography: {
      fontFamily: 'FixelDisplay, sans-serif',
    },
  }
})
