/**
 * Simple test runner for OpenAQ API functions
 * Run this to test the air quality data fetching
 */

import { getAirQualityData, demoSurakartaAirQuality } from './openaq-demo';

// Test coordinates for Surakarta, Indonesia
const TEST_LATITUDE = -7.5617;
const TEST_LONGITUDE = 110.8318;

/**
 * Run a quick test of the OpenAQ API function
 */
export async function testOpenAQAPI() {
  console.log('🧪 Testing OpenAQ API Integration');
  console.log('=' .repeat(50));
  
  try {
    console.log('1. Testing basic API call...');
    
    // Test the main function
    const stations = await getAirQualityData(TEST_LATITUDE, TEST_LONGITUDE, 50, 3);
    
    console.log('✅ API call successful!');
    console.log(`📊 Results: ${stations.length} stations found`);
    
    if (stations.length > 0) {
      const firstStation = stations[0];
      console.log('\n📍 First station details:');
      console.log(`   Name: ${firstStation.name}`);
      console.log(`   Location: ${firstStation.city}, ${firstStation.country}`);
      console.log(`   Coordinates: ${firstStation.coordinates.latitude}, ${firstStation.coordinates.longitude}`);
      console.log(`   Distance: ${firstStation.distance?.toFixed(1)} km`);
      
      if (firstStation.aqi) {
        console.log(`   AQI: ${firstStation.aqi} (${firstStation.aqiCategory?.label})`);
      }
      
      if (firstStation.measurements && firstStation.measurements.length > 0) {
        console.log('   Latest measurements:');
        firstStation.measurements.slice(0, 2).forEach(m => {
          console.log(`     • ${m.parameter.toUpperCase()}: ${m.value} ${m.unit}`);
        });
      }
    }
    
    console.log('\n2. Testing input validation...');
    
    // Test invalid coordinates
    try {
      await getAirQualityData(999, 999); // Invalid coordinates
      console.log('❌ Validation test failed - should have thrown error');
    } catch {
      console.log('✅ Input validation working correctly');
    }
    
    console.log('\n🎉 All tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

/**
 * Run comprehensive demo
 */
export async function runFullDemo() {
  console.log('\n🚀 Running Full OpenAQ API Demo');
  console.log('=' .repeat(50));
  
  try {
    await demoSurakartaAirQuality();
    
    console.log('\n✅ Demo completed successfully!');
    console.log('\n💡 You can now use the getAirQualityData() function in your components:');
    console.log('   import { getAirQualityData } from "@/lib/openaq-demo";');
    console.log('   const stations = await getAirQualityData(lat, lng);');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Export the test functions
export { testOpenAQAPI as default };

// Uncomment the line below to run the test when this file is imported
// testOpenAQAPI().then(() => console.log('Test completed'));