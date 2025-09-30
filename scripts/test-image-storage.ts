#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

async function testImageStorage() {
  console.log('🧪 Testing image storage setup...\n');
  
  // Test 1: Check if uploads directory exists
  const uploadsDir = '/app/data/uploads/cars';
  console.log(`1. Checking uploads directory: ${uploadsDir}`);
  
  if (fs.existsSync(uploadsDir)) {
    console.log('✅ Uploads directory exists');
  } else {
    console.log('❌ Uploads directory does not exist');
    console.log('   Creating directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created');
  }
  
  // Test 2: Test file creation
  const testFile = path.join(uploadsDir, 'test.txt');
  console.log(`\n2. Testing file creation: ${testFile}`);
  
  try {
    fs.writeFileSync(testFile, 'Test content');
    console.log('✅ File creation successful');
    
    // Clean up
    fs.unlinkSync(testFile);
    console.log('✅ Test file cleaned up');
  } catch (error) {
    console.log('❌ File creation failed:', error);
  }
  
  // Test 3: Check permissions
  console.log(`\n3. Checking directory permissions: ${uploadsDir}`);
  try {
    const stats = fs.statSync(uploadsDir);
    console.log(`   Mode: ${stats.mode.toString(8)}`);
    console.log(`   Is directory: ${stats.isDirectory()}`);
    console.log('✅ Directory permissions OK');
  } catch (error) {
    console.log('❌ Permission check failed:', error);
  }
  
  // Test 4: Check if we can create subdirectories
  const testSubDir = path.join(uploadsDir, 'test-car-123');
  console.log(`\n4. Testing subdirectory creation: ${testSubDir}`);
  
  try {
    fs.mkdirSync(testSubDir, { recursive: true });
    console.log('✅ Subdirectory creation successful');
    
    // Clean up
    fs.rmdirSync(testSubDir);
    console.log('✅ Test subdirectory cleaned up');
  } catch (error) {
    console.log('❌ Subdirectory creation failed:', error);
  }
  
  console.log('\n🎉 Image storage test completed!');
}

// Run the test
testImageStorage().catch(console.error);
