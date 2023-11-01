/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            backgroundColor: {
                'bg-1': 'var(--bg-1)',
                'bg-2': 'var(--bg-2)',
            },
            textColor: {
                'text-1': 'var(--text-1)',
                'text-2': 'var(--text-2)',
                'text-3': 'var(--text-3)',
                'text-4': 'var(--text-4)',
            },
            borderColor: {
                'border-1': 'var(--border-1)',
                'border-2': 'var(--border-2)',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
                'varela-round': ['Varela Round', 'sans-serif'],
                'questrial': ['Questrial', 'sans-serif'],
            },
            fontSize: {
                'title-1': '3.2rem',
                'title-2': '2.6rem',
                'title-3': '2.0rem',
                'paragraph-1': '1.6rem',
                'paragraph-2': '1.2rem',
                'paragraph-3': '1rem',
                'paragraph-4': '0.8rem',
            },
            backgroundImage: {
                'img-1': "url('/src/bgImages/bg.png')",
                'img-2': "url('/src/bgImages/bg_2.png')"
            },
        },
    },
    plugins: [],
}

