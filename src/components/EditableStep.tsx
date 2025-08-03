import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface EditableStepProps {
  step: string;
  index: number;
  onUpdate: (index: number, step: string) => void;
  onRemove: (index: number) => void;
  onInsertBefore?: (index: number, step: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const EditableStep: React.FC<EditableStepProps> = ({
  step,
  index,
  onUpdate,
  onRemove,
  onInsertBefore,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(step);
  const [showInsertInput, setShowInsertInput] = useState(false);
  const [insertValue, setInsertValue] = useState('');

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(index, editValue.trim());
      setIsEditing(false);
    } else {
      Alert.alert('Error', 'Step cannot be empty');
    }
  };

  const handleCancel = () => {
    setEditValue(step);
    setIsEditing(false);
  };

  const handleInsert = () => {
    if (insertValue.trim() && onInsertBefore) {
      onInsertBefore(index, insertValue.trim());
      setInsertValue('');
      setShowInsertInput(false);
    } else {
      Alert.alert('Error', 'Step cannot be empty');
    }
  };

  const handleCancelInsert = () => {
    setInsertValue('');
    setShowInsertInput(false);
  };

  const handleRemove = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this step?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onRemove(index),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Insert new step above */}
      {showInsertInput && (
        <View style={styles.insertContainer}>
          <TextInput
            style={styles.insertInput}
            value={insertValue}
            onChangeText={setInsertValue}
            placeholder="Enter new step..."
            multiline
            autoFocus
          />
          <View style={styles.insertButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancelInsert}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleInsert}>
              <Text style={styles.saveButtonText}>Insert</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main step item */}
      <View style={styles.stepItem}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepNumber}>{index + 1}.</Text>

          {/* Move buttons */}
          <View style={styles.moveButtons}>
            {!isFirst && onMoveUp && (
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() => onMoveUp(index)}>
                <Text style={styles.moveButtonText}>↑</Text>
              </TouchableOpacity>
            )}
            {!isLast && onMoveDown && (
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() => onMoveDown(index)}>
                <Text style={styles.moveButtonText}>↓</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Step content */}
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="Enter step description..."
              multiline
              autoFocus
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.viewContainer}>
            <TouchableOpacity
              style={styles.stepTextContainer}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.stepText}>{step}</Text>
              <Text style={styles.tapToEditHint}>Tap to edit</Text>
            </TouchableOpacity>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              {onInsertBefore && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowInsertInput(true)}>
                  <Text style={styles.actionButtonText}>+ Insert Above</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsEditing(true)}>
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleRemove}>
                <Text
                  style={[styles.actionButtonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  insertContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  insertInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  insertButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  stepItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    minWidth: 30,
  },
  moveButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  moveButton: {
    backgroundColor: '#6c757d',
    borderRadius: 4,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  viewContainer: {
    flex: 1,
  },
  stepTextContainer: {
    flex: 1,
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#495057',
  },
  tapToEditHint: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#f8d7da',
  },
  deleteButtonText: {
    color: '#721c24',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
