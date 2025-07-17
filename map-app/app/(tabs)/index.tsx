import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function HomeScreen() {
  const [location, setLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);
  const [serverData, setServerData] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부됨');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      try {
        const res = await axios.post('http://192.168.0.6:3000/location', {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setServerData(res.data);
      } catch (error) {
        console.error('서버 통신 실패:', error);
      }
    })();
  }, []);

  if (!location) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="현재 위치"
        />
      </MapView>
      {serverData && (
        <View style={styles.dataBox}>
          <Text>서버 응답: {JSON.stringify(serverData)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  dataBox: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
});
