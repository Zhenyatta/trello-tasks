import fs from 'fs';
import express from 'express';
import path from 'path';
import cors from 'cors';
import bcrypt  from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

import { VISIT_COUNTER_FILE_PATH } from './constants.js';
import { FE_BUILD_PATH, JWT_ACCESS_SECRET, OPENAI_API_KEY, EMAIL_USER, EMAIL_PASS, HUGGINGFACE_API_URL, HUGGINGFACE_API_KEY } from './env.js';

const prisma = new PrismaClient();

const app = express();

try {
  if (fs.existsSync(VISIT_COUNTER_FILE_PATH)) {
    counters = JSON.parse(fs.readFileSync(VISIT_COUNTER_FILE_PATH, 'utf8'));
  }
} catch (e) {
  console.log(e);
}

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(FE_BUILD_PATH)));

app.use(cookieParser());

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Schedule job to run every morning at 8 AM
schedule.scheduleJob("0 8 * * *", async () => {
  console.log("Checking for due notifications...");

  // Get today's date (without time) in UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Fetch notifications due today
  const dueNotifications = await prisma.notification.findMany({
    where: {
      notify_at: {
        gte: today, // Greater than or equal to today's date
        lt: new Date(today.getTime() + 86400000), // Less than tomorrow's date
      },
    },
    include: { item: true },
  });

  for (const notification of dueNotifications) {
    await sendNotificationEmail(notification);

    // Reschedule the notification based on repeat_type
    await rescheduleNotification(notification);
  }
});

