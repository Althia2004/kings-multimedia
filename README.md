# 📸 Kings Media — TheKingsVault

A modern full-stack photography studio management and booking platform built with **Laravel 11**, **React**, **Inertia.js**, and **SQLite/MySQL**.

TheKingsVault allows photography studios to manage bookings, clients, payments, galleries, reports, and employees in one centralized system with separate **Admin** and **Client** portals.

---

## ✨ Features

## Public Landing Page

- Modern animated photography portfolio
- Dynamic image showcase
- Featured gallery carousel
- Responsive design
- Studio information
- Services section
- Registration/Login system

---

## 👨‍💼 Admin Portal

### Dashboard
- Real-time business statistics
- Upcoming sessions overview
- Revenue summary
- Pending balances
- Quick actions

### Booking Management
- Create bookings
- Approve bookings
- Reject bookings
- Reschedule bookings
- Delete bookings
- Search and filter bookings
- Booking conflict validation

### Calendar Scheduling
- Session calendar
- Track available dates
- Prevent schedule conflicts

### Client Management
- View client profiles
- Booking history
- Contact information

### Employee Management System
- Add admin members
- Delete admin members
- Manage studio employees

### File Management
- Upload client photos
- Organize files by:
  - Client
  - Session Date
  - Event Type
- Preview files
- Download files

### Payment Management
- Record payments
- Track balances
- Mark paid/unpaid
- Partial payment support
- Demo QR/Barcode payment flow

### Reports System
Real-time database reports:

- Revenue Report
- Booking Report
- Client Report
- Popular Package Report
- Monthly Income
- Bookings Per Month

Export support:

- 📄 PDF Export
- 📊 Excel Export
- Auto-total calculations

### Notifications
- Booking notifications
- Payment reminders
- Schedule alerts
- Custom notifications

### Settings
- Profile management
- Security settings
- Appearance settings

---

## 👤 Client Portal

### Dashboard
- Active bookings
- Pending balances
- Upcoming sessions
- Released photos

### My Bookings
- Submit booking requests
- View booking history
- Approval tracking
- Session status tracking

### My Photos
- View released galleries
- Download photos
- Search photos

### Payments
- Payment history
- Balance tracking
- Demo QR payment flow

### Notifications
- Booking updates
- Payment reminders
- Session reminders

### Profile
- Account management

---

## 🔒 Security Features

- Authentication using Laravel Fortify
- Role-based access control
- Admin/User separation
- Protected routes
- Session invalidation on logout
- Browser back-button protection
- CSRF protection
- Secure middleware

---

## 📅 Booking Rules

Business rules implemented:

### Schedule Validation

- Two bookings cannot occupy the same session date
- Prevents double-booking conflicts
- Suggests available dates automatically
- Admin approval required before scheduling

### Payment Rules

- Photos become available only after payment is completed
- Supports:
  - Paid
  - Partial
  - Unpaid

---

## 🛠 Tech Stack

### Backend

- Laravel 11
- PHP 8+
- Laravel Fortify
- Inertia.js

### Frontend

- React
- TypeScript
- TailwindCSS
- Framer Motion

### Database

- SQLite (development)
- MySQL (production-ready)

### Additional Packages

- Maatwebsite Excel
- DomPDF
- Ziggy

---

## 📂 Project Structure

```bash
Kings-Media/
│
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
│   └── images/
│       └── portfolio/
├── resources/
│   ├── js/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── hooks/
│   │
│   └── views/
│
├── routes/
├── storage/
└── tests/
```

---

## ⚙ Installation

Clone repository:

```bash
git clone https://github.com/yourusername/kings-media.git
```

Move into project:

```bash
cd kings-media
```

Install dependencies:

```bash
composer install

npm install
```

Copy environment:

```bash
cp .env.example .env
```

Generate key:

```bash
php artisan key:generate
```

Run migrations:

```bash
php artisan migrate
```

Seed database:

```bash
php artisan db:seed
```

Start backend:

```bash
php artisan serve
```

Start frontend:

```bash
npm run dev
```

Open:

```bash
http://localhost:8000
```

---

## Default Test Accounts

### Admin

```text
Email:
admin@example.com

Password:
password
```

### Client

```text
Email:
client@example.com

Password:
password
```

---

## Screenshots

Add screenshots here:

- Landing Page
- Admin Dashboard
- Client Dashboard
- Booking Management
- Reports
- Employee Management

---

## Future Improvements

- Real PayMongo API integration
- Email notifications
- SMS notifications
- Live chat support
- Google Calendar sync
- Image compression
- Watermarking
- Mobile application

---

## Developers

Developed for:

**Kings Media / TheKingsVault**

Built using Laravel + React + Inertia.

---

## License

This project is for academic and portfolio purposes.
