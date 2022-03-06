module.exports = {
  content: ["./@/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      brand: ['Comfortaa', 'cursive'],
    },
    extend: {
      colors: {
        'skin-base':  setColor('--color-base'),
        'skin-soft':  setColor('--color-soft'),
        surface:      setColor('--color-surface'),
        'on-surface': setColor('--color-on-surface'),
        primary:      setColor('--color-primary'),
        secondary:    setColor('--color-secondary'),
        muted:        setColor('--color-muted'),
      },
    },
  },
  plugins: [],
}

function setColor(variableName) { return `rgb(var(${variableName}))`}
