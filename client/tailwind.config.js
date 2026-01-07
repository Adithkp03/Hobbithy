/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3eed0',
                    300: '#95deb0',
                    400: '#5cc48a',
                    500: '#36a66b',
                    600: '#268754',
                    700: '#216c45',
                    800: '#1e5639',
                    900: '#194731',
                    950: '#0d281c',
                },
            }
        },
    },
    plugins: [],
}
