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

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt)

    // Store original settings
    const originalRawMode = process.stdin.isRaw
    const originalListeners = process.stdin.listeners('data')

    // Remove existing listeners
    process.stdin.removeAllListeners('data')

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    let password = ''

    const onData = function(char) {
      char = char + ''

      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          // Restore original state
          process.stdin.setRawMode(originalRawMode)
          process.stdin.removeListener('data', onData)

          // Restore original listeners
          originalListeners.forEach(listener => {
            process.stdin.on('data', listener)
          })

          process.stdout.write('\n')
          resolve(password)
          break
        case '\u0003':
          process.exit()
          break
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1)
            process.stdout.write('\b \b')
          }
          break
        default:
          password += char
          process.stdout.write('*')
          break
      }
    }

    process.stdin.on('data', onData)
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
      process.exit(1)
    }
    console.log(`✅ Name: ${name}`)

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

    let password
    while (true) {
      try {
        password = await questionHidden('Enter admin password: ')
        const validation = validatePassword(password)
        if (!validation.valid) {
          console.log(`❌ ${validation.message}`)
          continue
        }

        const confirmPassword = await questionHidden('Confirm password: ')
        if (password !== confirmPassword) {
          console.log('❌ Passwords do not match')
          continue
        }
        break
      } catch (error) {
        console.log('\n❌ Error reading password, please try again')
        continue
      }
    }
    console.log('✅ Password set successfully')

    console.log('\n📝 Step 4: Select admin role')
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
    console.log('\n🎉 You can now login to the admin dashboard!')

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message)
    console.error('Full error:', error)
  } finally {
    try {
      rl.close()
    } catch (e) {
      // Ignore close errors
    }
    try {
      await prisma.$disconnect()
    } catch (e) {
      // Ignore disconnect errors
    }
    console.log('\n👋 Goodbye!')
    process.exit(0)
  }
}

// Run the script
createAdmin()
