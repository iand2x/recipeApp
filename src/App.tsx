import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import RecipeListScreen from './screens/RecipeListScreen';
import AddRecipeScreen from './screens/AddRecipeScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Recipes">
        <Stack.Screen 
          name="Recipes" 
          component={RecipeListScreen}
          options={{ title: 'My Recipes' }}
        />
        <Stack.Screen 
          name="AddRecipe" 
          component={AddRecipeScreen}
          options={{ title: 'Add Recipe' }}
        />
        <Stack.Screen 
          name="RecipeDetail" 
          component={RecipeDetailScreen}
          options={{ title: 'Recipe Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
