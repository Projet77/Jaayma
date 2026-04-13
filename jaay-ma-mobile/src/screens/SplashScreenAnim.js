import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { COLORS } from '../constants/theme';

const SplashScreenAnim = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Animation parallèle : Fade In + Scale
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Après l'apparition, on attend 1.5s puis on appelle onFinish
            setTimeout(() => {
                // Petit fadeOut avant de passer à l'app
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start(onFinish);
            }, 1800);
        });
    }, [fadeAnim, scaleAnim, onFinish]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../assets/logo.png')} 
                        style={styles.logo}
                        resizeMode="cover"
                    />
                </View>
                <Text style={styles.brandName}>JaayMa.</Text>
                <Text style={styles.tagline}>L'expérience shopping par excellence</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary || '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 140,
        height: 140,
        backgroundColor: '#fff',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
        marginBottom: 24,
        overflow: 'hidden'
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    brandName: {
        fontSize: 48,
        fontFamily: 'Outfit_900Black',
        color: '#ffffff',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: 8,
    }
});

export default SplashScreenAnim;
