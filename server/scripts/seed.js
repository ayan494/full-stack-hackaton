const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Request = require('../models/Request');

dotenv.config();

const seedUsers = [
  { name: "Ayesha Khan", email: "ayesha@helphub.ai", password: "password", location: "Karachi", skills: ["Figma", "UI/UX", "HTML/CSS"], initials: "AK", color: "from-amber-400 to-rose-400", trustScore: 100, contributions: 35 },
  { name: "Hassan Ali", email: "hassan@helphub.ai", password: "password", location: "Lahore", skills: ["JavaScript", "React", "Node.js"], initials: "HA", color: "from-slate-700 to-slate-900", trustScore: 88, contributions: 24 },
  { name: "Sara Noor", email: "sara@helphub.ai", password: "password", location: "Karachi", skills: ["Python", "Data Analysis"], initials: "SN", color: "from-orange-400 to-red-500", trustScore: 74, contributions: 11 },
  { name: "Bilal Tariq", email: "bilal@helphub.ai", password: "password", location: "Islamabad", skills: ["Product Management", "Writing"], initials: "BT", color: "from-emerald-500 to-teal-600", trustScore: 62, contributions: 6 },
];

const seedRequests = (userIds) => [
  { title: "Need help making my portfolio responsive", description: "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.", category: "Web Development", urgency: "High", tags: ["HTML/CSS", "Responsive", "Portfolio"], createdBy: userIds[2] },
  { title: "Looking for Figma feedback on a volunteer event poster", description: "I have a draft poster for a campus community event and want sharper hierarchy and spacing.", category: "Design", urgency: "Medium", tags: ["Figma", "Design Review"], createdBy: userIds[0] },
  { title: "Need mock interview support for internship applications", description: "Applying to frontend internships and need someone to practice behavioral questions with me.", category: "Career", urgency: "Low", tags: ["Interview Prep", "Career"], createdBy: userIds[2] },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany({});
    await Request.deleteMany({});

    // Hash passwords and create users
    const hashedUsers = await Promise.all(seedUsers.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10)
    })));
    
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Seeded ${createdUsers.length} users`);

    const userIds = createdUsers.map(u => u._id);
    const requests = await Request.insertMany(seedRequests(userIds));
    console.log(`Seeded ${requests.length} requests`);

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
