-- -------- INSERT TEST USERS --------
INSERT INTO users (name, email, password, address, role) VALUES
('John Smith Admin User Test', 'admin@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '123 Admin Street, City', 'admin'),
('Jane Doe Normal User Test', 'user@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '456 User Avenue, City', 'user'),
('Mike Store Owner Test Name', 'owner@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '789 Owner Plaza, City', 'owner'),
('Deep Admin Test Account Name', 'deepadmin@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '999 Deep Admin Road, City', 'admin'),
('Aarav Sharma Regular User', 'aarav.user@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '21 Green Park Road, Delhi', 'user'),
('Priya Mehta Regular User', 'priya.user@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '44 Lake View Colony, Pune', 'user'),
('Rahul Verma Regular User', 'rahul.user@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '19 MG Road, Bengaluru', 'user'),
('Sneha Kapoor Regular User', 'sneha.user@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '88 Riverfront Avenue, Ahmedabad', 'user'),
('Neha Store Owner Profile', 'neha.owner@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '52 Market Street, Mumbai', 'owner'),
('Vikram Store Owner Account', 'vikram.owner@test.com', '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e', '16 Central Plaza, Hyderabad', 'owner');

-- -------- INSERT TEST STORES --------
INSERT INTO stores (name, email, address, owner_id) VALUES
('Best Pizza Place Name Test', 'pizza@store.com', '100 Food Street, Downtown', 3),
('Amazing Coffee Shop Store', 'coffee@store.com', '200 Brew Avenue, Midtown', 3),
('Great Burger Restaurant Test', 'burger@store.com', '300 Meat Lane, Uptown', 3),
('Wonderful Sushi Restaurant Name', 'sushi@store.com', '400 Fish Court, Harbor', 3),
('Excellent Indian Cuisine Place', 'indian@store.com', '500 Spice Road, Downtown', 3),
('Urban Fresh Grocery Market', 'urbanfresh@store.com', '12 Orchard Lane, Pune', 9),
('Blue Bottle Book Store', 'books@store.com', '33 College Street, Kolkata', 9),
('Prime Fitness Gear Outlet', 'fitness@store.com', '75 Sports Complex Road, Bengaluru', 9),
('Silver Spoon Bakery House', 'bakery@store.com', '24 Sunrise Avenue, Chennai', 9),
('Tech Nest Electronics Hub', 'electronics@store.com', '91 Digital Park, Hyderabad', 9),
('Green Leaf Organic Cafe', 'greenleaf@store.com', '18 Garden Square, Mumbai', 10),
('Happy Tails Pet Supplies', 'pets@store.com', '63 Paw Street, Delhi', 10),
('Classic Threads Fashion Store', 'fashion@store.com', '47 Style Boulevard, Jaipur', 10),
('Daily Dose Pharmacy Store', 'pharmacy@store.com', '29 Health Circle, Lucknow', 10),
('Home Craft Furniture Studio', 'furniture@store.com', '102 Woodworks Road, Kochi', 10);

-- -------- INSERT TEST RATINGS --------
INSERT INTO ratings (user_id, store_id, rating) VALUES
(2, 1, 5),
(2, 2, 4),
(2, 3, 3),
(2, 4, 5),
(2, 5, 4),
(5, 1, 4),
(5, 6, 5),
(5, 7, 4),
(5, 8, 3),
(5, 11, 5),
(6, 2, 5),
(6, 6, 4),
(6, 9, 5),
(6, 12, 4),
(6, 14, 3),
(7, 3, 4),
(7, 7, 5),
(7, 10, 4),
(7, 13, 5),
(7, 15, 4),
(8, 4, 4),
(8, 5, 5),
(8, 8, 4),
(8, 11, 3),
(8, 15, 5);
