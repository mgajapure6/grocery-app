/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      './screens/**/*.{js,jsx,ts,tsx}',
      './screens/*.{js,jsx,ts,tsx}',
      './*.{js,jsx,ts,tsx}',
    ],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          primary: '#007bff',
          primaryLight: '#00d4ff',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
          },
          '8': 8
        },
      },
    },
    plugins: [],
  };