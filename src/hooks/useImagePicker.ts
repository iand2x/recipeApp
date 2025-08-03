import { useState, useCallback } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';

export interface ImagePickerResult {
  uri: string;
  type: 'camera' | 'gallery' | 'url';
}

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlPromiseResolve, setUrlPromiseResolve] = useState<
    ((result: ImagePickerResult | null) => void) | null
  >(null);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  }, []);

  const selectFromGallery = useCallback(() => {
    return new Promise<ImagePickerResult | null>(resolve => {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri || '';
          setSelectedImage(imageUri);
          resolve({ uri: imageUri, type: 'gallery' });
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  const selectFromCamera = useCallback(async () => {
    return new Promise<ImagePickerResult | null>(async resolve => {
      // Request camera permission first
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos',
        );
        resolve(null);
        return;
      }

      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri || '';
          setSelectedImage(imageUri);
          resolve({ uri: imageUri, type: 'camera' });
        } else {
          resolve(null);
        }
      });
    });
  }, [requestCameraPermission]);

  const selectFromUrl = useCallback((url: string) => {
    return new Promise<ImagePickerResult | null>(resolve => {
      if (url.trim()) {
        setSelectedImage(url);
        resolve({ uri: url, type: 'url' });
      } else {
        resolve(null);
      }
    });
  }, []);

  const handleUrlModalSubmit = useCallback(
    (url: string) => {
      setShowUrlModal(false);
      if (urlPromiseResolve) {
        selectFromUrl(url).then(result => {
          setIsPickingImage(false);
          urlPromiseResolve(result);
          setUrlPromiseResolve(null);
        });
      }
    },
    [urlPromiseResolve, selectFromUrl],
  );

  const handleUrlModalCancel = useCallback(() => {
    setShowUrlModal(false);
    if (urlPromiseResolve) {
      setIsPickingImage(false);
      urlPromiseResolve(null);
      setUrlPromiseResolve(null);
    }
  }, [urlPromiseResolve]);

  const showImagePicker = useCallback((): Promise<ImagePickerResult | null> => {
    if (isPickingImage) {
      return Promise.resolve(null); // Prevent multiple pickers
    }

    return new Promise(resolve => {
      setIsPickingImage(true);
      Alert.alert('Select Image', 'Choose how you want to add an image', [
        {
          text: 'Camera',
          onPress: () => {
            selectFromCamera().then(result => {
              setIsPickingImage(false);
              resolve(result);
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            selectFromGallery().then(result => {
              setIsPickingImage(false);
              resolve(result);
            });
          },
        },
        {
          text: 'URL',
          onPress: () => {
            // Alert.prompt is iOS-only, so we'll provide a workaround for Android
            if (Platform.OS === 'ios') {
              Alert.prompt(
                'Image URL',
                'Enter the image URL:',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                      setIsPickingImage(false);
                      resolve(null);
                    },
                  },
                  {
                    text: 'OK',
                    onPress: (url?: string) => {
                      selectFromUrl(url || '').then(result => {
                        setIsPickingImage(false);
                        resolve(result);
                      });
                    },
                  },
                ],
                'plain-text',
              );
            } else {
              // Android - use custom modal for URL input
              setUrlPromiseResolve(() => resolve);
              setShowUrlModal(true);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setIsPickingImage(false);
            resolve(null);
          },
        },
      ]);
    });
  }, [selectFromCamera, selectFromGallery, selectFromUrl, isPickingImage]);

  const clearSelectedImage = useCallback(() => {
    setSelectedImage('');
  }, []);

  return {
    selectedImage,
    isPickingImage,
    showImagePicker,
    selectFromGallery,
    selectFromCamera,
    selectFromUrl,
    clearSelectedImage,
    // Modal state and handlers for Android URL input
    showUrlModal,
    handleUrlModalSubmit,
    handleUrlModalCancel,
  };
};
