/** 
 * Tailwind CSS Configuration File
 * This file dictates the design system, colors, animations, and typography for the entire application.
 * It integrates deeply with `src/index.css` where CSS variables are defined.
 * @type {import('tailwindcss').Config} 
 */
module.exports = {
  // Enables toggling dark mode via a 'dark' class on a parent element (usually HTML/body)
  darkMode: ["class"],
  
  // Specifies which files Tailwind should scan to generate CSS classes. 
  // Any Tailwind class used outside these files won't be compiled into the final CSS.
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  
  theme: {
    extend: {
      // Custom typography overriding default sans-serif
      fontFamily: {
        inter: ['var(--font-inter)'], // Bound to the CSS variable defined in index.css
      },
      
      // Dynamic border radii that scale based on CSS variables
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      
      // Centralized color palette mapped to HSL CSS variables for easy theming
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Colors specific to shadcn/ui charts (if used)
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        
        // Colors specific to shadcn/ui sidebars (if used)
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      
      // Keyframe definitions for custom CSS animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' } // Uses Radix UI's calculated height
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      
      // Animation utilities mapping to the keyframes above
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  
  // Tailwind plugins
  // tailwindcss-animate adds utility classes for animating components easily
  plugins: [require("tailwindcss-animate")],
}