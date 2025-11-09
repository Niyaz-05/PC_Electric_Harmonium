/****/ // cjs to work with package.json type: module
/****/ module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          light: '#caa472',
          dark: '#7e5a3a',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
