import torch
import torch.nn as nn
import torchvision.models as models

class BiofoulingModel(nn.Module):
    def __init__(self, num_classes=10):
        super(BiofoulingModel, self).__init__()
        
        # ResNet50 backbone (based on your state_dict structure)
        self.backbone = models.resnet50(pretrained=False)
        
        # Remove the original classifier
        self.backbone.fc = nn.Identity()
        
        # Get feature size (2048 for ResNet50)
        feature_size = 2048
        
        # Classification head for species (10 classes)
        self.classifier = nn.Linear(feature_size, num_classes)
        
        # Regression head for coverage percentage
        self.regressor = nn.Linear(feature_size, 1)
        
    def forward(self, x):
        # Extract features
        features = self.backbone(x)
        
        # Species classification
        species_logits = self.classifier(features)
        
        # Coverage regression
        coverage = self.regressor(features)
        
        return species_logits, coverage

def load_trained_model(model_path, device, num_classes=10):
    """Load the trained model with weights"""
    try:
        # Create model architecture
        model = BiofoulingModel(num_classes=num_classes)
        
        # Load state dict
        state_dict = torch.load(model_path, map_location=device, weights_only=True)
        
        # Load weights into model
        model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        
        print(f"✅ Model architecture created and weights loaded successfully")
        return model
        
    except Exception as e:
        print(f"❌ Error loading model architecture: {e}")
        return None