#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

async function testLocalSetup() {
  console.log('🧪 Testing local Docker setup...\n');
  
  // Test 1: Check if local data directory exists
  const localDataDir = './data';
  const localUploadsDir = './data/uploads/cars';
  
  console.log(`1. Checking local data directory: ${localDataDir}`);
  
  if (!fs.existsSync(localDataDir)) {
    console.log('   Creating local data directory...');
    fs.mkdirSync(localDataDir, { recursive: true });
    console.log('✅ Local data directory created');
  } else {
    console.log('✅ Local data directory exists');
  }
  
  console.log(`\n2. Checking local uploads directory: ${localUploadsDir}`);
  
  if (!fs.existsSync(localUploadsDir)) {
    console.log('   Creating local uploads directory...');
    fs.mkdirSync(localUploadsDir, { recursive: true });
    console.log('✅ Local uploads directory created');
  } else {
    console.log('✅ Local uploads directory exists');
  }
  
  // Test 2: Test file creation
  const testFile = path.join(localUploadsDir, 'test.txt');
  console.log(`\n3. Testing file creation: ${testFile}`);
  
  try {
    fs.writeFileSync(testFile, 'Test content for local setup');
    console.log('✅ File creation successful');
    
    // Read back the file
    const content = fs.readFileSync(testFile, 'utf8');
    console.log(`   File content: "${content}"`);
    
    // Clean up
    fs.unlinkSync(testFile);
    console.log('✅ Test file cleaned up');
  } catch (error) {
    console.log('❌ File creation failed:', error);
  }
  
  // Test 3: Check permissions
  console.log(`\n4. Checking directory permissions: ${localUploadsDir}`);
  try {
    const stats = fs.statSync(localUploadsDir);
    console.log(`   Mode: ${stats.mode.toString(8)}`);
    console.log(`   Is directory: ${stats.isDirectory()}`);
    console.log('✅ Directory permissions OK');
  } catch (error) {
    console.log('❌ Permission check failed:', error);
  }
  
  console.log('\n🎉 Local setup test completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: docker-compose -f docker-compose.local.yml build');
  console.log('2. Run: docker-compose -f docker-compose.local.yml up -d');
  console.log('3. Check: http://localhost:3000');
  console.log('4. Test image upload via sync API');
}

// Run the test
testLocalSetup().catch(console.error);
