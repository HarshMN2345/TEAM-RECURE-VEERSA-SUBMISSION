import joblib
import sklearn
import warnings
from sklearn.tree import DecisionTreeClassifier

def patch_decision_tree_compatibility():
    """Patch DecisionTreeClassifier to handle version compatibility issues"""
    original_getstate = DecisionTreeClassifier.__getstate__
    original_setstate = DecisionTreeClassifier.__setstate__
    
    def patched_getstate(self):
        # Remove monotonic_cst if it exists when saving
        state = original_getstate(self)
        if hasattr(self, 'monotonic_cst'):
            # Remove it from the state to avoid issues
            pass
        return state
    
    def patched_setstate(self, state):
        # Add monotonic_cst if it's missing when loading
        result = original_setstate(self, state)
        if not hasattr(self, 'monotonic_cst'):
            self.monotonic_cst = None
        return result
    
    DecisionTreeClassifier.__getstate__ = patched_getstate
    DecisionTreeClassifier.__setstate__ = patched_setstate

def load_model_with_compatibility(model_path):
    """Load model with version compatibility handling"""
    print(f"Scikit-learn version: {sklearn.__version__}")
    
    # Apply compatibility patch
    patch_decision_tree_compatibility()
    
    try:
        print("Loading model with compatibility patches...")
        
        # Suppress version warnings
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=UserWarning)
            model_bundle = joblib.load(model_path)
        
        model = model_bundle["model"]
        feature_order = model_bundle["features"]
        
        # Patch any existing decision trees in the model
        if hasattr(model, 'estimators_'):
            for estimator in model.estimators_:
                if hasattr(estimator, 'tree_') and not hasattr(estimator, 'monotonic_cst'):
                    estimator.monotonic_cst = None
        
        print("✅ Model loaded successfully with compatibility patches!")
        return model, feature_order
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, None 