// Function to Send Email
async function sendNotificationEmail(notification) {
  try {
    const formattedDate = new Date(notification.notify_at).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const statusBadge = notification.is_completed
      ? `<span style="color: green; font-weight: bold;">✔ Completed</span>`
      : `<span style="color: red; font-weight: bold;">❌ Not Completed</span>`;

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h1 style="color: rgb(25, 118, 210); margin-bottom: 10px; font-weight: bold;">TechCheck</h1>
        <h2 style="color: #2c3e50;">🔔 Reminder: ${notification.notification_name}</h2>

        <p style="font-size: 16px; color: #555;">
          ${notification.description}
        </p>

        <p style="font-size: 16px; color: #555;">
          ✨ Hint: ${notification.video}
        </p>

        <p style="font-size: 14px; margin-top: 10px;">
          <strong>📅 Due Date:</strong> ${formattedDate}
        </p>

        <p style="font-size: 14px; margin-top: 5px;">
          <strong>Status:</strong> ${statusBadge}
        </p>

        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />

        <p style="font-size: 12px; color: #999;">
          This is an automated reminder. Please do not reply to this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: EMAIL_USER,
      to: notification.notify_who,
      subject: `Reminder: ${notification.notification_name} ✨`,
      text: `Reminder: ${notification.notification_name} ⚠️ \n\n${notification.description}`,
      html: htmlTemplate,
    });

    console.log(`Notification email sent for ${notification.notification_name}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// sendNotificationEmail({notify_who: "jenya.paniryan8@gmail.com",notification_name: "Check Charger Plug", description: "Go to the Item location and check the charger plug", is_completed: false, notify_at: "08.05.2025", video: "https://www.youtube.com/watch?v=fN25fMQZ2v0&ab_channel=UlbiTV" })

// Function to Reschedule Notifications Based on repeat_type
async function rescheduleNotification(notification) {
  let nextNotifyAt = new Date(notification.notify_at);

  switch (notification.repeat_type) {
    case "daily":
      nextNotifyAt.setDate(nextNotifyAt.getDate() + 1);
      break;

    case "monthly":
      nextNotifyAt.setMonth(nextNotifyAt.getMonth() + 1);
      break;

    case "weekly":
      nextNotifyAt.setDate(nextNotifyAt.getDate() + 7);
      break;

    case "yearly":
      nextNotifyAt.setFullYear(nextNotifyAt.getFullYear() + 1);
      break;

    case "singular":
      // No rescheduling for singular notifications
      console.log(`Notification '${notification.notification_name}' is singular and will not repeat.`);
      return;
  }

  await prisma.notification.update({
    where: { notification_id: notification.notification_id },
    data: { notify_at: nextNotifyAt },
  });

  console.log(`Rescheduled '${notification.notification_name}' for ${nextNotifyAt}`);
}

app.post('/api/v1/register', async (req, res) => {
  const { name, lastname, email, phoneNumber, password } = req.body;

  try {
    // Validate input
    if (!name || !lastname || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        phoneNumber,
        password: hashedPassword,
      },
    });

    res.status(201).json({ code: 200, message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }

})

app.post('/api/v1/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Save user info in the session
    const accessToken = jwt.sign({ email, password }, JWT_ACCESS_SECRET, {expiresIn:'30d'});

    res.cookie('techCheck_anonym', accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: false, // Ensures the cookie is sent only over HTTPS in production
      sameSite: 'strict', // Prevents CSRF by restricting cross-site cookie access
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.status(200).json({ code: 200, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
});

app.post('/api/v1/logout', async (req, res) => {
  try {
    res.clearCookie('techCheck_anonym', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to logout.' });
  }
});

app.get('/api/v1/user', async (req, res) => {
  if(!req.cookies.techCheck_anonym) {
    return res.status(401).json({code:401, message: 'Unauthorized. No session ID found.' });
  }
  const userData = jwt.verify(req.cookies.techCheck_anonym, JWT_ACCESS_SECRET);
  
  if (!userData) {
    return res.status(401).json({code:401, message: 'Unauthorized. No session ID found.' });
  }

  // const session = await sessionStore.get(userData); // Replace with your session lookup logic
  const user = await prisma.user.findUnique({ where: { email: userData.email } })
  if (!user) {
    return res.status(401).json({code:401, message: 'Unauthorized. Session not found.' });
  }

  res.json({ code: 200, message: 'User identified', user: user });
});

app.patch('/api/v1/user', async (req, res) => {
  try {
    const { id, ...dataToUpdate } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/v1/company', async (req, res) => {
  try {
    const {tin, name, userId} = req.body;

    if (!tin || !name || !userId) {
      return res.status(400).json({ message: 'invalid properties' });
    }
  
    const exisitngCompany = await prisma.Company.findFirst({
      where: {
        tin: tin,
      },
    });
  
    if (exisitngCompany) {
      return res.status(400).json({ message: 'Company already exists.' });
    }
  
    const newCompany = await prisma.$transaction(async (prisma) => {
      // Create the new company
      const company = await prisma.company.create({
        data: {
          name,
          tin,
        },
      });

      // Create the User-Company relationship
      await prisma.userCompany.create({
        data: {
          user_id: userId,
          company_id: company.company_id,
          role: 'admin', // Default role for the creator
        },
      });

      return company;
    });
  
    res.status(201).json({ message: 'Company registered successfully', company: newCompany });
  } catch(err) {
    console.error('Error creating company:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/api/v1/company/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const userCompanies = await prisma.userCompany.findMany({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        company: true,
      },
    });

    if (userCompanies.length === 0) {
      return res.status(404).json({ message: 'No companies found for this user.' });
    }

    const companiesWithUsers = await Promise.all(
      userCompanies.map(async (entry) => {
        const users = await prisma.userCompany.findMany({
          where: {
            company_id: entry.company.company_id,
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        });

        const members = users.map((u) => ({
          id: u.user.id,
          name: u.user.name,
          email: u.user.email,
          role: u.role,
        }));

        return {
          ...entry.company,
          role: entry.role, // Current user's role
          members,
        };
      })
    );

    res.status(200).json({ companies: companiesWithUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching companies.' });
  }
});

app.post('/api/v1/company/:companyId/add-user', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required.' });
    }

    if (!['editor', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "editor" or "user".' });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided email.' });
    }

    console.log(user);

    // Check if the user is already added to the company
    const existing = await prisma.userCompany.findUnique({
      where: {
        user_id_company_id: {
          user_id: user.id,
          company_id: parseInt(companyId),
        },
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'User is already part of this company.' });
    }

    // Add the user to the company
    const addedUser = await prisma.userCompany.create({
      data: {
        user_id: user.id,
        company_id: parseInt(companyId),
        role,
      },
    });

    res.status(201).json({ message: 'User added to company', data: addedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while adding user to the company.' });
  }
});

app.post('/api/v1/company/:companyId/remove-user', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided email.' });
    }

    // Check if the user is already added to the company
    const existing = await prisma.userCompany.findUnique({
      where: {
        user_id_company_id: {
          user_id: user.id,
          company_id: parseInt(companyId),
        },
      },
    });

    if (!existing) {
      return res.status(409).json({ message: 'User is not a part of this company.' });
    }

    // Add the user to the company
    const removeUser = await prisma.userCompany.delete({
      where: {
        user_id_company_id: {
          user_id: user.id,
          company_id: parseInt(companyId),
        },
      },
    });

    res.status(200).json({ message: 'User removed from company', data: removeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while removing user to the company.' });
  }
});

app.patch('/api/v1/company/:companyId', async (req, res) => {
    const { companyId } = req.params;
    const dataToUpdate = req.body

      if (!companyId) {
        return res.status(400).json({ message: 'Company ID is required.' });
      }

    try {
      const existingCompany = await prisma.company.findUnique({
        where: { company_id: parseInt(companyId) },
      });

      if (!existingCompany) {
        return res.status(404).json({ message: 'Company not found.' });
      }

       if (dataToUpdate?.tin) {
        const tinExists = await prisma.company.findFirst({
          where: {
            tin: dataToUpdate?.tin,
            NOT: { companyId },
          },
        });

        if (tinExists) {
          return res.status(409).json({ message: 'TIN is already in use by another company.' });
        }
      }

      await prisma.company.update({
      where: { companyId },
      data: dataToUpdate,
    });

      res.status(200).json({
        code: 200,
        message: 'Company updated successfully.',
      });
    } catch (err){
      console.error('Error updating company:', err);
      res.status(500).json({ message: 'An error occurred while updating the company.' });
    }
});

app.delete('/api/v1/company:companyId', async (req, res) => {
  const { companyId } = req.params;

  try {
    const existingCompany = await prisma.company.findUnique({
        where: { company_id: parseInt(companyId) },
      });

      if (!existingCompany) {
        return res.status(404).json({ message: 'Company not found.' });
      }
      
    await prisma.company.delete({
      where: { company_id: parseInt(companyId) },
    })
  } catch (err) {

  }
})

app.post('/api/v1/item', async (req, res) => {
  try {
    const { item_name, item_type, purchase_date, address, sku, company_id, user_id } = req.body;

    // Validate input
    if (!item_name || !item_type || !purchase_date || !sku || !address || !company_id || !user_id) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Ensure SKU is unique
    if (sku) {
      const existingItem = await prisma.item.findUnique({ where: { sku } });
      if (existingItem) {
        return res.status(400).json({ message: 'SKU must be unique.' });
      }
    }

    const newItem = await prisma.item.create({
      data: {
        item_name,
        item_type,
        purchase_date: purchase_date ? new Date(purchase_date) : null,
        address,
        sku,
        company_id: parseInt(company_id),
        user_id: parseInt(user_id),
        maintenance_interval: 0,
      },
    });

    res.status(201).json({ message: 'Item created successfully.', item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while creating the item.' });
  }
});

app.get('/api/v1/item/:companyId', async (req, res) => {
  const { companyId } = req.params;

  try {
    const companyItems = await prisma.item.findMany({
      where: {
        company_id: parseInt(companyId), // Convert userId to an integer if needed
      }
    });
  
    console.log(companyItems);
  
    if (companyItems.length === 0) {
      return res.status(404).json({ message: 'No items found for this company.' });
    }
  
    // const companies = userCompanies.map((entry) => entry.company);
  
    res.status(200).json({ companyItems });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching items.' });
  }
});

app.delete('/api/v1/item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Check if the item exists
    const existingItem = await prisma.item.findUnique({
      where: { item_id: parseInt(itemId) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    // Delete the item
    await prisma.item.delete({
      where: { item_id: parseInt(itemId) },
    });

    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
  }
});

app.patch('/api/v1/item/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { name, description, price, ...rest } = req.body;

  if (!itemId) {
    return res.status(400).json({ message: 'Item ID is required.' });
  }

  try {
    const existingItem = await prisma.item.findUnique({
      where: { item_id: parseInt(itemId) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    const updatedItem = await prisma.item.update({
      where: { item_id: parseInt(itemId) },
      data: {
        name,
        description,
        price,
        ...rest, // Include any other updatable fields
      },
    });

    res.status(200).json({ message: 'Item updated successfully.', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item.' });
  }
});

app.post('/api/v1/notifications', async (req, res) => {
  const {
    notification_name,
    description,
    notify_at,
    video,
    notify_who,
    repeat_type,
    item_id,
  } = req.body;

  // Simple validation
  if (!notification_name || !repeat_type || !item_id) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const newNotification = await prisma.notification.create({
      data: {
        notification_name,
        description,
        notify_at: notify_at ? new Date(notify_at) : undefined, // handle optional dates
        video,
        notify_who: notify_who || [],
        repeat_type,
        item_id: parseInt(item_id, 10),
      },
    });

    res.status(201).json({ notification: newNotification });
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

app.get('/api/v1/notifications/:companyId', async (req, res) => {
  const { companyId } = req.params;

  if (!companyId) {
    return res.status(400).json({ error: 'companyId is required' });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        item: {
          company_id: parseInt(companyId, 10),
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of month
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    // Initialize structure
    const grouped = {
      Missed: [],
      Today: [],
      'This Week': [],
      'This Month': [],
      'This year': [],
      Completed: [],
    };

    for (const n of notifications) {
      const notifyDate = new Date(n.notify_at);
      notifyDate.setHours(0, 0, 0, 0); // ignore time

      let type = 'upcoming';

      if (n.is_completed) {
        type = 'complete';
      } else if (notifyDate < today) {
        type = 'missed';
      } else if (notifyDate.getTime() === today.getTime()) {
        type = 'incomplete';
      }

      let column = 'This year'; // default

      if (notifyDate < today && !n.is_completed) {
        column = 'Missed';
      } else if (n.is_completed && n.repeat_type==='singular') {
        column = 'Completed';
      } else if (notifyDate.getTime() === today.getTime()) {
        column = 'Today';
      } else if (notifyDate >= startOfWeek && notifyDate <= endOfWeek) {
        column = 'This Week';
      } else if (notifyDate >= startOfMonth && notifyDate <= endOfMonth) {
        column = 'This Month';
      } else if (notifyDate >= startOfYear && notifyDate <= endOfYear) {
        column = 'This year';
      }

      grouped[column].push({
        ...n,
        type,
      });
    }

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching notifications.' });
  }
});

app.get('/api/v1/notifications/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await prisma.notification.findUnique({
      where: {
        notification_id: parseInt(id, 10), // Make sure id is an integer
      }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/v1/notifications/:id', async (req, res) => {
  const { id } = req.params;
  const dataToUpdate = req.body;

  try {
    const updatedNotification = await prisma.notification.update({
      where: { notification_id: parseInt(id) },
      data: dataToUpdate,
    });

    const notif = await prisma.notification.findUnique({
      where: { notification_id: parseInt(id) },
    })

    res.json(updatedNotification);

    rescheduleNotification(notif);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.delete('/api/v1/notifications/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.notification.delete({
      where: { notification_id: parseInt(id) },
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

app.post('/api/v1/enhance-text', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-small',
      {
        inputs: `Paraphrase this professionally: ${text}`,
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const enhancedText = response.data[0]?.generated_text || 'No output';

    res.json({
      originalText: text,
      enhancedText,
    });
  } catch (error) {
    console.error('AI Enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance text' });
  }
});

// app.post('api/v1/suggest-notification', async (req, res) => {
//   const { item_type, maintenance_interval } = req.body;

//   if (!item_type || !maintenance_interval) {
//     return res.status(400).json({ error: 'Missing required fields.' });
//   }

//   const prompt = `
//   Suggest a maintenance notification for an item of type "${item_type}". 
//   The maintenance interval is every ${maintenance_interval} days. 
//   Respond in JSON with: 
//   {
//     "suggested_name": "...", 
//     "suggested_interval": "...", 
//     "suggested_description": "..."
//   }
//   `;

//   try {
//     const response = await openai.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//       temperature: 0.7,
//     });

//     const message = response.data.choices[0].message.content;

//     // Try parsing it
//     const suggestion = JSON.parse(message);

//     res.json(suggestion);
//   } catch (error) {
//     console.error('Error generating AI suggestion:', error);
//     res.status(500).json({ error: 'Failed to generate suggestion' });
//   }
// });

app.get('/env', (req, res) => res.status(200).send(`ENV: ${process.env.ENV}`));

app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), FE_BUILD_PATH, 'index.html')));

app.listen(8080);
