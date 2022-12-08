/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		"./node_modules/react-tailwindcss-select/dist/index.esm.js"
	],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography"),require("daisyui")],
}
