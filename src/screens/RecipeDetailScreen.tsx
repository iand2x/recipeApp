import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Recipe } from '../models/Recipe';
import { useRecipes, useImagePicker, useRecipeForm } from '../hooks';
import { UrlInputModal } from '../components/UrlInputModal';
import { EditableStep } from '../components/EditableStep';

const RecipeDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RecipeDetail'>>();
  const navigation = useNavigation();
  const { recipe } = route.params;

  const { updateExistingRecipe, removeRecipe } = useRecipes();
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
    updateImage,
    addIngredient,
    removeIngredient,
    addStep,
    updateStep,
    removeStep,
    moveStep,
    insertStepAt,
    validateForm,
    setFormData,
  } = useRecipeForm({
    name: recipe.name,
    typeId: recipe.typeId,
    image: recipe.image,
    ingredients: [...recipe.ingredients],
    steps: [...recipe.steps],
  });

  const [ingredientInput, setIngredientInput] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleMoveStepUp = (index: number) => {
    if (index > 0) {
      moveStep(index, index - 1);
    }
  };

  const handleMoveStepDown = (index: number) => {
    if (index < formData.steps.length - 1) {
      moveStep(index, index + 1);
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
      const updatedRecipe: Recipe = {
        id: recipe.id,
        name: formData.name,
        typeId: formData.typeId,
        image: formData.image,
        ingredients: formData.ingredients,
        steps: formData.steps,
      };

      await updateExistingRecipe(updatedRecipe);
      setIsEditing(false);
      Alert.alert('Success', 'Recipe updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (isDeleting) return; // Prevent double submission

    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await removeRecipe(recipe.id);
              Alert.alert('Success', 'Recipe deleted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to delete recipe. Please try again.',
              );
              console.error('Delete error:', error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleCancel = () => {
    // Reset form to original recipe data
    setFormData({
      name: recipe.name,
      typeId: recipe.typeId,
      image: recipe.image,
      ingredients: [...recipe.ingredients],
      steps: [...recipe.steps],
    });
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with action buttons */}
      <View style={styles.header}>
        {!isEditing ? (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                isDeleting && styles.deleteButtonDisabled,
              ]}
              onPress={handleDelete}
              disabled={isDeleting}>
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (isSaving || isDeleting) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving || isDeleting}>
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recipe Image */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={isEditing ? handleImageSelect : undefined}
          disabled={!isEditing}>
          <Image source={{ uri: formData.image }} style={styles.recipeImage} />
          {isEditing && (
            <View style={styles.imageOverlay}>
              <Text style={styles.imageOverlayText}>Tap to change image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Recipe Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Recipe Name</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={updateName}
            placeholder="Enter recipe name"
          />
        ) : (
          <Text style={styles.displayText}>{formData.name}</Text>
        )}
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Ingredients */}
      <View style={styles.section}>
        <Text style={styles.label}>Ingredients</Text>
        {isEditing && (
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
        )}

        {formData.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemText}>• {ingredient}</Text>
            {isEditing && (
              <TouchableOpacity onPress={() => removeIngredient(index)}>
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Steps */}
      <View style={styles.section}>
        <Text style={styles.label}>Instructions</Text>
        {isEditing && (
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
        )}

        {formData.steps.map((step, index) =>
          isEditing ? (
            <EditableStep
              key={index}
              step={step}
              index={index}
              onUpdate={updateStep}
              onRemove={removeStep}
              onInsertBefore={insertStepAt}
              onMoveUp={handleMoveStepUp}
              onMoveDown={handleMoveStepDown}
              isFirst={index === 0}
              isLast={index === formData.steps.length - 1}
            />
          ) : (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemText}>
                {index + 1}. {step}
              </Text>
            </View>
          ),
        )}
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButtons: { flexDirection: 'row', gap: 10 },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  imageContainer: { padding: 16 },
  imageButton: { position: 'relative' },
  recipeImage: { width: '100%', height: 200, borderRadius: 12 },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imageOverlayText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  section: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
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
  displayText: { fontSize: 16, color: '#333', lineHeight: 24 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: { flex: 1, fontSize: 15, color: '#333', lineHeight: 22 },
  removeButton: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
  },
});

export default RecipeDetailScreen;
