import requests
import base64
import json

def test_density_endpoint():
    """Test the density calculation endpoint"""
    # Create a simple test image (you can replace this with actual image data)
    test_image_url = "https://img.algaebase.org/images/3EE735B10772e03B98sqj3122695/64RQTGia4o5F.jpg"  # Replace with actual image
    
    # Test data
    test_data = {
        "image": test_image_url  # You can also use base64 encoded image data
    }
    
    try:
        # Test density calculation endpoint
        print("🧪 Testing density calculation endpoint...")
        response = requests.post(
            'http://localhost:5001/calculate-density',
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Density calculation successful:")
            print(f"   Density: {result['density_analysis']['density_percentage']}%")
            print(f"   Severity: {result['density_analysis']['severity']}")
            print(f"   Recommendation: {result['density_analysis']['recommendation']}")
            print(f"   Fuel Impact: +{result['density_analysis']['fuel_impact_estimate']}%")
        else:
            print(f"❌ Density calculation failed: {response.status_code}")
            print(f"   Error: {response.text}")
    
    except Exception as e:
        print(f"❌ Test error: {e}")

def test_predict_endpoint():
    """Test the updated predict endpoint with density"""
    test_image_url = "https://img.algaebase.org/images/3EE735B10772e03B98sqj3122695/64RQTGia4o5F.jpg"  # Same working image
    
    test_data = {
        "image": test_image_url
    }
    
    try:
        # Test species prediction + density endpoint
        print("\n🧪 Testing species prediction with density...")
        response = requests.post(
            'http://localhost:5001/predict',
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            analysis = result['analysis']
            print("✅ Species prediction with density successful:")
            print(f"   Species: {analysis['species']}")
            print(f"   Density: {analysis['density']}%")
            print(f"   Coverage (backward compatibility): {analysis['coverage']}%")
            print(f"   Criticality: {analysis['criticality']}")
            print(f"   Confidence: {analysis['confidence']}")
            print(f"   Fuel Penalty: +{analysis['fuelPenalty']}%")
            if analysis.get('density_details'):
                print(f"   Otsu Details: {analysis['density_details']}")
        else:
            print(f"❌ Species prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
    
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    print("🚀 Testing FoulingGuard AI Density Calculation")
    print("=" * 50)
    
    # Test health endpoint first
    try:
        response = requests.get('http://localhost:5001/health', timeout=5)
        if response.status_code == 200:
            health = response.json()
            print("✅ Service is healthy")
            print(f"   Model loaded: {health['model_loaded']}")
            print(f"   Device: {health['device']}")
            print(f"   Mode: {health['mode']}")
        else:
            print("❌ Service health check failed")
            exit(1)
    except:
        print("❌ Cannot connect to service. Make sure it's running on port 5001")
        exit(1)
    
    # Run tests
    test_density_endpoint()
    test_predict_endpoint()
    
    print("\n✅ All tests completed!")