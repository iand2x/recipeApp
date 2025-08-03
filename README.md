# Recipe App

A modern React Native application for managing and organizing your favorite recipes. Built with TypeScript for enhanced type safety and developer experience.

## Features

- 📱 **Cross-platform**: Runs on both Android and iOS
- 🍳 **Recipe Management**: Add, edit, delete, and view recipes
- 📸 **Image Support**: Add photos from camera, gallery, or URL
- 🏷️ **Recipe Categories**: Filter recipes by type (Breakfast, Lunch, Dinner, Snacks, Dessert)
- 💾 **Local Storage**: Recipes are saved locally using AsyncStorage
- 🎯 **Sample Data**: Comes preloaded with 5 sample recipes
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
- **React Navigation** v7 (Native Stack)
- **AsyncStorage** for data persistence
- **React Native Image Picker** for photo functionality
- **React Native Picker** for category filtering

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
├── data/               # Static data files
│   ├── sampleRecipes.json
│   └── recipetypes.json
├── models/             # TypeScript interfaces
│   └── Recipe.ts
├── screens/            # App screens
│   ├── AddRecipeScreen.tsx
│   ├── RecipeListScreen.tsx
│   └── RecipeDetailScreen.tsx
├── storage/            # Data persistence
│   └── storage.ts
└── types/              # TypeScript type definitions
    └── navigation.ts
```

## Usage

1. **View Recipes**: Browse all recipes on the main screen
2. **Filter by Category**: Use the dropdown to filter recipes by type
3. **Add Recipe**: Tap the "+" button to create a new recipe
4. **Edit Recipe**: Tap any recipe to view details and edit
5. **Add Photos**: Take photos, select from gallery, or use image URLs
6. **Delete Recipes**: Remove recipes you no longer need

## Development

### TypeScript Checking

```bash
npx tsc --noEmit
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

For more troubleshooting, see the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

## Contributing

Feel free to contribute to this project by:

- Adding new features
- Improving the UI/UX
- Fixing bugs
- Adding more sample recipes

## License

This project is open source and available under the [MIT License](LICENSE).
