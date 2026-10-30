#!/usr/bin/env python3
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def main():
    print("🚀 Starting FoulingGuard AI Model Service")
    
    # Check if requirements.txt exists
    if os.path.exists('requirements.txt'):
        print("📦 Installing requirements...")
        if not install_requirements():
            return
    
    # Start the Flask app
    try:
        from app import app
        print("🤖 Model service starting on http://localhost:5001")
        app.run(host='0.0.0.0', port=5001, debug=False)
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Please install requirements first: pip install -r requirements.txt")
    except Exception as e:
        print(f"❌ Error starting service: {e}")

if __name__ == '__main__':
    main()