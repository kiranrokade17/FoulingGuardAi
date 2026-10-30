# FoulingGuard AI - Density Calculation Implementation

## Overview
Successfully implemented density calculation using Otsu thresholding algorithm as requested, replacing coverage with density-based calculations.

## Key Changes Made

### 1. Model Service (Flask API) - `model/app.py`

#### New Features:
- **Density Calculation Function**: `calculate_fouling_density()`
  - Uses Otsu thresholding algorithm (same as Google Colab approach)
  - Converts image to grayscale
  - Applies automatic threshold detection
  - Calculates pixel density ratio
  - Returns comprehensive density metrics

- **New API Endpoint**: `/calculate-density`
  - Dedicated endpoint for pure density calculation
  - Returns severity levels (Critical/High/Moderate/Low)
  - Provides recommendations based on density
  - Includes fuel impact estimates

#### Updated Features:
- **Enhanced Prediction Function**: `predict_fouling()`
  - Now uses density instead of coverage
  - Integrates Otsu thresholding with species detection
  - Maintains backward compatibility with existing client
  - Provides both density and coverage fields in response

### 2. Server API - `server/routes/ai.js`

#### New Endpoint:
- **POST `/api/ai/calculate-density`**: 
  - Proxies requests to Flask model service
  - Handles errors and service unavailability
  - Returns standardized JSON responses

### 3. Client Application - React Components

#### New Page: `DensityCalculation.tsx`
- **Dedicated density calculator interface**
- **Visual density analysis with progress bars**
- **Color-coded severity indicators**
- **Detailed metrics display**:
  - Total pixels analyzed
  - Fouling pixels detected
  - Algorithm used (Otsu)
  - Fuel impact estimates
- **Recommendations panel**
- **Educational information about Otsu thresholding**

#### Updated Navigation:
- Added "Density Calculator" to sidebar and bottom bar
- New route: `/density-calculation`

## Technical Implementation Details

### Density Calculation Algorithm (Otsu Thresholding)
```python
# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

# Apply Otsu thresholding
_, mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

# Calculate density ratio
density = mask.sum() / (mask.size * 255) * 100
```

### API Response Structure

#### Density Endpoint Response:
```json
{
  "success": true,
  "density_analysis": {
    "density_percentage": 45.67,
    "severity": "High",
    "recommendation": "Cleaning recommended within 1-2 weeks",
    "total_pixels": 480000,
    "fouling_pixels": 219216,
    "threshold_method": "otsu",
    "fuel_impact_estimate": 18,
    "cleaning_urgency": "high"
  }
}
```

#### Enhanced Species Prediction Response:
```json
{
  "analysis": {
    "species": "Balanus Amphitrite",
    "density": 45.67,
    "coverage": 45.67,  // Backward compatibility
    "criticality": "High",
    "confidence": 0.89,
    "density_details": {
      "total_pixels": 480000,
      "fouling_pixels": 219216,
      "threshold_method": "otsu"
    }
  }
}
```

## Severity Classification
- **Critical (>70%)**: Immediate cleaning required
- **High (40-70%)**: Cleaning recommended within 1-2 weeks  
- **Moderate (20-40%)**: Monitor and plan cleaning within 1 month
- **Low (<20%)**: Routine monitoring sufficient

## Usage Examples

### Direct Density Calculation:
```bash
POST /api/ai/calculate-density
{
  "image": "data:image/jpeg;base64,..."
}
```

### Species Detection with Density:
```bash  
POST /api/ai/analyze
{
  "image": "data:image/jpeg;base64,...",
  "location": {"lat": 40.7128, "lng": -74.0060},
  "vessel": "MV Ocean Explorer"
}
```

## Benefits of Otsu Thresholding
1. **Fully Automated**: No manual parameter tuning required
2. **Consistent Results**: Works across different lighting conditions
3. **Industry Standard**: Widely used in image processing
4. **Optimal Threshold**: Mathematically determines best separation point
5. **Reproducible**: Same image always produces same results

## Testing
- Created `test_density.py` for endpoint validation
- Supports both URL and base64 image inputs  
- Comprehensive error handling and logging
- Health check integration

## Backward Compatibility
- Existing client code continues to work
- Coverage field maintained alongside density
- All existing endpoints remain functional
- Gradual migration path available

This implementation successfully replaces coverage calculations with precise density measurements using the same Otsu thresholding approach demonstrated in your Google Colab code.