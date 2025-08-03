import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Recipe } from '../models/Recipe';
import recipeTypes from '../data/recipetypes.json';
import { useRecipes, useImagePicker, useRecipeForm } from '../hooks';
import { UrlInputModal } from '../components/UrlInputModal';

const AddRecipeScreen = () => {
  const navigation = useNavigation();
  const { addNewRecipe } = useRecipes();
  const {
    selectedImage,
    showImagePicker,
    showUrlModal,
    handleUrlModalSubmit,
    handleUrlModalCancel,
  } = useImagePicker();
  const {
    formData,
    errors,
    updateName,
    updateTypeId,
    updateImage,
    addIngredient,
    removeIngredient,
    addStep,
    removeStep,
    validateForm,
    generateId,
  } = useRecipeForm();

  const [ingredientInput, setIngredientInput] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update form image when selectedImage changes
  useEffect(() => {
    if (selectedImage) {
      updateImage(selectedImage);
    }
  }, [selectedImage, updateImage]);

  const handleImageSelect = async () => {
    await showImagePicker();
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      addIngredient(ingredientInput);
      setIngredientInput('');
    }
  };

  const handleAddStep = () => {
    if (stepInput.trim()) {
      addStep(stepInput);
      setStepInput('');
    }
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent double submission

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      const newRecipe: Recipe = {
        id: generateId(),
        name: formData.name,
        typeId: formData.typeId,
        image: formData.image,
        ingredients: formData.ingredients,
        steps: formData.steps,
      };

      await addNewRecipe(newRecipe);
      Alert.alert('Success', 'Recipe added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Recipe Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={updateName}
          placeholder="Enter recipe name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Recipe Type</Text>
        <Picker
          selectedValue={formData.typeId}
          onValueChange={updateTypeId}
          style={styles.picker}>
          {recipeTypes.map(type => (
            <Picker.Item key={type.id} label={type.name} value={type.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Recipe Image *</Text>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleImageSelect}>
          {formData.image ? (
            <Image
              source={{ uri: formData.image }}
              style={styles.selectedImage}
            />
          ) : (
            <Text style={styles.imageButtonText}>Tap to Select Image</Text>
          )}
        </TouchableOpacity>
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Ingredients *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={ingredientInput}
            onChangeText={setIngredientInput}
            placeholder="Add ingredient"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddIngredient}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {errors.ingredients && (
          <Text style={styles.errorText}>{errors.ingredients}</Text>
        )}

        {formData.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemText}>• {ingredient}</Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Steps *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={stepInput}
            onChangeText={setStepInput}
            placeholder="Add cooking step"
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {errors.steps && <Text style={styles.errorText}>{errors.steps}</Text>}

        {formData.steps.map((step, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemText}>
              {index + 1}. {step}
            </Text>
            <TouchableOpacity onPress={() => removeStep(index)}>
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isSaving ? 'Saving...' : 'Save Recipe'}
          onPress={handleSave}
          disabled={isSaving}
        />
      </View>

      <UrlInputModal
        visible={showUrlModal}
        onSubmit={handleUrlModalSubmit}
        onCancel={handleUrlModalCancel}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: { borderColor: '#d32f2f' },
  errorText: { color: '#d32f2f', fontSize: 12, marginTop: 4 },
  picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  imageButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imageButtonText: { color: '#666', fontSize: 16 },
  selectedImage: { width: '100%', height: '100%', borderRadius: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flexInput: { flex: 1 },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginTop: 8,
  },
  listItemText: { flex: 1, fontSize: 14, color: '#333' },
  removeButton: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
  },
  buttonContainer: { marginVertical: 20 },
});

export default AddRecipeScreen;
