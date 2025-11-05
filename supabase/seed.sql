-- Seed data for HubDash - HTI Dashboard

-- Insert partners first (referenced by devices)
INSERT INTO partners (name, type, contact_email, address, county, devices_received) VALUES
  ('Vance County Schools', 'school', 'contact@vanceschools.org', '123 Education Dr, Henderson, NC', 'Vance', 245),
  ('Warren County Library', 'library', 'info@warrenlibrary.org', '456 Library St, Warrenton, NC', 'Warren', 198),
  ('Halifax County Nonprofit Center', 'nonprofit', 'help@halifaxnp.org', '789 Community Blvd, Halifax, NC', 'Halifax', 312),
  ('Northampton Veterans Services', 'veteran_org', 'veterans@northampton.gov', '321 Veterans Way, Jackson, NC', 'Northampton', 156),
  ('Hertford County Adult Ed', 'school', 'adulted@hertford.org', '654 Learning Ln, Winton, NC', 'Hertford', 134);

-- Insert sample devices
INSERT INTO devices (serial_number, model, manufacturer, status, location, assigned_to, received_date) VALUES
  ('HTI-2024-1523', 'ThinkPad X1 Carbon', 'Lenovo', 'ready', 'Henderson Warehouse', 'Vance County Schools', NOW() - INTERVAL '3 days'),
  ('HTI-2024-1524', 'Latitude 7420', 'Dell', 'qa_testing', 'Henderson Warehouse', NULL, NOW() - INTERVAL '2 days'),
  ('HTI-2024-1525', 'EliteBook 840', 'HP', 'refurbishing', 'Henderson Warehouse', NULL, NOW() - INTERVAL '6 days'),
  ('HTI-2024-1526', 'MacBook Pro 2019', 'Apple', 'data_wipe', 'Henderson Warehouse', NULL, NOW() - INTERVAL '1 day'),
  ('HTI-2024-1527', 'ThinkPad T480', 'Lenovo', 'ready', 'Henderson Warehouse', 'Warren County Library', NOW() - INTERVAL '5 days'),
  ('HTI-2024-1528', 'Latitude 5410', 'Dell', 'refurbishing', 'Henderson Warehouse', NULL, NOW() - INTERVAL '4 days'),
  ('HTI-2024-1529', 'ProBook 450', 'HP', 'received', 'Henderson Warehouse', NULL, NOW() - INTERVAL '1 day'),
  ('HTI-2024-1530', 'ThinkPad L14', 'Lenovo', 'qa_testing', 'Henderson Warehouse', NULL, NOW() - INTERVAL '2 days');

-- Insert sample donations
INSERT INTO donations (company, contact_name, contact_email, device_count, location, priority, status, requested_date) VALUES
  ('Tech Solutions Inc', 'Sarah Johnson', 'sjohnson@techsolutions.com', 75, 'Henderson, NC', 'urgent', 'pending', NOW()),
  ('County Public Schools', 'Mike Williams', 'mwilliams@countyschools.edu', 120, 'Vance County, NC', 'high', 'scheduled', NOW() - INTERVAL '1 day'),
  ('Local Law Firm', 'Jennifer Davis', 'jdavis@lawfirm.com', 18, 'Raleigh, NC', 'normal', 'pending', NOW() - INTERVAL '2 days'),
  ('Manufacturing Plant', 'Robert Smith', 'rsmith@manufacturing.com', 45, 'Warren County, NC', 'high', 'pending', NOW() - INTERVAL '3 days');

-- Insert sample training sessions
INSERT INTO training_sessions (title, date, location, instructor, attendee_count) VALUES
  ('Basic Computer Skills', NOW() + INTERVAL '3 days', 'Henderson Community Center', 'Alex Martinez', 22),
  ('Digital Literacy for Seniors', NOW() + INTERVAL '7 days', 'Vance County Library', 'Sarah Chen', 15),
  ('Job Search Online', NOW() + INTERVAL '10 days', 'Warren County Workforce Center', 'Mike Johnson', 18);

-- Insert sample activity log
INSERT INTO activity_log (user_name, action, target, type, icon) VALUES
  ('Alex M.', 'completed QA testing for', 'Batch #127 (15 devices)', 'success', '✅'),
  ('Sarah J.', 'scheduled pickup for', 'Tech Solutions Inc (75 devices)', 'info', '📅'),
  ('Mike W.', 'flagged issue with', 'Device #4521 (failed boot)', 'warning', '⚠️'),
  ('System', 'generated Certificate of Destruction for', 'Batch #125', 'success', '📜'),
  ('Jennifer D.', 'distributed', '12 Chromebooks to Warren County Library', 'success', '🎯'),
  ('Robert S.', 'started data wipe on', 'Batch #128 (22 devices)', 'info', '🔒');
