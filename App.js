import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import ModalComponent from 'react-native-modal';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handlePress = async (message, nameParam) => {
    setModalMessage(message);
    setModalVisible(true);

    // Send request to backend with the selected action
    try {
      const response = await fetch("https://bd13-2402-d000-8110-578c-f4b6-6419-edc1-5e4b.ngrok-free.app/Smart_Bridge/Main", {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `name=${nameParam}`,  // Send name as part of the POST body
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Server Response:", result);
        setModalMessage(`Action successful: ${message}`);
      } else {
        console.error("Request failed with status:", response.status);
        setModalMessage("Request failed. Please try again.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setModalMessage("Error occurred. Check connection.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bridge and Gate Control</Text>
      
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Pressable onPress={() => handlePress('Bridge Opened', 'open_bridge')} style={styles.buttonWrapper}>
            <LinearGradient colors={['#4a90e2', '#007AFF']} style={styles.button}>
              <Text style={styles.buttonText}>Open Bridge</Text>
            </LinearGradient>
          </Pressable>
          <Pressable onPress={() => handlePress('Bridge Closed', 'close_bridge')} style={styles.buttonWrapper}>
            <LinearGradient colors={['#4a90e2', '#007AFF']} style={styles.button}>
              <Text style={styles.buttonText}>Close Bridge</Text>
            </LinearGradient>
          </Pressable>
        </View>
        <View style={styles.buttonRow}>
          <Pressable onPress={() => handlePress('Gate Opened', 'open_gate')} style={styles.buttonWrapper}>
            <LinearGradient colors={['#4a90e2', '#007AFF']} style={styles.button}>
              <Text style={styles.buttonText}>Open Gate</Text>
            </LinearGradient>
          </Pressable>
          <Pressable onPress={() => handlePress('Gate Closed', 'close_gate')} style={styles.buttonWrapper}>
            <LinearGradient colors={['#4a90e2', '#007AFF']} style={styles.button}>
              <Text style={styles.buttonText}>Close Gate</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <ModalComponent
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.5}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </ModalComponent>

      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
