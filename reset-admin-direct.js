const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAdminPassword() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // List all admin users
    const result = await client.query(
      'SELECT id, firstname, lastname, email, username FROM admin_users ORDER BY id'
    );

    if (result.rows.length === 0) {
      console.log('❌ No admin users found in the database');
      return;
    }

    console.log('\n📋 Found admin users:');
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || user.username} (ID: ${user.id})`);
    });

    // Use the first admin user
    const adminUser = result.rows[0];
    const newPassword = 'NewPassword123!';
    
    // Hash the password (Strapi uses bcrypt with 10 rounds)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await client.query(
      `UPDATE admin_users 
       SET password = $1, blocked = false, is_active = true 
       WHERE id = $2`,
      [hashedPassword, adminUser.id]
    );

    console.log('\n✅ Password reset successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log(`📧 Email/Username: ${adminUser.email || adminUser.username}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log('\nYou can now login to your Strapi admin panel.');
    console.log('Please change this password after logging in.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    process.exit();
  }
}

resetAdminPassword();
