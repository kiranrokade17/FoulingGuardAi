# 🚢 Intelligent Marine Biofouling Detection & Decision Support System

## 📌 Problem Statement

Marine fouling, also known as biofouling, refers to the undesirable accumulation of microorganisms, plants, algae, and animals on submerged surfaces. This phenomenon occurs in marine environments and impacts various **Indian Navy critical structures**, particularly ships, offshore platforms, and other submerged infrastructure.

Fouling leads to significant operational and economic problems, including:

  - Increased drag
  - Reduced speed
  - Higher fuel consumption
  - Increased maintenance costs
  - Potential introduction of invasive species

### Challenge

Design and develop an **end-to-end intelligent image-based solution** that can:

  - Detect and classify fouling species
  - Estimate fouling density on surfaces
  - Assess its operational impact
  - Recommend cleaning actions

-----

## 💡 Our Solution: End-to-End AI + Visualization System

We propose an **AI-powered decision-support platform** tailored for the **Indian Navy** that not only detects marine fouling but also provides actionable insights and futuristic visualizations. Our system is designed to be **hardware-agnostic**, focusing on the power of software intelligence.

### 🔑 Core Features

1.  **Species Classification** - Detect fouling organisms (barnacles, mussels, algae, tubeworms, invasive species).

      - Model: YOLOv8 / Mask R-CNN.

2.  **Fouling Density Estimation** - Measure % area covered by fouling on the hull surface.

      - Model: U-Net / DeepLabv3+.

3.  **Growth Rate Forecasting** - Predict how fast fouling will worsen under tropical Indian conditions.

      - Model: LSTM / XGBoost (time-series).

4.  **Fuel Cost Impact** - Estimate drag → increased fuel penalty.

      - Regression model trained on naval drag-fuel datasets.

5.  **Criticality Assessment** - Prioritize maintenance based on fouling severity + ship class.

      - Output: Low / Medium / High / Critical.

6.  **Cleaning Recommendation Engine** - Rule-based recommendations:

      - Soft fouling → hull wipe
      - Hard fouling → pressure jet / dry docking
      - Invasive species → quarantine SOP
      - Provides **urgency + method + note** for operators.

7.  **3D & AR Visualization (Wow Factor)** - Convert 2D underwater hull images → 3D meshes using AI (Nano-Banana / NeRF).

      - Render interactive models in **Three.js**.
      - Enable **AR mode (WebXR)** for dockyard crews to view fouling on mobile devices.

8.  **Chatbot Assistant (Gemini-powered)** - Natural language Q\&A for Navy operators.

      - System instruction tuned for Indian Navy terminology.
      - Explains fouling, growth, cost, and cleaning recommendations in simple terms.
      - Multilingual (English + Hindi/Marathi).

-----

## 🛠️ Tech Stack

  - **AI/ML**: PyTorch, YOLOv8, U-Net, XGBoost
  - **Data Handling**: Python, scikit-learn, NumPy, Pandas
  - **3D/AR**: Three.js, WebXR, GLTF/OBJ models
  - **Dashboard**: React + TailwindCSS + Recharts + shadcn/ui
  - **Chatbot**: Gemini API + FastAPI wrapper
  - **Visualization**: Growth graphs, fuel penalty charts, criticality index

-----

## 🌐 System Workflow & Modes

### 1\. **Image Upload Mode (Primary Focus)**

This is our primary workflow, built for practicality and security. It is a **post-inspection analysis system** that is completely hardware-agnostic.

  - **Workflow**:
      - A diver or ROV collects images using any standard camera (e.g., GoPro, commercial underwater camera, or even a smartphone in a waterproof case).
      - The images are uploaded to a secure, on-premise dashboard.
      - The AI models instantly analyze the images, and the results are presented to the operator.

### 2\. **Live Feed Mode (Optional - If Time Permits)**

This is a bonus feature to demonstrate the system's future potential.

  - **Workflow**:
      - The system processes a live video stream from a connected camera.
      - The AI models run in a lighter, optimized mode to provide **real-time detection and classification.**
      - **In the demo**, this feature will be a simple "Live" toggle on the dashboard that simulates real-time analysis using a pre-recorded video or image loop.

-----

## 📊 Example Output JSON

```json
{
  "species_detected": ["Barnacle", "Mussel"],
  "coverage_percent": 34.5,
  "growth_forecast": {
    "7_days": 42.1,
    "30_days": 67.8
  },
  "fuel_penalty": 8.2,
  "criticality": "High",
  "recommendation": {
    "urgency": "High",
    "method": "High-pressure water jet cleaning",
    "note": "Dry-docking within 2 weeks recommended"
  },
  "3d_model_uri": "models/scan123.glb",
  "ar_mode_available": true
}
```