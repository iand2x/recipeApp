# Recipe App

A modern React Native application for managing and organizing your favorite recipes. Built with TypeScript and Redux for enhanced type safety, state management, and developer experience.

## Features

- 📱 **Cross-platform**: Runs on both Android and iOS
- 🍳 **Recipe Management**: Add, edit, delete, and view recipes with advanced editing capabilities
- 📸 **Image Support**: Add photos from camera, gallery, or URL with modal input
- 🏷️ **Recipe Categories**: Filter recipes by type (Breakfast, Lunch, Dinner, Snacks, Dessert)
- � **Redux State Management**: Centralized state management with Redux Toolkit
- ✏️ **Advanced Step Editing**: Inline editing, reordering, and insertion of recipe steps
- 💾 **Persistent Storage**: Recipes saved locally with AsyncStorage, merged with sample data
- 🎯 **Sample Data**: Comes preloaded with 5 sample recipes
- 🎨 **Custom Hooks**: Modular business logic with custom React hooks
- ⚡ **TypeScript**: Full type safety and IntelliSense support

## Sample Recipes Included

The app comes with these delicious sample recipes:

- 🍪 Classic Chocolate Chip Cookies (Dessert)
- 🍝 Spaghetti Carbonara (Dinner)
- 🥑 Avocado Toast (Breakfast)
- 🥗 Chicken Caesar Salad (Lunch)
- 🍕 Homemade Pizza (Dinner)

## Tech Stack

- **React Native** 0.80.2
- **TypeScript** 5.0.4
- **Redux Toolkit** 2.8.2 with React-Redux 9.2.0
- **React Navigation** v7 (Native Stack)
- **AsyncStorage** for data persistence
- **React Native Image Picker** for photo functionality
- **React Native Picker** for category filtering
- **Custom Hooks Architecture** for business logic separation

## Prerequisites

Before running this project, make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment).

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. For iOS, install CocoaPods dependencies:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

## Running the App

### Step 1: Start Metro

First, start the Metro bundler:

```bash
npm start
# or
yarn start
```

### Step 2: Run on Device/Emulator

Open a new terminal and run:

#### Android

```bash
npm run android
# or
yarn android
```

#### iOS

```bash
npm run ios
# or
yarn ios
```

## App Structure

```
src/
├── components/          # Reusable UI components
│   ├── EditableStep.tsx    # Advanced step editing component
│   └── UrlInputModal.tsx   # URL input modal for images
├── data/               # Static data files
│   ├── sampleRecipes.json
│   └── recipetypes.json
├── hooks/              # Custom React hooks
│   ├── index.ts           # Hook exports
│   ├── useImagePicker.ts  # Image selection logic
│   ├── useRecipeFilter.ts # Recipe filtering logic
│   ├── useRecipeForm.ts   # Form state management
│   ├── useRecipes.ts      # Legacy AsyncStorage hooks
│   └── useRecipesRedux.ts # Redux-based recipe management
├── models/             # TypeScript interfaces
│   └── Recipe.ts
├── screens/            # App screens
│   ├── AddRecipeScreen.tsx
│   ├── RecipeListScreen.tsx
│   └── RecipeDetailScreen.tsx
├── storage/            # Data persistence
│   └── storage.ts
├── store/              # Redux store configuration
│   ├── hooks.ts           # Typed Redux hooks
│   ├── index.ts          # Store setup
│   ├── selectors/        # Redux selectors
│   └── slices/           # Redux slices
└── types/              # TypeScript type definitions
    └── navigation.ts
```

## Usage

1. **View Recipes**: Browse all recipes on the main screen with Redux-powered state management
2. **Filter by Category**: Use the dropdown to filter recipes by type
3. **Add Recipe**: Tap the "+" button to create a new recipe with advanced form validation
4. **Edit Recipe**: Tap any recipe to view details and edit with inline step editing
5. **Advanced Step Editing**:
   - Edit steps inline by tapping the edit button
   - Reorder steps using up/down arrows
   - Insert new steps between existing ones
   - Delete individual steps
6. **Add Photos**: Take photos, select from gallery, or use image URLs with modal input
7. **Delete Recipes**: Remove recipes with confirmation dialogs

## Architecture Highlights

### Redux Integration

- **Centralized State**: All recipe data managed through Redux store
- **Typed Hooks**: Custom typed `useAppDispatch` and `useAppSelector` hooks
- **Async Actions**: Redux Toolkit async thunks for data persistence
- **Memoized Selectors**: Optimized selectors for filtering and data access

### Custom Hooks

- **useRecipesRedux**: Main hook for recipe CRUD operations with Redux
- **useImagePicker**: Handles camera, gallery, and URL image selection
- **useRecipeForm**: Form state management with validation
- **useRecipeFilter**: Recipe filtering logic

### Advanced Components

- **EditableStep**: Sophisticated inline editing with move/insert capabilities
- **UrlInputModal**: Modal for entering image URLs with validation

## Development

### TypeScript Checking

```bash
npx tsc --noEmit
```

### Redux DevTools

The app includes Redux DevTools integration for state debugging and time-travel debugging.

### Code Architecture

- **Separation of Concerns**: Business logic separated into custom hooks
- **Type Safety**: Full TypeScript coverage with strict mode
- **Modern Patterns**: Uses Redux Toolkit for simplified Redux logic
- **Component Composition**: Reusable components with clear prop interfaces

### Testing

```bash
npm test
# or
yarn test
```

### Debugging

- **Android**: Press `R` twice or `Ctrl+M` (Windows) / `Cmd+M` (Mac) for dev menu
- **iOS**: Press `R` in iOS Simulator or `Cmd+D` for dev menu

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build issues**: Clean build folder in Xcode or run `cd ios && xcodebuild clean`
3. **Android build issues**: Clean with `cd android && ./gradlew clean`
4. **Image picker not working**: Ensure camera/gallery permissions are granted
5. **Redux state issues**: Use Redux DevTools to inspect state changes
6. **TypeScript errors**: Run `npx tsc --noEmit` to check for type issues

For more troubleshooting, see the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

## Contributing

Feel free to contribute to this project by:

- Adding new features
- Improving the UI/UX
- Fixing bugs
- Adding more sample recipes
- Enhancing Redux architecture
- Writing unit tests
- Improving TypeScript definitions

## Key Features Implemented

- ✅ Full TypeScript conversion
- ✅ Redux Toolkit integration
- ✅ Custom hooks architecture
- ✅ Advanced step editing with inline capabilities
- ✅ Image picker with URL support
- ✅ Recipe filtering and categorization
- ✅ Persistent storage with sample data merging
- ✅ Form validation and error handling
- ✅ Navigation with typed route parameters

## License

This project is open source and available under the [MIT License](LICENSE).
