# Haniya Website Design's Master Description. 

## Project Overview:
You are tasked with creating the full digital identity, website and admin system for a Pakistani women’s suits brand (targeting ages 18‑35, women/girls) specialising in lawn, khaddar, cotton.


## Branding & Identity:

Brand Voice: The brand should embody a clean, modern, and elegant style that speaks to young Pakistani women (18‑35) seeking high-quality lawn, khaddar, cotton suits for everyday wear and special occasions. Think sophistication with a touch of modernity.

Logo & Typography: A simple yet memorable logo that conveys luxury and accessibility. Use modern sans-serif fonts for headings and a refined serif or clean sans for body text to create an approachable yet premium feel.

Colour Palette:

Primary: Soft pastel shades (dusty rose, sage green) and neutral tones (ivory, light grey) for elegance and sophistication.

Accent: A vibrant accent colour like a rich teal or mustard for CTAs (buttons, important highlights).

Background: Whites and light greys to maintain a clean, airy design.

Visual Style: Use high-resolution, lifestyle-driven imagery. Focus on diverse, real models in lifestyle and streetwear settings. Incorporate whitespace to ensure a modern and uncluttered design. Hero images should showcase the collections, with a clean layout that directs attention to the products.


## Reference Website Designs
https://www.mariab.pk/
https://waniya.pk/


## Website Design:

Homepage: A clean, responsive design with a hero image showcasing the latest collection. Include simple, bold calls-to-action (CTA) like “Shop Now” and “Explore New Arrivals”. Sections should introduce different fabric categories (Lawn, Khaddar, Cotton) with image-driven buttons leading to product pages.

Product Pages: Include high-quality product images with zoom capabilities. The product descriptions should highlight fabric quality, sizes, and fit. Provide a clear size guide and customer reviews.

Category Pages: Filter options for fabric type, size, price, and colour. This will enhance user experience by allowing users to quickly find what they need.

Checkout Flow: Simplified and mobile-optimized checkout process, including options for Cash on Delivery (COD), JazzCash, and Easypaisa payment methods. Ensure users can easily track their orders and return items if needed. Include local shipping options with real-time price calculations.

Admin Dashboard: Provide a user-friendly admin dashboard that allows non-technical users to manage orders, track inventory, and update product details (e.g., stock levels, pricing, description). It should include analytics for sales tracking and customer insights.

## Tech Stack Recommendations:

Frontend: Use React or Next.js (a React framework for better SEO and server-side rendering). Next.js is widely adopted for e-commerce and offers features like static site generation (SSG), server-side rendering (SSR), and API routes, making it a great choice for performance and scalability. Use Tailwind for styling. 

Backend & Database: Supabase for the database (PostgreSQL) and backend. Supabase is a modern open-source alternative to Firebase and provides real-time database functionality, authentication, and storage. It’s ideal for building a scalable e-commerce platform quickly with low maintenance overhead.

Payment Integration: Integrate JazzCash and Easypaisa using their APIs for payment processing. For COD (Cash on Delivery), ensure that the order management system handles both paid and unpaid orders efficiently, and track COD orders separately.

Shipping Integration: Integrate with popular Pakistani couriers like TCS, Leopards Courier, and BlueEx via their APIs to calculate shipping costs in real-time, track packages, and notify customers of delivery statuses.

Authentication & User Management: Use Auth0 or Supabase Auth for user authentication. These services will allow you to manage user accounts securely with email/password login and social media authentication (Google, Facebook, etc.).

SEO & Analytics: Google Analytics for tracking website performance (page views, traffic, conversions). Integrate Facebook Pixel and Instagram Pixel for ad performance tracking, retargeting, and insights. For SEO, Next.js will automatically handle static pages for search engines, but make sure the metadata and structured data are optimized for e-commerce.

Hosting: Use Vercel for deploying the Next.js app, which offers fast global CDN caching and serverless functions. Vercel provides optimal performance for React-based websites and is easy to integrate with Next.js for continuous deployment. For Supabase hosting, you can leverage Supabase’s own managed infrastructure.

## Design & UX:

Mobile-First Design: Ensure the website is optimized for mobile users first, as a significant portion of traffic will come from mobile devices (especially in Pakistan).

Performance Optimization: Implement lazy loading for images, compression for product images, and efficient state management to avoid unnecessary renders. Make sure that the website loads quickly, with a focus on reducing render-blocking resources and optimizing the JavaScript bundle size.

Accessibility: Ensure the website meets accessibility standards (WCAG 2.1). Use proper alt tags for images, readable font sizes, and keyboard navigation for users with disabilities.

Smooth Navigation: Clean header with easy access to categories, account settings, cart, and customer service. The menu should be sticky for quick access.

## Post-Launch:

Marketing: Integrate Instagram and Facebook feeds directly into the website to keep the brand social and current. Implement email marketing for promotions, cart abandonment, and new arrivals.

Analytics & Retargeting: Use customer data (with user consent) to personalize recommendations. Implement A/B testing for different product placements, CTAs, and sale promotions to increase conversion rates.

Scalability: Ensure the architecture can scale easily. Supabase's PostgreSQL database allows for easy horizontal scaling as traffic grows, and the serverless nature of Next.js will help scale with minimal overhead.

## Deliverables:

Website Design Mockups (Desktop + Mobile) for the homepage, product pages, checkout, category pages, and admin dashboard.

Fully Functional Website built on Next.js with a custom theme, payment integrations, and shipping functionality.

Admin Dashboard that allows for easy product and order management, customer tracking, and reporting.

Documentation for site management (content updates, product uploads, order tracking).

Post-launch roadmap for marketing, user acquisition, and site optimizations.

### Additional Notes:

Ensure that the user interface is intuitive for the target audience. While sophisticated, the website should feel accessible and easy to navigate for first-time users.

Localize payment options (COD + JazzCash/Easypaisa) and shipping for Pakistan, with the option for international shipping in the future.

Be mindful of mobile and low-bandwidth users in Pakistan; ensure that the website is optimized for 3G/4G speeds.

## Current Status (Nov 2025)

- Public catalog pages (Home, Category, Printed, Embroidery, New, Sale, PDP) now use ISR (static with background refresh) for faster loads on Vercel/Netlify CDNs. Loading skeletons added for better perceived speed.
- Push notifications, PWA manifest, and basic offline caching are implemented.
- Admin categories management improved; notifications admin added.

### Next Steps (Performance & Features)
- Monitor page timing post-ISR deployment; tighten revalidate or expand caching if needed.
- Add DB indexes (categories.slug, products(category_id, created_at), product_images(product_id, sort)) — applied.
- Integrate payments (JazzCash/Easypaisa) and shipping APIs (TCS/Leopards/BlueEx).
- Build orders/inventory management and analytics in Admin.
- Add GA4 + Facebook/Instagram Pixel and SEO structured data.
