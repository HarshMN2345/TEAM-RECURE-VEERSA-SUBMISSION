import numpy as np
from model_loader import load_model_with_compatibility

# Test the compatibility loader
model, feature_order = load_model_with_compatibility("best_clf.pkl")

if model is not None and feature_order is not None:
    print(f"Model type: {type(model)}")
    print(f"Number of features: {len(feature_order)}")
    
    # Test prediction with dummy data
    X_test = np.zeros((1, len(feature_order)))
    try:
        prediction = model.predict_proba(X_test)
        print(f"✅ Test prediction successful: {prediction[0][1]*100:.2f}%")
        print("🎉 Model is working correctly!")
    except Exception as e:
        print(f"❌ Prediction error: {e}")
else:
    print("❌ Model failed to load") 