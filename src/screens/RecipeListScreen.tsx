import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getRecipes } from '../storage/storage';
import { Recipe } from '../models/Recipe';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Picker } from '@react-native-picker/picker';
import recipeTypesData from '../data/recipetypes.json';

const RecipeListScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [recipeTypes, setRecipeTypes] = useState<
    { id: string; name: string }[]
  >([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
    };
    const unsubscribe = navigation.addListener('focus', loadRecipes);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Use the imported recipe types data
    const typedRecipeTypes = recipeTypesData as { id: string; name: string }[];
    setRecipeTypes([{ id: 'all', name: 'All Types' }, ...typedRecipeTypes]);
  }, []);

  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  const filteredRecipes =
    selectedType === 'all'
      ? recipes
      : recipes.filter(r => r.typeId === selectedType);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedType}
        onValueChange={itemValue => setSelectedType(itemValue)}>
        {recipeTypes.map(type => (
          <Picker.Item key={type.id} label={type.name} value={type.id} />
        ))}
      </Picker>

      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
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
  title: { fontSize: 16, fontWeight: '600' },
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
});

export default RecipeListScreen;
