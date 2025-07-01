#!/usr/bin/env node

// Kaggle Dataset Integration Setup Script
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🎯 RefeedPlatform - Kaggle Dataset Integration Setup')
console.log('==================================================')

// Check if Python is installed
function checkPython() {
  try {
    execSync('python --version', { stdio: 'pipe' })
    return true
  } catch (error) {
    try {
      execSync('python3 --version', { stdio: 'pipe' })
      return true
    } catch (error2) {
      return false
    }
  }
}

// Check if pip is installed
function checkPip() {
  try {
    execSync('pip --version', { stdio: 'pipe' })
    return true
  } catch (error) {
    try {
      execSync('pip3 --version', { stdio: 'pipe' })
      return true
    } catch (error2) {
      return false
    }
  }
}

// Check if Kaggle CLI is installed
function checkKaggleCLI() {
  try {
    execSync('kaggle --version', { stdio: 'pipe' })
    return true
  } catch (error) {
    return false
  }
}

// Check if Kaggle is configured
function checkKaggleConfig() {
  try {
    execSync('kaggle competitions list -p 1', { stdio: 'pipe' })
    return true
  } catch (error) {
    return false
  }
}

// Create data directories
function createDataDirectories() {
  const directories = [
    './data',
    './data/kaggle',
    './data/kaggle/food-deserts',
    './data/kaggle/us-prices',
    './data/kaggle/global-prices',
    './data/kaggle/rwanda-prices',
    './data/kaggle/food-waste'
  ]

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`✅ Created directory: ${dir}`)
    }
  })
}

// Main setup function
function main() {
  console.log('\n🔍 Checking Prerequisites...')
  
  // Check Python
  if (!checkPython()) {
    console.log('❌ Python not found. Please install Python 3.7+')
    console.log('   Download: https://www.python.org/downloads/')
    return
  }
  console.log('✅ Python is installed')

  // Check pip
  if (!checkPip()) {
    console.log('❌ pip not found. Please install pip')
    return
  }
  console.log('✅ pip is installed')

  // Check Kaggle CLI
  if (!checkKaggleCLI()) {
    console.log('⚠️  Kaggle CLI not installed')
    console.log('   Installing Kaggle CLI...')
    try {
      execSync('pip install kaggle', { stdio: 'inherit' })
      console.log('✅ Kaggle CLI installed successfully')
    } catch (error) {
      console.log('❌ Failed to install Kaggle CLI')
      console.log('   Please run manually: pip install kaggle')
      return
    }
  } else {
    console.log('✅ Kaggle CLI is installed')
  }

  // Check Kaggle configuration
  if (!checkKaggleConfig()) {
    console.log('⚠️  Kaggle CLI not configured')
    console.log('\n🔑 To configure Kaggle CLI:')
    console.log('1. Go to https://www.kaggle.com/account')
    console.log('2. Click "Create New API Token"')
    console.log('3. Download kaggle.json')
    console.log('4. Place it in:')
    console.log('   Windows: C:\\Users\\{username}\\.kaggle\\kaggle.json')
    console.log('   Mac/Linux: ~/.kaggle/kaggle.json')
    console.log('5. Run this script again')
    console.log('\n💡 Or set environment variables:')
    console.log('   KAGGLE_USERNAME=your_username')
    console.log('   KAGGLE_KEY=your_api_key')
  } else {
    console.log('✅ Kaggle CLI is configured')
  }

  // Create data directories
  console.log('\n📁 Creating data directories...')
  createDataDirectories()

  console.log('\n🎯 Next Steps:')
  console.log('1. Make sure Kaggle CLI is configured (see above)')
  console.log('2. Visit: http://localhost:3000/admin')
  console.log('3. Go to "Kaggle Integration" section')
  console.log('4. Click "Download All High Priority Datasets"')
  console.log('5. Process and integrate the data')

  console.log('\n🚀 Available Datasets:')
  console.log('• Food Access and Food Deserts (59MB) - USDA official data')
  console.log('• US Fruit & Vegetable Prices (4.6MB) - 150+ produce items')
  console.log('• Global Food Prices (225MB) - 76 countries, 1,500 markets')
  console.log('• Rwanda Food Prices - Agricultural supply data')
  console.log('• Food Waste Data - Sustainability metrics')

  console.log('\n✨ Ready for Kaggle dataset integration!')
}

main()
