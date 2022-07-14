/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
	    animation: {
          // Bounces for a total of 5 seconds
          'bounce-short': 'bounce 1s ease-in-out 5'
        }
      }
  },
  plugins: [
    require('flowbite/plugin')],
};
