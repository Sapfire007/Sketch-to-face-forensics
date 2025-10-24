# Error Handling Guide for Sketch-to-Face Forensics Notebook

This guide provides comprehensive error handling solutions for the Sketch-to-Face Forensics notebook to make it more robust and user-friendly.

## Import Statements

Add try-except blocks around import statements to automatically install missing dependencies:

```python
# Example for OpenCV
try:
    import cv2
except ImportError:
    !pip install opencv-python
    import cv2
```

## Path Handling

Add checks for directory existence and create directories if they don't exist:

```python
# Example for checking and creating directories
import os

# For image and sketch paths
if not os.path.exists(img_path):
    print(f"⚠️ Warning: Image path {img_path} does not exist. Creating directory...")
    os.makedirs(img_path, exist_ok=True)

if not os.path.exists(sketch_path):
    print(f"⚠️ Warning: Sketch path {sketch_path} does not exist. Creating directory...")
    os.makedirs(sketch_path, exist_ok=True)
```

## Image Loading and Processing

Add error handling to image loading and processing functions:

```python
def load_and_preprocess_image(image_path, size=(256, 256)):
    """Load and preprocess an image with error handling."""
    try:
        # Check if file exists
        if not os.path.exists(image_path):
            print(f"❌ Error: Image file not found at {image_path}")
            return None
            
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            print(f"❌ Error: Failed to load image at {image_path}")
            return None
            
        # Resize image
        try:
            img = cv2.resize(img, size)
        except Exception as e:
            print(f"❌ Error resizing image: {str(e)}")
            return None
            
        # Convert color
        try:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        except Exception as e:
            print(f"❌ Error converting color: {str(e)}")
            return None
            
        return img
        
    except Exception as e:
        print(f"❌ Unexpected error processing image {image_path}: {str(e)}")
        return None
```

## Data Augmentation

Add error handling to the augmentation function:

```python
def augment_image(image, max_augmentations=5):
    """Apply augmentations to an image with error handling."""
    if image is None or not isinstance(image, np.ndarray):
        print("❌ Error: Invalid image input for augmentation")
        return None
        
    try:
        # Original image is always included
        augmented_images = [image]
        
        # Geometric augmentations
        try:
            # Horizontal flip
            augmented_images.append(cv2.flip(image, 1))
            
            # Rotations
            if len(augmented_images) < max_augmentations:
                for angle in [5, -5, 10, -10]:
                    if len(augmented_images) >= max_augmentations:
                        break
                    h, w = image.shape[:2]
                    M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1)
                    rotated = cv2.warpAffine(image, M, (w, h))
                    augmented_images.append(rotated)
        except Exception as e:
            print(f"⚠️ Warning: Geometric augmentation failed: {str(e)}")
            
        # Photometric augmentations
        try:
            if len(augmented_images) < max_augmentations:
                # Brightness and contrast
                for alpha in [0.9, 1.1]:  # Contrast
                    for beta in [-10, 10]:  # Brightness
                        if len(augmented_images) >= max_augmentations:
                            break
                        adjusted = cv2.convertScaleAbs(image, alpha=alpha, beta=beta)
                        augmented_images.append(adjusted)
        except Exception as e:
            print(f"⚠️ Warning: Photometric augmentation failed: {str(e)}")
            
        # Noise and blur
        try:
            if len(augmented_images) < max_augmentations:
                # Add slight Gaussian noise
                noise = np.random.normal(0, 5, image.shape).astype(np.uint8)
                noisy_img = cv2.add(image, noise)
                augmented_images.append(noisy_img)
                
                # Add slight blur
                if len(augmented_images) < max_augmentations:
                    blurred = cv2.GaussianBlur(image, (5, 5), 0)
                    augmented_images.append(blurred)
        except Exception as e:
            print(f"⚠️ Warning: Noise/blur augmentation failed: {str(e)}")
            
        # Limit to max_augmentations
        augmented_images = augmented_images[:max_augmentations]
        
        # Normalize to 0-1 range
        try:
            normalized_images = [img.astype('float32') / 255.0 for img in augmented_images]
            return normalized_images
        except Exception as e:
            print(f"⚠️ Warning: Normalization failed: {str(e)}. Returning unnormalized images.")
            return augmented_images
            
    except Exception as e:
        print(f"❌ Error during image augmentation: {str(e)}")
        # Return original image if augmentation fails
        try:
            return [image.astype('float32') / 255.0]
        except:
            return [image]
```

