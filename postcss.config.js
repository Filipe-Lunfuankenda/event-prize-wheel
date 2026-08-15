/**
 * PostCSS Configuration File
 * PostCSS is a tool for transforming CSS with JavaScript. 
 * This file integrates Tailwind CSS into the build pipeline.
 */
export default {
  plugins: {
    // Processes the Tailwind directives (@tailwind base, etc.) in index.css
    tailwindcss: {},
    
    // Automatically adds vendor prefixes (-webkit-, -moz-, etc.) to CSS rules
    // ensuring cross-browser compatibility without writing them manually.
    autoprefixer: {},
  },
}