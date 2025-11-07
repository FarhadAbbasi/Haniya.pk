# Installation Packages for Haniya.pk Clothing Store


npx create-next-app@latest web --ts --tailwind --eslint --app --src-dir --import-alias='@/*'


npm i @supabase/supabase-js @supabase/ssr axios zod react-hook-form @hookform/resolvers date-fns clsx tailwind-merge class-variance-authority lucide-react zustand embla-carousel-react

npm i -D @tailwindcss/forms @tailwindcss/typography prettier prettier-plugin-tailwindcss eslint-config-prettier next-sitemap

npx shadcn@latest init -d

npx shadcn@latest add button input textarea select checkbox radio-group switch label form dialog sheet dropdown-menu navigation-menu breadcrumb toast



## Why these packages ?
Supabase: 
supabase/supabase-js
 + 
supabase/ssr
 for App Router server/client usage.
Forms/validation: react-hook-form, zod, 
hookform/resolvers
.
UI utilities: clsx, tailwind-merge, class-variance-authority, lucide-react.
UX: embla-carousel-react for product gallery/hero carousels.
State: zustand for cart and light client state.
HTTP: axios for external APIs (payments/shipping).
Tailwind plugins: better forms and rich text.
Formatting/ESLint: Prettier with Tailwind plugin and ESLint config.
SEO: next-sitemap for sitemap/robots generation.
shadcn/ui: component system and consistent design baseline.