## Visualization Functions

Add error handling to plotting functions:

```python
def plot_images(real_img, sketch_img, figsize=(10, 5)):
    """Plot real and sketch images with error handling."""
    try:
        # Check for None images
        if real_img is None or sketch_img is None:
            print("❌ Error: Cannot plot None images")
            return
            
        # Check image types
        if not isinstance(real_img, np.ndarray) or not isinstance(sketch_img, np.ndarray):
            print("❌ Error: Images must be numpy arrays")
            return
            
        plt.figure(figsize=figsize)
        
        # Plot real image
        try:
            plt.subplot(1, 2, 1)
            plt.imshow(real_img)
            plt.title('Real Image')
            plt.axis('off')
        except Exception as e:
            print(f"❌ Error plotting real image: {str(e)}")
            
        # Plot sketch image
        try:
            plt.subplot(1, 2, 2)
            plt.imshow(sketch_img, cmap='gray')
            plt.title('Sketch Image')
            plt.axis('off')
        except Exception as e:
            print(f"❌ Error plotting sketch image: {str(e)}")
            
        plt.tight_layout()
        plt.show()
        
    except Exception as e:
        print(f"❌ Error in plot_images function: {str(e)}")
```

## Data Saving Operations

Add error handling to data saving operations:

```python
# Save processed data
try:
    # Create directory if it doesn't exist
    save_dir = '/content/drive/MyDrive/sketch-to-face-dataset/CodeSaveData/'
    os.makedirs(save_dir, exist_ok=True)
    
    # Save face images
    try:
        np.save(save_dir + 'real_images.npy', np.array(img_array))
        print("✅ Face images saved successfully!")
    except Exception as e:
        print(f"❌ Error saving face images: {str(e)}")
    
    # Save sketch images
    try:
        np.save(save_dir + 'sketch_images.npy', np.array(sketch_array))
        print("✅ Sketch images saved successfully!")
    except Exception as e:
        print(f"❌ Error saving sketch images: {str(e)}")
        
except Exception as e:
    print(f"❌ Unexpected error during data saving: {str(e)}")
```

## Model Training Code

Add error handling to model training:

```python
# Model training with error handling
try:
    # Create and compile model
    try:
        model = create_model()
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5),
            loss='mse'
        )
        print("✅ Model created and compiled successfully")
    except Exception as e:
        print(f"❌ Error creating/compiling model: {str(e)}")
        raise e
        
    # Train model
    try:
        history = model.fit(
            train_dataset,
            epochs=epochs,
            validation_data=val_dataset,
            callbacks=[
                tf.keras.callbacks.ModelCheckpoint(
                    filepath=checkpoint_path,
                    save_best_only=True,
                    monitor='val_loss'
                ),
                tf.keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=10,
                    restore_best_weights=True
                )
            ]
        )
        print("✅ Model training completed successfully")
    except Exception as e:
        print(f"❌ Error during model training: {str(e)}")
        
    # Save model
    try:
        model.save(model_save_path)
        print(f"✅ Model saved successfully to {model_save_path}")
    except Exception as e:
        print(f"❌ Error saving model: {str(e)}")
        # Try alternative saving method
        try:
            model.save_weights(model_save_path + "_weights")
            print(f"✅ Model weights saved to {model_save_path}_weights")
        except Exception as e2:
            print(f"❌ Error saving model weights: {str(e2)}")
            
except Exception as e:
    print(f"❌ Unexpected error in model training process: {str(e)}")
```

## General Best Practices

1. **Always check file existence** before attempting to read files
2. **Validate input data** before processing
3. **Use descriptive error messages** that help identify the problem
4. **Provide fallback options** when possible
5. **Create directories** automatically when needed
6. **Handle specific exceptions** first, then catch general exceptions
7. **Add logging** for better debugging
8. **Use emojis** (✅, ❌, ⚠️) to make error messages more visible

By implementing these error handling patterns throughout your notebook, you'll create a more robust and user-friendly experience that can recover from common issues and provide helpful feedback when problems occur.