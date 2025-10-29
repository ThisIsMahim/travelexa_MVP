# Easy Booking - Email Configuration Setup

## Current Issue
The application is showing "Email credentials not configured. Email functionality disabled." because the `.env` file is missing from the server directory.

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/easy-booking

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
EMAIL=your_email@example.com
PASSWORD=your_email_password
```

## Email Service Configuration

The application is currently configured to use `mail.softenginelab.com` as the email service provider. This is set in both:
- `server/Controllers/authController.js` (lines 14-22)
- `server/Controllers/bookingController.js` (lines 14-26)

### Current Email Settings:
- Host: mail.softenginelab.com
- Port: 465
- Secure: true (SSL)
- Authentication: Required

## Email Functionality

The application uses email for:
1. **Password Reset**: When users request password reset via `/api/auth/reset-password`
2. **Booking Confirmation**: When users book seats, they receive booking details via email

## Setup Instructions

1. **Create the .env file**:
   ```bash
   cd server
   touch .env
   ```

2. **Add your email credentials** to the `.env` file:
   - Replace `your_email@example.com` with your actual email address
   - Replace `your_email_password` with your email password
   - Replace `your_jwt_secret_key_here` with a secure random string

3. **Restart the server** after creating the `.env` file

## Alternative Email Providers

If you want to use a different email service provider (Gmail, Outlook, etc.), you'll need to update the transporter configuration in both controller files:

### For Gmail:
```javascript
transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // Use App Password for Gmail
  },
});
```

### For Outlook/Hotmail:
```javascript
transporter = nodemailer.createTransporter({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
```

## Security Notes

- Never commit the `.env` file to version control
- Use app-specific passwords for Gmail
- Consider using environment variables in production
- The `.env` file should be added to `.gitignore`

## Testing Email Functionality

After setting up the email configuration:
1. Try the password reset functionality
2. Make a test booking to verify booking confirmation emails
3. Check the server console for "Email service ready for messages" message
