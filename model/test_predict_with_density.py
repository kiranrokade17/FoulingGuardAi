#!/usr/bin/env python3
"""
Test script to verify that /predict endpoint uses density calculation from Otsu thresholding
"""

import requests
import json

# Test image URLs - various hull fouling images
test_images = [
    "https://media.istockphoto.com/id/177421147/photo/tugboat-hull.jpg?s=612x612&w=0&k=20&c=d--GjX7W9qhMdFo3EF5PB7TkdgdKtGlV6RxCRHWl1A4=",
    "https://www.shutterstock.com/image-photo/hull-ship-underwater-fouling-marine-260nw-1158623732.jpg",
    "https://thumbs.dreamstime.com/z/old-ship-hull-covered-marine-growth-barnacles-underwater-old-ship-hull-covered-marine-growth-barnacles-126140410.jpg"
]

def test_predict_endpoint():
    """Test the /predict endpoint to verify density calculation integration"""
    
    print("🧪 Testing /predict endpoint with density calculation...")
    print("="*60)
    
    # Test each image
    for i, image_url in enumerate(test_images, 1):
        print(f"\n🖼️  Test {i}: Testing with image URL")
        print(f"URL: {image_url[:60]}...")
        
        try:
            # Call the /predict endpoint
            response = requests.post('http://localhost:5001/predict', 
                json={'image': image_url},
                timeout=30
            )
            
            print(f"📡 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get('success'):
                    analysis = result.get('analysis', {})
                    
                    print("✅ Prediction Results:")
                    print(f"   Species: {analysis.get('species', 'N/A')}")
                    print(f"   Density: {analysis.get('density', 'N/A')}%")
                    print(f"   Coverage (backward compat): {analysis.get('coverage', 'N/A')}%")
                    print(f"   Criticality: {analysis.get('criticality', 'N/A')}")
                    print(f"   Confidence: {analysis.get('confidence', 'N/A')}")
                    
                    # Check if density details are included (from Otsu thresholding)
                    density_details = analysis.get('density_details')
                    if density_details:
                        print("📊 Density Calculation Details (Otsu Thresholding):")
                        print(f"   Total Pixels: {density_details.get('total_pixels', 'N/A')}")
                        print(f"   Fouled Pixels: {density_details.get('fouled_pixels', 'N/A')}")
                        print(f"   Density Percentage: {density_details.get('density_percentage', 'N/A')}%")
                        print(f"   Threshold Value: {density_details.get('threshold', 'N/A')}")
                        print(f"   Severity: {density_details.get('severity', 'N/A')}")
                        print("✅ DENSITY CALCULATION FROM OTSU THRESHOLDING IS WORKING!")
                    else:
                        print("⚠️  No density details found - may be using fallback method")
                        
                else:
                    print(f"❌ Prediction failed: {result.get('error', 'Unknown error')}")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                try:
                    error_details = response.json()
                    print(f"   Details: {error_details}")
                except:
                    print(f"   Details: {response.text}")
                    
        except requests.exceptions.Timeout:
            print("⏰ Request timed out")
        except requests.exceptions.ConnectionError:
            print("🔌 Connection error - is the Flask service running?")
        except Exception as e:
            print(f"🔥 Unexpected error: {e}")
    
    print("\n" + "="*60)
    print("🏁 Test completed!")

if __name__ == "__main__":
    test_predict_endpoint()