// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '../assets/fonts/Fixel/fonts.css';
// Vuetify
import { createVuetify } from 'vuetify'

const customPoapeduTheme = {
  dark: true,
  colors: {
    background: "#EAE1D7",
    surface: "#15202b",
    primary: "#6BA1B4",
    secondary: "#BFD9E2",
    error: "#EB7B70",
    info: "#BFD9E2",
    success: "#A2D29F",
    warning: "#F1DCA2",
  },
};

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    defaultTheme: "customPoapeduTheme",
    themes: {
      customPoapeduTheme,
    },
    typography: {
      fontFamily: 'FixelDisplay, sans-serif',
    },
  }
})
