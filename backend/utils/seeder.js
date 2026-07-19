require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/home_service_booking';
    await mongoose.connect(connString);
    console.log('Connected to DB for seeding...');

    await User.deleteMany();
    await Provider.deleteMany();
    await Admin.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Notification.deleteMany();
    console.log('Cleared existing collections.');

    const admin = await Admin.create({ username: 'admin', password: 'adminpassword123' });
    console.log('Seeded Admin account successfully.');

    const customers = await User.create([
      { name: 'Ramesh Naidu', email: 'ramesh@example.com', password: 'password123', phone: '+91 98765 43210', location: 'Visakhapatnam', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { name: 'Priya Reddy', email: 'priya@example.com', password: 'password123', phone: '+91 91234 56789', location: 'Hyderabad', profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { name: 'Ananya Lakshmi', email: 'ananya@example.com', password: 'password123', phone: '+91 88888 77777', location: 'Vijayawada', profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
      { name: 'Suresh Rao', email: 'suresh.rao@example.com', password: 'password123', phone: '+91 87654 32109', location: 'Warangal', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      { name: 'Kavitha Devi', email: 'kavitha@example.com', password: 'password123', phone: '+91 99988 77766', location: 'Guntur', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    ]);
    console.log(`Seeded ${customers.length} Customers.`);

    const providers = await Provider.create([
      { name: 'Venkat Raju', email: 'venkat@example.com', password: 'password123', phone: '+91 99887 76655', category: 'Electrician', experience: 8, chargesPerVisit: 450, workingHours: '08:00 - 17:00', location: 'Visakhapatnam', description: 'Licensed residential electrician specializing in inverter setups, smart home installations, panel upgrades, and short circuit repairs.', profilePhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'approved', averageRating: 4.8, completedJobsCount: 12 },
      { name: 'Krishna Murthy', email: 'krishna@example.com', password: 'password123', phone: '+91 98888 11111', category: 'Plumber', experience: 12, chargesPerVisit: 500, workingHours: '09:00 - 18:00', location: 'Hyderabad', description: 'Professional commercial and home plumber. Specialist in bathroom fitting, leakage corrections, pipe installations, and water motor setups.', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'approved', averageRating: 4.6, completedJobsCount: 18 },
      { name: 'Srinivas Babu', email: 'srinivas@example.com', password: 'password123', phone: '+91 87777 22222', category: 'Cleaner', experience: 5, chargesPerVisit: 750, workingHours: '08:00 - 18:00', location: 'Vijayawada', description: 'Deep house cleaning, vacuuming, and eco-friendly sanitization specialist for apartments and offices.', profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'approved', averageRating: 4.9, completedJobsCount: 25 },
      { name: 'Ravi Shankar', email: 'ravi@example.com', password: 'password123', phone: '+91 95555 33333', category: 'Gardening', experience: 6, chargesPerVisit: 350, workingHours: '07:00 - 16:00', location: 'Karimnagar', description: 'Professional lawn care, weeding, potting, landscape design, and terrace garden maintenance services.', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'approved', averageRating: 4.5, completedJobsCount: 7 },
      { name: 'Lakshmi Prasad', email: 'lakshmi@example.com', password: 'password123', phone: '+91 94444 44444', category: 'AC Repair', experience: 9, chargesPerVisit: 600, workingHours: '09:00 - 19:00', location: 'Tirupati', description: 'HVAC certified technician for split/window AC cleaning, gas charging, filter servicing, and breakdown repairs.', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'approved', averageRating: 4.7, completedJobsCount: 14 },
      { name: 'Padma Vathi', email: 'padma@example.com', password: 'password123', phone: '+91 93333 55555', category: 'Pest Control', experience: 4, chargesPerVisit: 1200, workingHours: '08:00 - 17:00', location: 'Nellore', description: 'Safe, eco-friendly pest control treatments for termites, bed bugs, cockroaches, and rodents. Child and pet-safe chemicals.', profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: false, isVerified: 'approved', averageRating: 4.4, completedJobsCount: 5 },
      { name: 'Chandra Sekhar', email: 'chandra@example.com', password: 'password123', phone: '+91 92222 66666', category: 'Painter', experience: 3, chargesPerVisit: 900, workingHours: '09:00 - 17:00', location: 'Khammam', description: 'Wall painting, color consultancies, wallpaper application, structural damp correction, and texture painting services.', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'pending' },
      { name: 'Narasimha Rao', email: 'narasimha@example.com', password: 'password123', phone: '+91 91111 77777', category: 'Carpenter', experience: 10, chargesPerVisit: 550, workingHours: '08:00 - 17:00', location: 'Kurnool', description: 'Expert woodwork, furniture repair, door/window fitting, custom cabinets, and modular furniture assembly.', profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'approved', averageRating: 4.3, completedJobsCount: 9 },
      { name: 'Vijaya Laxmi', email: 'vijaya@example.com', password: 'password123', phone: '+91 90000 88888', category: 'Electrician', experience: 6, chargesPerVisit: 400, workingHours: '09:00 - 18:00', location: 'Nizamabad', description: 'Fan installations, switchboard wiring, earthing setups, and emergency electrical repair services.', profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', governmentId: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', isAvailable: true, isVerified: 'approved', averageRating: 4.6, completedJobsCount: 11 },
    ]);
    console.log(`Seeded ${providers.length} Service Providers.`);

    const SeedTime = (dayOffset, hour) => {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      d.setHours(hour, 0, 0, 0);
      return d;
    };

    const bookings = await Booking.create([
      { customer: customers[0]._id, provider: providers[0]._id, serviceName: 'Electrician', bookingDate: SeedTime(-2, 10), bookingTime: '10:00 AM', address: 'Flat 3B, Srinivasa Residency, MVP Colony, Visakhapatnam - 530017', phone: customers[0].phone, charges: providers[0].chargesPerVisit, status: 'completed', notes: 'Replace 4 kitchen ceiling spotlights and fix wiring.' },
      { customer: customers[1]._id, provider: providers[1]._id, serviceName: 'Plumber', bookingDate: SeedTime(-1, 14), bookingTime: '02:00 PM', address: 'Plot 45, Madhapur, Cyberabad, Hyderabad - 500081', phone: customers[1].phone, charges: providers[1].chargesPerVisit, status: 'completed', notes: 'Bathroom washbasin pipe leakage and water motor issue.' },
      { customer: customers[0]._id, provider: providers[2]._id, serviceName: 'Cleaner', bookingDate: SeedTime(1, 9), bookingTime: '09:00 AM', address: '12-1-45, Dwaraka Nagar, Visakhapatnam - 530016', phone: customers[0].phone, charges: providers[2].chargesPerVisit, status: 'accepted', notes: 'Routine full house deep cleaning.' },
      { customer: customers[2]._id, provider: providers[4]._id, serviceName: 'AC Repair', bookingDate: SeedTime(2, 11), bookingTime: '11:00 AM', address: '44-5-12, Benz Circle, Vijayawada - 520008', phone: customers[2].phone, charges: providers[4].chargesPerVisit, status: 'pending', notes: 'AC filter cleaning and gas top-up required.' },
      { customer: customers[3]._id, provider: providers[3]._id, serviceName: 'Gardening', bookingDate: SeedTime(-3, 8), bookingTime: '08:00 AM', address: 'H No 5-1-100, Hanamkonda, Warangal - 506001', phone: customers[3].phone, charges: providers[3].chargesPerVisit, status: 'completed', notes: 'Monthly lawn trimming and garden maintenance.' },
      { customer: customers[4]._id, provider: providers[5]._id, serviceName: 'Pest Control', bookingDate: SeedTime(3, 10), bookingTime: '10:00 AM', address: '2nd Lane, Brodipet, Guntur - 522002', phone: customers[4].phone, charges: providers[5].chargesPerVisit, status: 'pending', notes: 'Termite treatment for entire apartment.' },
    ]);
    console.log(`Seeded ${bookings.length} Bookings.`);

    await Review.create([
      { booking: bookings[0]._id, customer: customers[0]._id, provider: providers[0]._id, rating: 5, comment: 'Venkat did an excellent job. Fast, professional, and properly wired all the spotlights.' },
      { booking: bookings[1]._id, customer: customers[1]._id, provider: providers[1]._id, rating: 4, comment: 'Krishna resolved the bathroom leakage quickly. Good and polite work.' },
      { booking: bookings[4]._id, customer: customers[3]._id, provider: providers[3]._id, rating: 5, comment: 'Ravi Shankar did a wonderful job maintaining our garden. Very thorough!' },
    ]);
    console.log('Seeded Reviews.');

    await Notification.create([
      { recipient: providers[0]._id, recipientModel: 'Provider', title: 'Welcome to ServNexa!', message: 'Welcome Venkat! Your profile is verified and live. Toggle availability to receive customer bookings.' },
      { recipient: customers[0]._id, recipientModel: 'User', title: 'Booking Confirmed', message: 'Your cleaning request with Srinivas Babu has been accepted for tomorrow at 09:00 AM in Visakhapatnam.' },
      { recipient: providers[6]._id, recipientModel: 'Provider', title: 'Profile Under Review', message: 'Your registration is pending admin verification. You will be notified once approved.' },
    ]);
    console.log('Seeded Notifications.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeder Error:', error);
    process.exit(1);
  }
};

seedData();
