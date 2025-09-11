# Database Setup Guide - SQLite + Cloudinary

Your event booking app uses **SQLite** for data storage and **Cloudinary** for image uploads - the perfect combination for simplicity and professional image handling.

## 🗄️ Database: SQLite

**Why SQLite?**

- ✅ **No setup required** - works out of the box
- ✅ **Perfect for Vercel** - deploys seamlessly
- ✅ **Zero configuration** - just run and go
- ✅ **Reliable** - used by millions of applications
- ✅ **Fast** - excellent performance for most use cases

## 🖼️ Images: Cloudinary

**Why Cloudinary?**

- ✅ **Professional image handling** - automatic optimization
- ✅ **CDN delivery** - fast image loading worldwide
- ✅ **Automatic formats** - WebP, AVIF for modern browsers
- ✅ **Responsive images** - multiple sizes generated automatically
- ✅ **Free tier** - generous limits for getting started

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Setup Database

```bash
npm run setup
```

This will:

- Create SQLite database (`prisma/dev.db`)
- Create all tables (events, seats, bookings, admins)
- Insert sample data
- Create admin user (username: `admin`, password: `admin123`)

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Database (already configured)
DATABASE_URL="file:./dev.db"

# JWT Secret for Admin Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Cloudinary Configuration (your credentials)
CLOUDINARY_CLOUD_NAME="masoft"
CLOUDINARY_API_KEY="657846754332939"
CLOUDINARY_API_SECRET="Jsg7AiP68YfIr74PmFwIP7T5YF8"
CLOUDINARY_URL="cloudinary://657846754332939:Jsg7AiP68YfIr74PmFwIP7T5YF8@masoft"

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_CHAT_ID="your-telegram-chat-id"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Step 4: Start Development

```bash
npm run dev
```

## 📊 Database Schema

### Events Table

```sql
- id (Primary Key)
- title (Event title in Arabic/English)
- description (Event description)
- image (Cloudinary image URL)
- date (Event date and time)
- venue (Event location)
- created_at, updated_at (Timestamps)
```

### Seats Table

```sql
- id (Primary Key)
- event_id (Links to event)
- row (Seat row: A, B, C, etc.)
- number (Seat number in row)
- section (Seat section)
- price (Seat price in SAR)
- category (VVIP, VIP, Royal, Diamond, Platinum, Gold, Silver, Bronze)
- is_booked (Booking status)
```

### Bookings Table

```sql
- id (Primary Key)
- event_id (Links to event)
- seat_id (Links to seat)
- customer_name (Customer name)
- customer_phone (Customer phone)
- customer_email (Customer email)
- total_amount (Total booking amount)
- status (pending, confirmed, cancelled)
- payment_data (Payment information)
- created_at (Booking timestamp)
```

### Admins Table

```sql
- id (Primary Key)
- username (Admin username)
- password (Admin password)
- created_at (Creation timestamp)
```

## 🖼️ Image Upload Features

### Admin Panel Image Upload

- **Drag & drop** or click to select images
- **Live preview** before saving
- **Automatic optimization** via Cloudinary
- **Multiple formats** supported (JPG, PNG, WebP)
- **Fallback URL input** for external images

### Cloudinary Transformations

- **Auto-resize** to 800x600 for consistency
- **Quality optimization** for faster loading
- **WebP format** for modern browsers
- **CDN delivery** for global performance

## 🛠️ Available Commands

```bash
# Database Management
npm run setup              # Create database and seed data
npm run db:push           # Push schema changes
npm run db:studio         # Open database GUI
npm run db:generate       # Generate Prisma client

# Development
npm run dev               # Start development server
npm run build             # Build for production
npm start                 # Start production server
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy** - SQLite database included automatically!

### Environment Variables for Vercel:

```
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=masoft
CLOUDINARY_API_KEY=657846754332939
CLOUDINARY_API_SECRET=Jsg7AiP68YfIr74PmFwIP7T5YF8
TELEGRAM_BOT_TOKEN=your-bot-token (optional)
TELEGRAM_CHAT_ID=your-chat-id (optional)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## 🔧 Admin Panel Features

### Event Management

- ✅ **Add new events** with image upload
- ✅ **Edit existing events**
- ✅ **Delete events** (with confirmation)
- ✅ **Image preview** and management
- ✅ **Real-time updates** to database

### Image Upload

- ✅ **File picker** with preview
- ✅ **Drag & drop** support
- ✅ **Image optimization** via Cloudinary
- ✅ **URL fallback** for external images
- ✅ **Delete/replace** images easily

## 📱 User Experience

### Event Browsing

- **Fast loading** with optimized images
- **Responsive images** for all devices
- **CDN delivery** for global performance
- **Automatic format** selection (WebP, etc.)

### Booking Flow

1. Browse events with beautiful images
2. Select event → View details with hero image
3. Choose seats → Visual seat map
4. Payment → Secure form
5. Confirmation → SMS verification
6. **Telegram notification** to admin

## 🔍 Troubleshooting

### Database Issues

```bash
# Reset database
rm prisma/dev.db
npm run setup

# View database
npm run db:studio
```

### Image Upload Issues

- Check Cloudinary credentials in `.env`
- Verify file size (max 10MB recommended)
- Check network connection
- View browser console for errors

### Common Solutions

1. **"Database locked"** → Restart development server
2. **"Image upload failed"** → Check Cloudinary credentials
3. **"Admin login failed"** → Use `admin` / `admin123`
4. **"Seats not loading"** → Run `npm run setup` to seed data

## 📈 Performance Tips

1. **Images**: Cloudinary handles optimization automatically
2. **Database**: SQLite is fast for read-heavy workloads
3. **Caching**: Vercel provides automatic edge caching
4. **CDN**: Cloudinary provides global CDN for images

## 🔒 Security Notes

1. **Environment Variables**: Never commit `.env` files
2. **Admin Passwords**: Hash passwords in production
3. **JWT Secret**: Use strong, unique secret in production
4. **Image Uploads**: Cloudinary handles security automatically
5. **Database**: SQLite file permissions handled by Vercel

## 🎯 Next Steps

Your app is production-ready! Consider adding:

- **Email notifications** for bookings
- **SMS verification** with real SMS service
- **Payment gateway** integration (Stripe, PayPal)
- **Analytics** tracking
- **SEO optimization**
- **PWA features** for mobile app experience

The combination of SQLite + Cloudinary gives you the perfect balance of simplicity and professional features!
