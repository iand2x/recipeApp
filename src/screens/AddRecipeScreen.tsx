import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
// Ensure crypto polyfill is available
import 'react-native-get-random-values';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { addRecipe } from '../storage/storage';
import { Recipe } from '../models/Recipe';
import recipeTypes from '../data/recipetypes.json';

// Simple UUID generator fallback
const generateSimpleId = () => {
  return 'recipe_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
};

const AddRecipeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState(recipeTypes[0].id);
  const [image, setImage] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');


  const generateId = () => {
    try {
      return uuidv4();
    } catch (error) {
      console.warn('UUID generation failed, using fallback:', error);
      return generateSimpleId();
    }
  };

  const selectImage = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'URL', onPress: () => {} }, // Keep existing URL input
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri || '';
          setSelectedImageUri(imageUri);
          setImage(imageUri); // Use local file path as image source
        }
      }
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri || '';
          setSelectedImageUri(imageUri);
          setImage(imageUri); // Use local file path as image source
        }
      }
    );
  };

  const handleSave = async () => {
    if (!name || !image || !ingredients || !steps) {
      Alert.alert('Please fill in all fields');
      return;
    }
    
    const processedIngredients = ingredients.split('\n').filter(i => i.trim());
    const processedSteps = steps.split('\n').filter(s => s.trim());
    
    const recipeId = generateId();

    const newRecipe: Recipe = {
      id: recipeId,
      name,
      typeId,
      image,
      ingredients: processedIngredients,
      steps: processedSteps,
    };

    try {
      await addRecipe(newRecipe);
      navigation.goBack();
    } catch (error) {

      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Type</Text>
      <Picker selectedValue={typeId} onValueChange={setTypeId} style={styles.picker}>
        {recipeTypes.map(type => (
          <Picker.Item label={type.name} value={type.id} key={type.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Image</Text>
      <View style={styles.imageSection}>
        <TextInput 
          style={styles.input} 
          value={image} 
          onChangeText={setImage}
          placeholder="Enter image URL or use upload button"
        />
        <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
          <Text style={styles.uploadButtonText}>📷 Upload Image</Text>
        </TouchableOpacity>
      </View>
      
      {(selectedImageUri || image) && (
        <View style={styles.imagePreview}>
          <Text style={styles.previewLabel}>Image Preview:</Text>
          <Image 
            source={{ uri: selectedImageUri || image }} 
            style={styles.previewImage}
            onError={() => console.log('Failed to load image')}
          />
        </View>
      )}

      <Text style={styles.label}>Ingredients (one per line)</Text>
      <TextInput style={styles.textarea} value={ingredients} onChangeText={setIngredients} multiline />

      <Text style={styles.label}>Steps (one per line)</Text>
      <TextInput style={styles.textarea} value={steps} onChangeText={setSteps} multiline />

      <Button title="Save Recipe" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 20 },
  label: { marginTop: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    minHeight: 80,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 8,
  },
  imageSection: {
    marginTop: 8,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 16,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default AddRecipeScreen;