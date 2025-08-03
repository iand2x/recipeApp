import { useState, useCallback } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface RecipeFormData {
  name: string;
  typeId: string;
  image: string;
  ingredients: string[];
  steps: string[];
}

export const useRecipeForm = (initialData?: Partial<RecipeFormData>) => {
  const [formData, setFormDataState] = useState<RecipeFormData>({
    name: initialData?.name || '',
    typeId: initialData?.typeId || '1',
    image: initialData?.image || '',
    ingredients: initialData?.ingredients || [],
    steps: initialData?.steps || [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RecipeFormData, string>>
  >({});

  // Simple UUID generator fallback
  const generateSimpleId = useCallback(() => {
    return (
      'recipe_' +
      Date.now().toString(36) +
      '_' +
      Math.random().toString(36).substr(2, 9)
    );
  }, []);

  const generateId = useCallback(() => {
    try {
      return uuidv4();
    } catch (error) {
      console.warn('UUID generation failed, using fallback:', error);
      return generateSimpleId();
    }
  }, [generateSimpleId]);

  const updateField = useCallback(
    <K extends keyof RecipeFormData>(field: K, value: RecipeFormData[K]) => {
      setFormDataState(prev => ({ ...prev, [field]: value }));
      // Clear error when field is updated
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const updateName = useCallback(
    (name: string) => {
      updateField('name', name);
    },
    [updateField],
  );

  const updateTypeId = useCallback(
    (typeId: string) => {
      updateField('typeId', typeId);
    },
    [updateField],
  );

  const updateImage = useCallback(
    (image: string) => {
      updateField('image', image);
    },
    [updateField],
  );

  const updateIngredients = useCallback(
    (ingredients: string[]) => {
      updateField('ingredients', ingredients);
    },
    [updateField],
  );

  const updateSteps = useCallback(
    (steps: string[]) => {
      updateField('steps', steps);
    },
    [updateField],
  );

  const addIngredient = useCallback((ingredient: string) => {
    if (ingredient.trim()) {
      setFormDataState(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient.trim()],
      }));
    }
  }, []);

  const removeIngredient = useCallback((index: number) => {
    setFormDataState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }, []);

  const addStep = useCallback((step: string) => {
    if (step.trim()) {
      setFormDataState(prev => ({
        ...prev,
        steps: [...prev.steps, step.trim()],
      }));
    }
  }, []);

  const removeStep = useCallback((index: number) => {
    setFormDataState(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof RecipeFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Recipe name is required';
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    if (formData.steps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Recipe image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormDataState({
      name: '',
      typeId: '1',
      image: '',
      ingredients: [],
      steps: [],
    });
    setErrors({});
  }, []);

  const setFormData = useCallback((data: Partial<RecipeFormData>) => {
    setFormDataState(prev => ({ ...prev, ...data }));
  }, []);

  return {
    formData,
    errors,
    updateField,
    updateName,
    updateTypeId,
    updateImage,
    updateIngredients,
    updateSteps,
    addIngredient,
    removeIngredient,
    addStep,
    removeStep,
    validateForm,
    resetForm,
    generateId,
    setFormData,
  };
};
