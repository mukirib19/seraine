-- Run this in Supabase SQL Editor to seed products with local image paths
-- (Images stored in /public/assets/products/ and served from your domain)

INSERT INTO products (name, sku, description, price, category, images, in_stock) VALUES

('Custom Vinyl Banner – Large Format',
 'SC-LF001',
 'High-quality vinyl banners printed in full colour. Perfect for events, storefronts, and exhibitions. Available in any custom size.',
 3500, 'Large Format',
 ARRAY['/assets/products/banner.jpg'],
 true),

('Branded A5 Notebook',
 'SC-NB001',
 'Premium soft-cover notebooks with custom branding. 100 pages, lined. Perfect for corporate gifts and events.',
 850, 'Notebooks',
 ARRAY['/assets/products/notebook.jpg'],
 true),

('Wedding Invitation Suite',
 'SC-EP001',
 'Elegant wedding invitation sets including the main card, RSVP card, and envelope. Custom design available.',
 4500, 'Event Planning',
 ARRAY['/assets/products/wedding.jpg'],
 true),

('Custom Printed T-Shirt',
 'SC-TS001',
 'Premium quality t-shirts with your design printed using DTF technology. Vivid colours that last wash after wash.',
 1200, 'T-Shirt Printing',
 ARRAY['/assets/products/tshirt.jpg'],
 true),

('Sublimation Branded Mug',
 'SC-MB001',
 'Full-wrap sublimation printed ceramic mugs. Dishwasher safe. Minimum order 10 pieces for bulk pricing.',
 650, 'Mug Branding',
 ARRAY['/assets/products/mug.jpg'],
 true),

('Premium Flower Bouquet',
 'SC-BQ001',
 'Beautifully arranged fresh flower bouquets for birthdays, anniversaries, and special occasions.',
 2500, 'Bouquets',
 ARRAY['/assets/products/bouquet.jpg'],
 true),

('Event Backdrop & Decor Setup',
 'SC-ED001',
 'Full event decor setup including custom printed backdrop, table runners, and balloon arrangements.',
 15000, 'Event Decor',
 ARRAY['/assets/products/decor.jpg'],
 true)

ON CONFLICT (sku) DO UPDATE SET
  images = EXCLUDED.images,
  price = EXCLUDED.price,
  description = EXCLUDED.description;

-- Banners (using local images too)
INSERT INTO banners (title, image_url, link, start_date, end_date, active) VALUES

('Father''s Day Special — 20% Off Custom Mugs',
 '/assets/products/mug.jpg',
 '/catalog?category=Mug Branding',
 '2025-06-08', '2025-06-16', true),

('Christmas Gifting Collection',
 '/assets/products/decor.jpg',
 '/catalog', '2025-12-01', '2025-12-26', true),

('Valentine''s Day — Gifts That Say It All',
 '/assets/products/bouquet.jpg',
 '/catalog?category=Bouquets',
 '2025-02-07', '2025-02-15', true)

ON CONFLICT DO NOTHING;
