#!/usr/bin/env node

// Auto-copy kaggle.json from project folder to correct location
const fs = require('fs')
const path = require('path')
const os = require('os')

const homeDir = os.homedir()
const kaggleDir = path.join(homeDir, '.kaggle')
const targetPath = path.join(kaggleDir, 'kaggle.json')
const sourcePath = path.join(process.cwd(), 'kaggle.json')

console.log('🔄 Auto-copying kaggle.json...')

if (fs.existsSync(sourcePath)) {
  try {
    // Ensure .kaggle directory exists
    if (!fs.existsSync(kaggleDir)) {
      fs.mkdirSync(kaggleDir, { recursive: true })
    }
    
    // Copy the file
    fs.copyFileSync(sourcePath, targetPath)
    
    console.log('✅ Success! Copied kaggle.json to:')
    console.log(`   ${targetPath}`)
    
    // Verify the content
    const content = fs.readFileSync(targetPath, 'utf8')
    const parsed = JSON.parse(content)
    
    if (parsed.username && parsed.key) {
      console.log('✅ File is valid!')
      console.log(`   Username: ${parsed.username}`)
      console.log('   Key: [CONFIGURED]')
    }
    
    console.log('\n🎉 Ready to download datasets!')
    console.log('   Visit: http://localhost:3000/admin')
    console.log('   Click "Download All High Priority Datasets"')
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
} else {
  console.log('📋 Please place your kaggle.json file in this project folder first:')
  console.log(`   ${process.cwd()}\\kaggle.json`)
  console.log('\nThen run this script again.')
}
