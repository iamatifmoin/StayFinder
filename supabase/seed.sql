
-- Insert sample profiles (these would normally be created when users sign up via Clerk)
INSERT INTO profiles (clerk_user_id, email, full_name, phone, is_host) VALUES
('user_sample_host_1', 'rajesh.sharma@email.com', 'Rajesh Sharma', '+91-9876543210', true),
('user_sample_host_2', 'priya.patel@email.com', 'Priya Patel', '+91-9876543211', true),
('user_sample_host_3', 'amit.kumar@email.com', 'Amit Kumar', '+91-9876543212', true),
('user_sample_guest_1', 'guest1@email.com', 'Guest User', '+91-9876543213', false);

-- Insert sample listings
INSERT INTO listings (host_id, title, description, type, price_per_night, guests, bedrooms, bathrooms, address, city, state, country, latitude, longitude, amenities, images) VALUES
(
  (SELECT id FROM profiles WHERE email = 'rajesh.sharma@email.com'),
  'Luxury Villa in Goa with Pool',
  'Beautiful 3-bedroom vila with private pool, just 5 minutes from Baga Beach. Perfect for families and groups looking for a luxurious stay in North Goa.',
  'villa',
  8500,
  8,
  3,
  3,
  'Villa Paradise, Saunta Vaddo',
  'Goa',
  'Goa',
  'India',
  15.5527,
  73.7545,
  ARRAY['WiFi', 'Pool', 'Kitchen', 'Parking', 'AC', 'TV', 'Beach Access'],
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800']
),
(
  (SELECT id FROM profiles WHERE email = 'priya.patel@email.com'),
  'Cozy Studio in Mumbai Bandra',
  'Modern studio apartment in the heart of Bandra, close to cafes, restaurants, and shopping. Perfect for business travelers and couples.',
  'studio',
  3200,
  2,
  1,
  1,
  'Linking Road, Bandra West',
  'Mumbai',
  'Maharashtra',
  'India',
  19.0544,
  72.8347,
  ARRAY['WiFi', 'Kitchen', 'AC', 'TV', 'Gym Access'],
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800']
),
(
  (SELECT id FROM profiles WHERE email = 'amit.kumar@email.com'),
  'Heritage Haveli in Jaipur',
  'Experience royal Rajasthani hospitality in this beautifully restored haveli. Features traditional architecture with modern amenities.',
  'house',
  6500,
  6,
  3,
  2,
  'Pink City, Near Hawa Mahal',
  'Jaipur',
  'Rajasthan',
  'India',
  26.9244,
  75.8267,
  ARRAY['WiFi', 'Kitchen', 'AC', 'TV', 'Parking', 'Cultural Tours'],
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800']
),
(
  (SELECT id FROM profiles WHERE email = 'rajesh.sharma@email.com'),
  'Modern Apartment in Bangalore',
  'Fully furnished 2BHK apartment in Koramangala with all amenities. Great for tech professionals and families visiting Bangalore.',
  'apartment',
  4200,
  4,
  2,
  2,
  'Koramangala 4th Block',
  'Bangalore',
  'Karnataka',
  'India',
  12.9352,
  77.6245,
  ARRAY['WiFi', 'Kitchen', 'AC', 'TV', 'Parking', 'Gym Access', 'Security'],
  ARRAY['https://images.unsplash.com/photo-1515263487990-61b07816b64f?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800']
),
(
  (SELECT id FROM profiles WHERE email = 'priya.patel@email.com'),
  'Houseboat in Kerala Backwaters',
  'Unique experience staying on a traditional Kerala houseboat. Includes meals and guided backwater tours.',
  'house',
  7500,
  4,
  2,
  1,
  'Vembanad Lake, Kumrakom',
  'Kottayam',
  'Kerala',
  'India',
  9.6177,
  76.4384,
  ARRAY['Meals Included', 'Boat Tours', 'WiFi', 'AC', 'Traditional Experience'],
  ARRAY['https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800']
),
(
  (SELECT id FROM profiles WHERE email = 'amit.kumar@email.com'),
  'Hill Station Cottage in Manali',
  'Cozy wooden cottage with mountain views. Perfect for couples and small families seeking a peaceful retreat.',
  'house',
  5200,
  4,
  2,
  1,
  'Old Manali Road',
  'Manali',
  'Himachal Pradesh',
  'India',
  32.2396,
  77.1887,
  ARRAY['Mountain View', 'Fireplace', 'Kitchen', 'Parking', 'Trekking Guide'],
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800']
);

-- Insert sample bookings
INSERT INTO bookings (listing_id, guest_id, check_in, check_out, guests, total_price, status) VALUES
(
  (SELECT id FROM listings WHERE title = 'Luxury Villa in Goa with Pool'),
  (SELECT id FROM profiles WHERE email = 'guest1@email.com'),
  '2024-07-15',
  '2024-07-18',
  6,
  25500,
  'confirmed'
);

-- Insert sample reviews
INSERT INTO reviews (booking_id, reviewer_id, listing_id, rating, comment) VALUES
(
  (SELECT id FROM bookings LIMIT 1),
  (SELECT id FROM profiles WHERE email = 'guest1@email.com'),
  (SELECT id FROM listings WHERE title = 'Luxury Villa in Goa with Pool'),
  5,
  'Amazing villa with excellent amenities! The pool was fantastic and the location was perfect for exploring Goa beaches.'
);
