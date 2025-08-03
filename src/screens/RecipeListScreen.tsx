import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Recipe } from '../models/Recipe';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Picker } from '@react-native-picker/picker';
import { useRecipesRedux } from '../hooks';
import { useAppSelector } from '../store/hooks';
import { selectRecipeTypeCounts } from '../store/selectors/recipesSelectors';
import recipeTypes from '../data/recipetypes.json';

const RecipeListScreen = () => {
  // Redux hooks
  const {
    recipes,
    loading,
    error,
    filter,
    setTypeFilter,
    clearErrorState,
    removeRecipe,
  } = useRecipesRedux();

  const typeCounts = useAppSelector(selectRecipeTypeCounts);
  const allRecipes = useAppSelector(state => state.recipes.recipes);

  const handleDeleteRecipe = async (recipe: Recipe) => {
    // Always show delete confirmation for safety
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeRecipe(recipe.id);
            } catch (deleteError) {
              console.error('Error deleting recipe:', deleteError);
              Alert.alert(
                'Error',
                'Failed to delete recipe. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>
          {recipeTypes.find(t => t.id === item.typeId)?.name || 'Unknown'}
        </Text>
        <Text style={styles.meta}>
          {item.ingredients.length} ingredients • {item.steps.length} steps
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteRecipe(item)}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={clearErrorState}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.filterContainer}>
          <Picker selectedValue={filter.typeId} onValueChange={setTypeFilter}>
            <Picker.Item
              key="all"
              label={`All Recipes (${allRecipes.length})`}
              value="all"
            />
            {recipeTypes.map(type => (
              <Picker.Item
                key={type.id}
                label={`${type.name} (${typeCounts[type.id] || 0})`}
                value={type.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubText}>
              {filter.typeId === 'all'
                ? 'Add your first recipe!'
                : 'No recipes in this category'}
            </Text>
          </View>
        }
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddRecipe')}>
          <Text style={styles.addButtonText}>+ Add Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterContainer: {
    marginBottom: 8,
  },
  list: { padding: 16 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  cardContent: {
    flex: 1,
  },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: { fontSize: 14, color: '#999', textAlign: 'center' },
});

export default RecipeListScreen;
