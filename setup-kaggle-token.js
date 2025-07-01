#!/usr/bin/env node

// Kaggle API Token Setup Script for Windows
const fs = require('fs')
const path = require('path')
const os = require('os')

console.log('🔑 Kaggle API Token Setup')
console.log('==========================')

// Get the user's home directory
const homeDir = os.homedir()
const kaggleDir = path.join(homeDir, '.kaggle')
const kaggleJsonPath = path.join(kaggleDir, 'kaggle.json')

console.log(`\n📍 Your username: ${os.userInfo().username}`)
console.log(`📁 Kaggle directory should be: ${kaggleDir}`)
console.log(`📄 Kaggle JSON file should be: ${kaggleJsonPath}`)

// Check if .kaggle directory exists
if (!fs.existsSync(kaggleDir)) {
  console.log('\n📁 Creating .kaggle directory...')
  try {
    fs.mkdirSync(kaggleDir, { recursive: true })
    console.log('✅ .kaggle directory created successfully')
  } catch (error) {
    console.log('❌ Failed to create .kaggle directory:', error.message)
    return
  }
} else {
  console.log('\n✅ .kaggle directory already exists')
}

// Check if kaggle.json already exists
if (fs.existsSync(kaggleJsonPath)) {
  console.log('✅ kaggle.json file already exists!')
  
  // Test if it's valid JSON
  try {
    const content = fs.readFileSync(kaggleJsonPath, 'utf8')
    const parsed = JSON.parse(content)
    
    if (parsed.username && parsed.key) {
      console.log('✅ kaggle.json appears to be valid')
      console.log(`   Username: ${parsed.username}`)
      console.log('   Key: [HIDDEN]')
    } else {
      console.log('⚠️  kaggle.json exists but may be invalid (missing username or key)')
    }
  } catch (error) {
    console.log('⚠️  kaggle.json exists but contains invalid JSON')
  }
} else {
  console.log('📋 kaggle.json file not found')
}

console.log('\n📋 Instructions:')
console.log('1. Download your kaggle.json from https://www.kaggle.com/account')
console.log('2. Copy the file to:')
console.log(`   ${kaggleJsonPath}`)
console.log('3. OR use Windows Explorer:')
console.log(`   - Open: ${homeDir}`)
console.log(`   - Create folder: .kaggle (if it doesn't exist)`)
console.log(`   - Place kaggle.json inside the .kaggle folder`)

console.log('\n💡 Alternative method - Copy using this script:')
console.log('   - Place your downloaded kaggle.json in this project folder')
console.log('   - Run: node copy-kaggle-token.js')

// Check if there's a kaggle.json in the current directory
const currentDirKaggle = path.join(process.cwd(), 'kaggle.json')
if (fs.existsSync(currentDirKaggle)) {
  console.log('\n🎯 Found kaggle.json in current directory!')
  console.log('   Would you like to copy it to the correct location? (Y/N)')
  
  // Note: In a real interactive script, you'd handle user input here
  // For now, we'll just show the copy command
  console.log('\n📋 To copy it automatically, run:')
  console.log(`   copy "${currentDirKaggle}" "${kaggleJsonPath}"`)
}

console.log('\n🔍 After placing the file, test with:')
console.log('   kaggle competitions list -p 1')
console.log('   OR')
console.log('   curl "http://localhost:3000/api/kaggle?action=setup-check"')

console.log('\n✨ Once configured, you can download datasets from the admin panel!')
