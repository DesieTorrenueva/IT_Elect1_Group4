import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Leaderboard({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Load leaderboard data from Firestore
  const loadUsers = async () => {
    setLoading(true);
    try {
      // Get current user ID
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);

      const usersQuery = query(collection(db, "users"), orderBy("score", "desc"));
      const querySnapshot = await getDocs(usersQuery);
      const usersArr = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Only include users with username and exclude admin
        if (userData.username && userData.role !== "admin") {
          usersArr.push({
            id: doc.id,
            username: userData.username,
            score: userData.score || 0,
          });
        }
      });
      
      setUsers(usersArr);
    } catch (e) {
      console.error("Failed to load users", e);
      setUsers([]);
    }
    setLoading(false);
  };

  // Load leaderboard every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return (
          <View style={styles.medalContainer}>
            <FontAwesome5 name="crown" size={22} color="#FFD700" />
          </View>
        );
      case 1:
        return (
          <View style={[styles.medalContainer, { backgroundColor: "#E8E8E8" }]}>
            <FontAwesome5 name="medal" size={20} color="#757575" />
          </View>
        );
      case 2:
        return (
          <View style={[styles.medalContainer, { backgroundColor: "#FFDAB9" }]}>
            <FontAwesome5 name="medal" size={20} color="#CD7F32" />
          </View>
        );
      default:
        return (
          <View style={styles.rankCircle}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
        );
    }
  };

  const getCardGradient = (index) => {
    switch (index) {
      case 0:
        return ["#FFD700", "#FFA500"];
      case 1:
        return ["#E8E8E8", "#C0C0C0"];
      case 2:
        return ["#F4A460", "#CD7F32"];
      default:
        return ["#ffffff", "#f5f5f5"];
    }
  };

  const renderUserCard = ({ item, index }) => {
    const isCurrentUser = item.id === currentUserId;
    const isTopThree = index < 3;

    return (
      <LinearGradient
        colors={getCardGradient(index)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.userRow,
          isTopThree && styles.topThreeRow,
          isCurrentUser && styles.currentUserRow,
        ]}
      >
        {isCurrentUser && (
          <View style={styles.currentUserBadge}>
            <Text style={styles.currentUserText}>YOU</Text>
          </View>
        )}
        
        <View style={styles.rankContainer}>
          {getMedalIcon(index)}
        </View>

        <View style={styles.userInfo}>
          <Text 
            style={[
              styles.userName,
              isTopThree && styles.topThreeName,
            ]}
            numberOfLines={1}
          >
            {item.username}
          </Text>
          {index === 0 && (
            <View style={styles.championBadge}>
              <FontAwesome5 name="star" size={10} color="#a48d09ff" />
              <Text style={styles.championText}>Champion</Text>
            </View>
          )}
        </View>

        <View style={styles.scoreContainer}>
          <Text 
            style={[
              styles.userScore,
              isTopThree && styles.topThreeScore,
            ]}
          >
            {item.score}
          </Text>
          <Text style={[
            styles.pointsLabel,
            isTopThree && styles.topThreePointsLabel,
          ]}>
            points
          </Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <LinearGradient colors={["#0b4c85", "#dfb487"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.topB}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={() => navigation.navigate("GameDashboard")}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        </View>
        
        <View style={styles.headerContainer}>
          <FontAwesome5 name="trophy" size={32} color="#FFD700" />
          <Text style={styles.heading}>Leaderboard</Text>
        </View>
        
        <View style={{ width: 50 }} />
      

      {/* Top 3 Podium */}
      {!loading && users.length >= 3 && (
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumMedal, { backgroundColor: "#C0C0C0" }]}>
              <FontAwesome5 name="medal" size={18} color="#fff" />
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{users[1].username}</Text>
            <View style={[styles.podiumBase, { height: 70, backgroundColor: "#E8E8E8" }]}>
              <Text style={styles.podiumPosition}>2</Text>
            </View>
          </View>

          {/* 1st Place */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumMedal, { backgroundColor: "#FFD700" }]}>
              <FontAwesome5 name="crown" size={20} color="#fff" />
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{users[0].username}</Text>
            <View style={[styles.podiumBase, { height: 90, backgroundColor: "#FFD700" }]}>
              <Text style={styles.podiumPosition}>1</Text>
            </View>
          </View>

          {/* 3rd Place */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumMedal, { backgroundColor: "#CD7F32" }]}>
              <FontAwesome5 name="medal" size={18} color="#fff" />
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{users[2].username}</Text>
            <View style={[styles.podiumBase, { height: 50, backgroundColor: "#F4A460" }]}>
              <Text style={styles.podiumPosition}>3</Text>
            </View>
          </View>
        </View>
      )}

      {/* Full Rankings List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>All Rankings</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="users" size={50} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>No players yet.</Text>
            <Text style={styles.emptySubtext}>Be the first to score!</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUserCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  topB: {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingHorizontal: 20,
  marginBottom: 80,
},

  arrow: { 
    position: "absolute", 
    top: 20, 
    left: 15, 
    zIndex: 10,
    marginBottom: 80,
   },


  headerContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",  
  marginBottom: 20,
  gap: 20,
},

  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  podiumItem: {
    alignItems: "center",
    marginHorizontal: 6,
    flex: 1,
  },
  podiumMedal: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  podiumName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  podiumBase: {
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  podiumPosition: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    position: "relative",
  },
  topThreeRow: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 16,
  },
  currentUserRow: {
    borderWidth: 3,
    borderColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOpacity: 0.4,
  },
  currentUserBadge: {
    position: "absolute",
    top: -8,
    right: 15,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  currentUserText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  rankContainer: {
    width: 50,
    alignItems: "center",
  },
  medalContainer: {
    backgroundColor: "#FFF8DC",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  rankCircle: {
    backgroundColor: "#1565C0",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  topThreeName: {
    fontSize: 17,
    fontWeight: "900",
    color: "#fff",
  },
  championBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 4,
  },
  championText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  scoreContainer: {
    alignItems: "flex-end",
  },
  userScore: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1565C0",
  },
  topThreeScore: {
    fontSize: 22,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pointsLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginTop: 2,
  },
  topThreePointsLabel: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },
  emptySubtext: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 5,
  },
});