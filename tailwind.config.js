module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#151821',
        },
        'background-light': '#F8F9FA',
        'background-dark': '#0D0F14',
        'surface-light': '#FFFFFF',
        'surface-dark': '#1E2129',
        'text-light': '#151821',
        'text-dark': '#E0E0E0',
        'text-muted-light': '#6c757d',
        'text-muted-dark': '#9A9A9A',
        // Cores do gradiente principal
        'gradient-cyan': 'hsla(187, 49%, 52%, 1)',
        'gradient-purple': 'hsla(267, 36%, 39%, 1)',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
      },
      backgroundImage: {
        'gradient-theme': 'linear-gradient(135deg, hsla(187, 49%, 52%, 1) 20%, hsla(267, 36%, 39%, 1) 73%)',
      },
    },
  },
  plugins: [],
}