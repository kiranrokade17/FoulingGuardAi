#!/usr/bin/env python3
"""
Test script to directly test the density calculation function
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import calculate_fouling_density

def test_density_calculation():
    """Test the density calculation function directly"""
    
    print("🧪 Testing calculate_fouling_density function directly...")
    print("="*60)
    
    # Test image URL
    test_image = "https://thumbs.dreamstime.com/z/old-ship-hull-covered-marine-growth-barnacles-underwater-old-ship-hull-covered-marine-growth-barnacles-126140410.jpg"
    
    print(f"🖼️  Testing with: {test_image[:60]}...")
    
    try:
        result = calculate_fouling_density(test_image)
        
        print("📊 Raw density calculation result:")
        print(f"   Success: {result.get('success')}")
        print(f"   Density: {result.get('density_percentage')}%")
        print(f"   Total pixels: {result.get('total_pixels')}")
        print(f"   Fouling pixels: {result.get('fouling_pixels')}")
        print(f"   Method: {result.get('threshold_method')}")
        
        if result.get('success'):
            print("✅ DENSITY CALCULATION IS WORKING!")
        else:
            print("❌ Density calculation failed")
            
    except Exception as e:
        print(f"🔥 Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_density_calculation()