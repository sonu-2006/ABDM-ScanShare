import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Animated, Easing, Dimensions, Platform, SafeAreaView, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import { Camera, Image as ImageIcon, X, ShieldCheck, Zap, ZapOff, RotateCcw } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.75;

const ScannerScreen = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      scanLineAnim.setValue(0);
      Animated.loop(
        Animated.timing(scanLineAnim, {
          toValue: SCANNER_SIZE,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      ).start();
    };

    if (!scanned) {
      startAnimation();
    }
  }, [scanned]);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.permIconBox}>
            <ShieldCheck size={50} color={COLORS.primary} />
        </View>
        <Text style={styles.permissionTitle}>Signature Required</Text>
        <Text style={styles.permissionSubtitle}>Please authorize camera access to verify hospital credentials and enable secure sharing via ABDM protocols.</Text>
        <TouchableOpacity style={[styles.permissionBtn, SHADOWS.md]} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    processQRCode(data);
  };

  const processQRCode = (data: string) => {
    try {
      let hipId = null;
      let counterId = null;

      console.log("Scanned Data:", data);

      // 1. Handle URL Format (Standard for official placards)
      // Supports domains: healthid.ndhm.gov.in, phrsbx.abdm.gov.in, etc.
      if (data.includes('hip') || data.includes('HIP')) {
        const urlParams = data.split('?')[1] || data;
        
        // Regex to capture various hip-id parameter naming styles
        const hipMatch = urlParams.match(/(?:hipid|hip-id|hipId)=([^&]*)/i);
        const counterMatch = urlParams.match(/(?:counterid|counter-id|counterId)=([^&]*)/i);
        
        hipId = hipMatch ? hipMatch[1] : null;
        counterId = counterMatch ? counterMatch[1] : null;
      } 
      
      // 2. Handle Case where data IS the hipId (sometimes used in simple QR tags)
      if (!hipId && data.length > 5 && !data.includes(' ')) {
        hipId = data;
      }

      if (hipId) {
        // Clean up the hipId (remove any encoded characters)
        const cleanHipId = decodeURIComponent(hipId).trim();
        const cleanCounterId = counterId ? decodeURIComponent(counterId).trim() : 'GENERAL';

        navigation.navigate('HospitalDetails', {
          hospital: {
            hipId: cleanHipId,
            counterId: cleanCounterId,
          },
        });
      } else {
        Alert.alert('Scan Result', 'This QR code is not recognized by the ABDM medical network.', [
          { text: 'Try Again', onPress: () => setScanned(false) }
        ]);
      }
    } catch (e) {
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        enableTorch={flash}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      
      {/* Frosted / Clinical Overlay */}
      <View style={styles.overlay}>
        <View style={styles.unfilled} />
        <View style={styles.middleRow}>
          <View style={styles.unfilledSide} />
          <View style={styles.scannerOutline}>
             <View style={[styles.corner, styles.topLeft]} />
             <View style={[styles.corner, styles.topRight]} />
             <View style={[styles.corner, styles.bottomLeft]} />
             <View style={[styles.corner, styles.bottomRight]} />
             
             {!scanned && (
                <Animated.View 
                    style={[
                        styles.scanLine, 
                        { transform: [{ translateY: scanLineAnim }] }
                    ]} 
                />
             )}
          </View>
          <View style={styles.unfilledSide} />
        </View>
        <View style={styles.unfilled} />
      </View>

      {/* Elegant Controls */}
      <SafeAreaView style={styles.uiOverlay}>
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={[styles.miniBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
            onPress={() => navigation.goBack()}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.secureBadge}>
             <ShieldCheck size={16} color={COLORS.success} />
             <Text style={styles.secureText}>ABDM CERTIFIED</Text>
          </View>
          <TouchableOpacity 
            style={[styles.miniBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
            onPress={() => setFlash(!flash)}
          >
            {flash ? <Zap color="#fbbf24" size={20} fill="#fbbf24" /> : <ZapOff color="#fff" size={20} />}
          </TouchableOpacity>
        </View>

        <View style={styles.footerGuide}>
           <Text style={styles.guideTitle}>Identify QR Code</Text>
           <Text style={styles.guideSub}>Scan the official hospital counter card to begin sharing your health profile.</Text>
           
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setScanned(false)}>
                 <RotateCcw size={20} color={COLORS.secondary} />
                 <Text style={styles.actionBtnText}>Reset</Text>
              </TouchableOpacity>
              
              {/* TEST MODE BUTTON */}
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: 'rgba(43, 103, 246, 0.05)', paddingHorizontal: 15, borderRadius: 12 }]} 
                onPress={() => processQRCode('https://phrsbx.abdm.gov.in/share-profile?hip-id=APOLLO_V3&counter-id=OPD-01')}
              >
                 <Zap size={20} color={COLORS.primary} />
                 <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Simulate Scan</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn}>
                 <ImageIcon size={20} color={COLORS.secondary} />
                 <Text style={styles.actionBtnText}>Gallery</Text>
              </TouchableOpacity>
           </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  permIconBox: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  permissionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  permissionSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    fontWeight: '500',
  },
  permissionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 20,
  },
  permissionBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 17,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  unfilled: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  middleRow: {
    flexDirection: 'row',
    height: SCANNER_SIZE,
  },
  unfilledSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scannerOutline: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#fff',
    borderWidth: 4,
    borderRadius: 4,
  },
  topLeft: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },
  scanLine: {
    width: '100%',
    height: 2.5,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 40 : 10,
  },
  miniBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secureText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  footerGuide: {
    backgroundColor: '#fff',
    padding: SPACING.lg,
    borderRadius: 36,
    marginBottom: 20,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  guideSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 24,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.secondary,
  },
});

export default ScannerScreen;
