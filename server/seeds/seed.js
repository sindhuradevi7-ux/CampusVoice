import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import ComplaintAccess from '../models/ComplaintAccess.js';
import IssueCluster from '../models/IssueCluster.js';
import IssueSupport from '../models/IssueSupport.js';
import Message from '../models/Message.js';
import { generateComplaintId, generateIssueId } from '../utils/idGenerator.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    let primaryUri = process.env.MONGODB_URI;
    const VERIFIED_ATLAS_URI =
      'mongodb+srv://sindhuradevi7_db_user:CvbYI6yaEMe8B6xK@cluster0.4wyjjlw.mongodb.net/campusvoice?retryWrites=true&w=majority&appName=Cluster0';

    if (!primaryUri || primaryUri.includes('@cluster0.mongodb.net')) {
      primaryUri = VERIFIED_ATLAS_URI;
    }

    const fallbackUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/campusvoice';
    let mongoUri = primaryUri;
    console.log(`Connecting to database: ${mongoUri}`);
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    } catch (err) {
      if (fallbackUri && mongoUri !== fallbackUri) {
        console.warn(`Primary connection failed (${err.message}). Trying fallback: ${fallbackUri}`);
        mongoUri = fallbackUri;
        await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 4000 });
      } else {
        throw err;
      }
    }

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Complaint.deleteMany({}),
      ComplaintAccess.deleteMany({}),
      IssueCluster.deleteMany({}),
      IssueSupport.deleteMany({}),
      Message.deleteMany({}),
    ]);

    console.log('👤 Creating users with hashed passwords...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const studentPasswordHash = await bcrypt.hash('Student@123', salt);

    const admin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@campus.edu',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isVerified: true,
    });

    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'student1@campus.edu',
      studentId: 'STU-202401',
      passwordHash: studentPasswordHash,
      role: 'student',
      isVerified: true,
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'student2@campus.edu',
      studentId: 'STU-202402',
      passwordHash: studentPasswordHash,
      role: 'student',
      isVerified: true,
    });

    const student3 = await User.create({
      name: 'Rahul Verma',
      email: 'student3@campus.edu',
      studentId: 'STU-202403',
      passwordHash: studentPasswordHash,
      role: 'student',
      isVerified: true,
    });

    const student4 = await User.create({
      name: 'Sara Khan',
      email: 'student4@student.edu',
      studentId: 'STU-202404',
      passwordHash: studentPasswordHash,
      role: 'student',
      isVerified: true,
    });

    console.log('🏢 Creating Issue Clusters...');

    // Cluster 1: Wi-Fi Lab 3
    const cluster1 = await IssueCluster.create({
      publicIssueId: 'CV-ISSUE-104',
      title: 'Lab 3 Wi-Fi Frequent Disconnection and Latency',
      summary: 'Internet connectivity frequently drops in Computer Lab 3 during project hours, affecting CS practicals.',
      category: 'Wi-Fi / Internet',
      location: 'Lab 3, CS Block',
      severity: 'High',
      affectedCount: 18,
      status: 'In Progress',
      assignedDepartment: 'IT & Networking Department',
      keywords: ['wifi', 'lab 3', 'connectivity', 'latency', 'cs block'],
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Initial report submitted by verified student.',
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Under Review',
          note: 'Network engineering team dispatched to inspect access points.',
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'In Progress',
          note: 'Re-cabling switch and upgrading 5GHz access point firmware.',
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Cluster 2: Hostel B Geyser
    const cluster2 = await IssueCluster.create({
      publicIssueId: 'CV-ISSUE-108',
      title: 'Hostel Block B 2nd Floor Water Geyser Malfunction',
      summary: 'Water geysers on the 2nd floor west wing of Hostel B are tripping the electrical circuit breakers.',
      category: 'Hostel',
      location: 'Hostel Block B, 2nd Floor',
      severity: 'High',
      affectedCount: 14,
      status: 'Assigned',
      assignedDepartment: 'Hostel Affairs & Electrical Maintenance',
      keywords: ['hostel', 'geyser', 'hot water', 'circuit breaker', 'electrical'],
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Anonymous complaint filed regarding morning hot water outage.',
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Assigned',
          note: 'Assigned to Electrical maintenance contractor.',
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Cluster 3: Canteen Hygiene
    const cluster3 = await IssueCluster.create({
      publicIssueId: 'CV-ISSUE-112',
      title: 'Central Canteen Food Serving Hygiene and Counter Cleanliness',
      summary: 'Serving staff not consistently wearing hairnets and hand gloves at the hot food counter.',
      category: 'Food / Canteen',
      location: 'Central Canteen, Ground Floor',
      severity: 'Medium',
      affectedCount: 26,
      status: 'Under Review',
      assignedDepartment: 'Canteen & Hospitality Committee',
      keywords: ['canteen', 'hygiene', 'gloves', 'food quality', 'cleanliness'],
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Reported by students dining during lunch rush.',
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Under Review',
          note: 'Student welfare representative scheduled surprise inspection.',
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Cluster 4: Library AC (Resolved)
    const cluster4 = await IssueCluster.create({
      publicIssueId: 'CV-ISSUE-115',
      title: 'Library 2nd Floor Study Hall AC Unit Breakdown',
      summary: 'Main central air conditioning unit on second floor study area leaking water and blowing warm air.',
      category: 'Library',
      location: 'Central Library, 2nd Floor Study Hall',
      severity: 'Medium',
      affectedCount: 9,
      status: 'Resolved',
      assignedDepartment: 'Estate & HVAC Maintenance',
      keywords: ['library', 'ac', 'cooling', 'leak', 'study hall'],
      resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Report submitted by anonymous student.',
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'In Progress',
          note: 'HVAC technician replaced the drain pipe and recharged refrigerant.',
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Resolved',
          note: 'AC fully repaired and tested. Ambient temperature normalized to 22°C.',
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
      ],
    });

    // Cluster 5: Transport Shuttle
    const cluster5 = await IssueCluster.create({
      publicIssueId: 'CV-ISSUE-120',
      title: 'Evening Campus Shuttle Bus Timing Inconsistency (Metro Route)',
      summary: 'The 6:30 PM and 7:00 PM shuttle buses to Metro station are frequently delayed by 30-40 minutes without prior notice.',
      category: 'Transport',
      location: 'Main Gate Bus Bay',
      severity: 'Medium',
      affectedCount: 31,
      status: 'In Progress',
      assignedDepartment: 'Campus Transport Division',
      keywords: ['bus', 'shuttle', 'metro', 'timing', 'delay'],
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Report filed regarding regular transport delay.',
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'In Progress',
          note: 'GPS tracking enabled and extra driver assigned during peak evening rush.',
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    console.log('📝 Creating Anonymous Student Complaints...');

    // Complaint 1 (Student 1 -> Cluster 1)
    const comp1 = await Complaint.create({
      publicComplaintId: 'CV-A82F91',
      category: 'Wi-Fi / Internet',
      description: 'The Wi-Fi in Lab 3 keeps dropping every 5-10 minutes. It makes it impossible to pull docker images and finish our lab assessments on time.',
      location: 'Lab 3, CS Block',
      affectedArea: 'Workstations 15 to 30',
      severity: 'High',
      status: 'In Progress',
      issueClusterId: cluster1._id,
      contactPreference: 'Anonymous In-App Thread',
      aiAnalysis: {
        category: 'Wi-Fi / Internet',
        severity: 'High',
        summary: 'Frequent Wi-Fi disconnections in Lab 3 causing failure during lab assessments.',
        keywords: ['wifi', 'lab 3', 'disconnections', 'docker'],
        possibleDepartment: 'IT & Networking Department',
      },
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Verified anonymous complaint registered.',
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'In Progress',
          note: 'IT staff is replacing the access point switches.',
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });
    await ComplaintAccess.create({ complaintId: comp1._id, userId: student1._id });

    // Complaint 2 (Student 2 -> Cluster 1)
    const comp2 = await Complaint.create({
      publicComplaintId: 'CV-B44C19',
      category: 'Wi-Fi / Internet',
      description: 'Internet is not working in the third laboratory. Connection times out frequently.',
      location: 'Computer Lab 3',
      affectedArea: 'Back row',
      severity: 'High',
      status: 'In Progress',
      issueClusterId: cluster1._id,
      contactPreference: 'Anonymous In-App Thread',
      aiAnalysis: {
        category: 'Wi-Fi / Internet',
        severity: 'High',
        summary: 'Internet connectivity timeout in Lab 3 back row.',
        keywords: ['internet', 'lab 3', 'timeout'],
        possibleDepartment: 'IT & Networking Department',
      },
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Complaint submitted anonymously and clustered into CV-ISSUE-104.',
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
    });
    await ComplaintAccess.create({ complaintId: comp2._id, userId: student2._id });

    // Complaint 3 (Student 1 -> Cluster 2)
    const comp3 = await Complaint.create({
      publicComplaintId: 'CV-H71D92',
      category: 'Hostel',
      description: 'Hostel B second floor bathroom geyser is giving sparks and tripping electricity whenever switched on.',
      location: 'Hostel Block B, 2nd Floor',
      affectedArea: 'Washroom 4',
      severity: 'High',
      status: 'Assigned',
      issueClusterId: cluster2._id,
      contactPreference: 'Anonymous In-App Thread',
      aiAnalysis: {
        category: 'Hostel',
        severity: 'High',
        summary: 'Electrical spark and tripping in Hostel B 2nd floor geyser.',
        keywords: ['hostel', 'geyser', 'sparks', 'electrical'],
        possibleDepartment: 'Hostel Affairs & Electrical Maintenance',
      },
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Complaint recorded.',
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          status: 'Assigned',
          note: 'Assigned to electricians.',
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
    });
    await ComplaintAccess.create({ complaintId: comp3._id, userId: student1._id });

    console.log('💬 Creating Anonymous Communication Threads...');

    // Messages on Complaint 1
    await Message.create({
      complaintId: comp1._id,
      senderType: 'student',
      message: 'Hello, the internet issue is most severe between 1:30 PM and 4:30 PM when practical batches coincide.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    await Message.create({
      complaintId: comp1._id,
      senderType: 'admin',
      message: 'Thank you for the specific timeframe. Our network engineers have installed a temporary booster and will finalize the switch replacement tonight.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    await Message.create({
      complaintId: comp1._id,
      senderType: 'student',
      message: 'Noticed the speed improved slightly today. Thank you for the quick response!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    console.log('👍 Recording anonymous issue supports...');
    await IssueSupport.create({ issueClusterId: cluster1._id, userId: student1._id });
    await IssueSupport.create({ issueClusterId: cluster1._id, userId: student2._id });
    await IssueSupport.create({ issueClusterId: cluster1._id, userId: student3._id });
    await IssueSupport.create({ issueClusterId: cluster2._id, userId: student1._id });
    await IssueSupport.create({ issueClusterId: cluster3._id, userId: student1._id });
    await IssueSupport.create({ issueClusterId: cluster5._id, userId: student4._id });

    console.log('✅ Database seeded successfully!');
    console.log('\n--- DEMO CREDENTIALS ---');
    console.log('Student Login: student1@campus.edu  | Password: Student@123');
    console.log('Admin Login:   admin@campus.edu     | Password: Admin@123');
    console.log('------------------------\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
