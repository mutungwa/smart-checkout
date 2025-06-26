const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}

async function createAdmin() {
  console.log('\n🔐 Smart Checkout Admin User Creation')
  console.log('=====================================\n')

  try {
    // Test database connection first
    await prisma.$connect()
    console.log('✅ Database connected successfully\n')

    // Get admin details
    console.log('📝 Step 1: Enter admin details')
    const name = await question('Enter admin full name: ')
    if (!name.trim()) {
      console.log('❌ Name cannot be empty')
      return
    }
    console.log(`✅ Name: ${name}`)

    console.log('\n📝 Step 2: Enter email')
    let email
    while (true) {
      email = await question('Enter admin email: ')
      if (!email.trim()) {
        console.log('❌ Email cannot be empty')
        continue
      }
      if (!validateEmail(email)) {
        console.log('❌ Please enter a valid email address')
        continue
      }
      
      // Check if email already exists
      const existingEmailAdmin = await prisma.admin.findUnique({
        where: { email: email }
      })
      if (existingEmailAdmin) {
        console.log('❌ An admin with this email already exists')
        continue
      }
      break
    }
    console.log(`✅ Email: ${email}`)

    console.log('\n📝 Step 3: Enter username')
    let username
    while (true) {
      username = await question('Enter admin username: ')
      if (!username.trim()) {
        console.log('❌ Username cannot be empty')
        continue
      }
      if (username.length < 3) {
        console.log('❌ Username must be at least 3 characters long')
        continue
      }
      
      // Check if username already exists
      const existingAdmin = await prisma.admin.findUnique({
        where: { username: username }
      })
      if (existingAdmin) {
        console.log('❌ Username already exists, please choose another')
        continue
      }
      break
    }
    console.log(`✅ Username: ${username}`)

    console.log('\n📝 Step 4: Enter password')
    console.log('⚠️  Note: Password will be visible on screen')
    let password
    while (true) {
      password = await question('Enter admin password: ')
      const validation = validatePassword(password)
      if (!validation.valid) {
        console.log(`❌ ${validation.message}`)
        continue
      }
      
      const confirmPassword = await question('Confirm password: ')
      if (password !== confirmPassword) {
        console.log('❌ Passwords do not match')
        continue
      }
      break
    }
    console.log('✅ Password set successfully')

    console.log('\n📝 Step 5: Select admin role')
    let role
    while (true) {
      console.log('\nAvailable roles:')
      console.log('1. admin - Standard admin access')
      console.log('2. super_admin - Full system access')
      console.log('3. manager - Limited management access')
      
      const roleChoice = await question('Select role (1-3): ')
      switch(roleChoice) {
        case '1':
          role = 'admin'
          break
        case '2':
          role = 'super_admin'
          break
        case '3':
          role = 'manager'
          break
        default:
          console.log('❌ Invalid choice, please select 1, 2, or 3')
          continue
      }
      break
    }
    console.log(`✅ Role: ${role}`)

    // Hash password
    console.log('\n🔄 Creating admin user...')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password: hashedPassword,
        role: role,
        isActive: true,
      },
    })

    console.log('\n✅ Admin user created successfully!')
    console.log(`📧 Email: ${admin.email}`)
    console.log(`👤 Username: ${admin.username}`)
    console.log(`🔑 Role: ${admin.role}`)
    console.log(`🆔 ID: ${admin.id}`)
    console.log('\n🎉 You can now login to the admin dashboard at:')
    console.log('   http://localhost:3000/admin/login')

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message)
    if (error.code === 'P2002') {
      console.error('This usually means the username or email already exists.')
    }
  } finally {
    rl.close()
    await prisma.$disconnect()
    console.log('\n👋 Script completed!')
  }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.log('\n\n👋 Script interrupted. Cleaning up...')
  rl.close()
  await prisma.$disconnect()
  process.exit(0)
})

// Run the script
createAdmin()
