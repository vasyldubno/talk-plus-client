/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors')

module.exports = {
	content: [
		"./src/**/*.tsx"
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
      colors: {
        'hover-gray': '#8D9794'
      }
		},
	},
	plugins: [],
}
