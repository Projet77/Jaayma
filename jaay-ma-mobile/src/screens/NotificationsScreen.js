import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const NotificationsScreen = ({ navigation }) => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.log('Erreur fetch notifs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [user, token]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            // Mettre à jour localement
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.log('Erreur mark read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.log('Erreur mark all read:', error);
        }
    };

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="notifications-off-outline" size={64} color={COLORS.neutral300} />
                <Text style={styles.emptyText}>Connectez-vous pour voir vos notifications</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Profil')}>
                    <Text style={styles.loginBtnText}>Se Connecter</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
            onPress={() => {
                if (!item.isRead) markAsRead(item.id);
            }}
        >
            <View style={styles.iconContainer}>
                <Ionicons 
                    name={item.title.toLowerCase().includes('commande') ? "cube-outline" : "information-circle-outline"} 
                    size={24} 
                    color={!item.isRead ? COLORS.primary : COLORS.neutral400} 
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                </Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Vos Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text style={styles.markAllText}>Tout lire</Text>
                    </TouchableOpacity>
                )}
            </View>

            {notifications.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="cafe-outline" size={64} color={COLORS.neutral300} />
                    <Text style={styles.emptyText}>Vous n'avez aucune notification.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral100,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: COLORS.black,
    },
    markAllText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: COLORS.primary || '#2563EB',
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: COLORS.neutral500,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    loginBtn: {
        backgroundColor: COLORS.primary || '#2563EB',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    loginBtnText: {
        color: COLORS.white,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.neutral200 || '#e5e5e5',
        alignItems: 'flex-start',
    },
    unreadCard: {
        backgroundColor: COLORS.neutral50 || '#f8fafc',
        borderColor: COLORS.primary || '#2563EB',
    },
    iconContainer: {
        marginRight: 16,
        marginTop: 2,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: COLORS.black,
        marginBottom: 4,
    },
    unreadTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    message: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: COLORS.neutral600,
        marginBottom: 8,
        lineHeight: 20,
    },
    date: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: COLORS.neutral400,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary || '#2563EB',
        marginTop: 8,
        marginLeft: 10,
    }
});

export default NotificationsScreen;
