import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//import bag o
import HardLevelFull from "./HardLevelFull";

export default function App() {
  return (
    <View style={styles.container}>
      <Text> Desie B. Torrenueva</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
