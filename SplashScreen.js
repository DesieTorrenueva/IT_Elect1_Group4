import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate fade + scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./assets/logo.png")} // ← adjust path if needed
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b4c85", // same as your app’s theme color
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
});
