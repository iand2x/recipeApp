import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { RootStackParamList } from '../types/navigation';
import { getRecipes, saveRecipes } from '../storage/storage';
import { Recipe } from '../models/Recipe';

const RecipeDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RecipeDetail'>>();
  const navigation = useNavigation();
  const { recipe } = route.params;

  const [name, setName] = useState(recipe.name);
  const [image, setImage] = useState(recipe.image);
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const [ingredients, setIngredients] = useState([...recipe.ingredients]);
  const [steps, setSteps] = useState([...recipe.steps]);

  const selectImage = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to update the image',
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
          setImage(imageUri);
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
          setImage(imageUri);
        }
      }
    );
  };

  const updateRecipe = async () => {
    const updated: Recipe = { ...recipe, name, image, ingredients, steps };
    const existing = await getRecipes();
    const updatedList = existing.map((r: Recipe) => (r.id === recipe.id ? updated : r));
    await saveRecipes(updatedList);
    Alert.alert('Success', 'Recipe updated successfully.');
    navigation.goBack();
  };

  const deleteRecipe = async () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const existing = await getRecipes();
          const filtered = existing.filter((r: Recipe) => r.id !== recipe.id);
          await saveRecipes(filtered);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Image</Text>
      <View style={styles.imageSection}>
        <TextInput 
          value={image} 
          onChangeText={setImage} 
          style={styles.input}
          placeholder="Enter image URL or use upload button"
        />
        <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
          <Text style={styles.uploadButtonText}>📷 Update Image</Text>
        </TouchableOpacity>
      </View>
      
      {(selectedImageUri || image) && (
        <View style={styles.imagePreview}>
          <Text style={styles.previewLabel}>Current Image:</Text>
          <Image 
            source={{ uri: selectedImageUri || image }} 
            style={styles.previewImage}
            onError={() => console.log('Failed to load image')}
          />
        </View>
      )}

      <Text style={styles.label}>Ingredients</Text>
      {ingredients.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <TextInput
            value={item}
            onChangeText={(text) => {
              const copy = [...ingredients];
              copy[index] = text;
              setIngredients(copy);
            }}
            style={styles.itemInput}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              const copy = [...ingredients];
              copy.splice(index, 1);
              setIngredients(copy);
            }}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Ingredient" onPress={() => setIngredients([...ingredients, ''])} />

      <Text style={styles.label}>Steps</Text>
      {steps.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <TextInput
            value={item}
            onChangeText={(text) => {
              const copy = [...steps];
              copy[index] = text;
              setSteps(copy);
            }}
            style={styles.itemInput}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              const copy = [...steps];
              copy.splice(index, 1);
              setSteps(copy);
            }}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Step" onPress={() => setSteps([...steps, ''])} />

      <View style={styles.buttonRow}>
        <Button title="Update" onPress={updateRecipe} />
        <Button title="Delete" onPress={deleteRecipe} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  imageSection: {
    marginTop: 5,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  itemInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RecipeDetailScreen;