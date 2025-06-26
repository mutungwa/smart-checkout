# Admin Setup Guide

## Creating Admin Users

The Smart Checkout system requires admin users to be created securely through a command-line script. This ensures no default credentials are exposed.

### Prerequisites

1. Ensure the database is set up and migrated:
   ```bash
   pnpm db:migrate
   ```

2. Make sure all dependencies are installed:
   ```bash
   pnpm install
   ```

### Creating Your First Admin User

Run the interactive admin creation script:

```bash
pnpm admin:create
```

The script will prompt you for:

- **Full Name**: The admin's display name
- **Email**: Must be a valid email address (used for login)
- **Username**: Must be unique and at least 3 characters
- **Password**: Must meet security requirements:
  - At least 8 characters long
  - Contains uppercase letter
  - Contains lowercase letter
  - Contains at least one number
- **Role**: Choose from:
  - `admin` - Standard admin access
  - `super_admin` - Full system access
  - `manager` - Limited management access

### Password Security Requirements

The system enforces strong password policies:
- Minimum 8 characters
- Must include uppercase and lowercase letters
- Must include at least one number
- Passwords are hashed using bcrypt with 12 rounds

### Admin Roles

- **super_admin**: Full access to all system features
- **admin**: Standard administrative access
- **manager**: Limited access for store managers

### Accessing the Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Enter your username/email and password
3. You'll be redirected to the admin dashboard upon successful login

### Security Features

- JWT-based authentication with 24-hour expiration
- Secure password hashing with bcrypt
- Protected routes that require authentication
- Automatic logout on token expiration
- No default or demo credentials

### Troubleshooting

**"Username already exists"**
- Choose a different username

**"Email already exists"**
- Use a different email address or check if you already have an account

**"Invalid credentials" on login**
- Verify your username/email and password
- Ensure the admin account is active

**Can't access admin dashboard**
- Clear browser localStorage and try logging in again
- Check if your token has expired (24-hour limit)

### Managing Admin Users

Currently, admin users can only be created through the command line script. Future versions will include:
- Admin user management in the dashboard
- Password reset functionality
- Role modification capabilities

### Security Best Practices

1. Use strong, unique passwords for each admin
2. Regularly rotate admin passwords
3. Limit super_admin access to essential personnel
4. Monitor admin login activity through the dashboard
5. Keep the JWT_SECRET environment variable secure
