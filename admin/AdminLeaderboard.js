import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminLeaderboard({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "users"), orderBy("score", "desc"));
        const querySnapshot = await getDocs(q);
        const userList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Only include users with username and exclude admin
          if (data.username && data.role !== "admin") {
            userList.push({
              id: doc.id,
              username: data.username,
              email: data.email || "N/A",
              score: data.score || 0,
            });
          }
        });
        setUsers(userList);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return { icon: "trophy-award", color: "#FFD700", bg: "#FFF8DC" };
      case 1:
        return { icon: "trophy-outline", color: "#C0C0C0", bg: "#F5F5F5" };
      case 2:
        return { icon: "trophy-outline", color: "#CD7F32", bg: "#FFE4B5" };
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={["#0b4c85", "#1565C0"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="chart-line" size={32} color="#FFD700" />
          <Text style={styles.headerTitle}>Leaderboard</Text>
        </View>
        
        <View style={{ width: 50 }} />
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="account-group" size={28} color="#1565C0" />
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Players</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="star" size={28} color="#FFD700" />
          <Text style={styles.statNumber}>{users[0]?.score || 0}</Text>
          <Text style={styles.statLabel}>Top Score</Text>
        </View>
      </View>

      {/* Leaderboard List */}
      <View style={styles.container}>
        <View style={styles.listHeaderContainer}>
          <Text style={styles.listTitle}>Player Rankings</Text>
          <MaterialCommunityIcons name="format-list-numbered" size={24} color="#fff" />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
        ) : users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-off" size={80} color="rgba(255,255,255,0.2)" />
            <Text style={styles.noUsersText}>No players found</Text>
            <Text style={styles.noUsersSubtext}>Players will appear here once they start playing</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const rankBadge = getRankBadge(index);
              
              return (
                <View style={[
                  styles.userCard,
                  index < 3 && styles.topThreeCard
                ]}>
                  {/* Rank Section */}
                  <View style={styles.rankSection}>
                    {rankBadge ? (
                      <View style={[styles.trophyContainer, { backgroundColor: rankBadge.bg }]}>
                        <MaterialCommunityIcons 
                          name={rankBadge.icon} 
                          size={32} 
                          color={rankBadge.color} 
                        />
                      </View>
                    ) : (
                      <View style={styles.rankNumberContainer}>
                        <Text style={styles.rankNumber}>{index + 1}</Text>
                      </View>
                    )}
                  </View>

                  {/* User Info Section */}
                  <View style={styles.userInfoSection}>
                    <View style={styles.userNameRow}>
                      <MaterialCommunityIcons 
                        name="account-circle" 
                        size={18} 
                        color={index < 3 ? "#1565C0" : "#666"} 
                      />
                      <Text style={[
                        styles.username,
                        index < 3 && styles.topThreeUsername
                      ]} numberOfLines={1}>
                        {item.username}
                      </Text>
                    </View>
                    <View style={styles.emailRow}>
                      <MaterialCommunityIcons 
                        name="email-outline" 
                        size={14} 
                        color="#999" 
                      />
                      <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
                        {item.email}
                      </Text>
                    </View>
                  </View>

                  {/* Score Section */}
                  <View style={styles.scoreSection}>
                    <View style={[
                      styles.scoreBox,
                      index < 3 && styles.topThreeScoreBox
                    ]}>
                      <Text style={[
                        styles.scoreNumber,
                        index < 3 && styles.topThreeScoreNumber
                      ]}>
                        {item.score}
                      </Text>
                      <Text style={styles.scoreLabel}>points</Text>
                    </View>
                  </View>
                </View>
              );
            }}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    gap: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.95)",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0b4c85",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  noUsersText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
  },
  noUsersSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topThreeCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#1565C0",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  rankSection: {
    width: 55,
    alignItems: "center",
  },
  trophyContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumberContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  rankNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#666",
  },
  userInfoSection: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    minWidth: 0,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginLeft: 5,
    flex: 1,
  },
  topThreeUsername: {
    fontSize: 16,
    color: "#0b4c85",
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  email: {
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
    flex: 1,
  },
  scoreSection: {
    marginLeft: 8,
  },
  scoreBox: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 70,
  },
  topThreeScoreBox: {
    backgroundColor: "#1565C0",
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0b4c85",
  },
  topThreeScoreNumber: {
    color: "#fff",
  },
  scoreLabel: {
    fontSize: 9,
    color: "#09e7fbff",
    fontWeight: "600",
    marginTop: 2,
  },
});