import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';

import api from '../../services/api';
import {
  Container,
  Title,
  Description,
  MapContainer,
  Map,
  Pin,
  PinImage,
  PinTitle,
  Items,
  Item,
  Label,
  PinBox,
  PinArrow,
} from './styles';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface LatLng {
  latitude?: number;
  longitude?: number;
}

interface PointsParams {
  uf: string;
  city: string;
}

const Points: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [position, setPosition] = useState<LatLng>({});
  const [points, setPoints] = useState<Point[]>([]);

  const route = useRoute();
  const { uf, city } = route.params as PointsParams;

  const navigation = useNavigation();

  const handleNavigationToHome = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleNavigationToDetail = useCallback((id: number) => {
    navigation.navigate('Detail', { point_id: id });
  }, []);

  const handleSelectItem = useCallback(
    (id: number) => {
      if (selectedItems.includes(id)) {
        const filteredItems = selectedItems.filter(item => item !== id);
        setSelectedItems(filteredItems);
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    },
    [selectedItems],
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('items');
        setItems(data);
      } catch (err) {
        Alert.alert('Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (selectedItems.length > 0) {
          const { data } = await api.get('/points', {
            params: {
              city,
              uf,
              items: selectedItems,
            },
          });

          setPoints(data);
        } else {
          setPoints([]);
        }
      } catch (err) {
        Alert.alert('Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!');
      }
    })();
  }, [city, uf, selectedItems]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
        setPosition({ latitude, longitude });
      } else {
        Alert.alert(
          'Opa! Precisamos de sua permissão para obter a localização!',
        );
      }
    })();
  }, []);

  return (
    <>
      <Container>
        <TouchableOpacity onPress={handleNavigationToHome} testID="back">
          <Feather name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Title>Bem vindo.</Title>
        <Description>Encontre no mapa um ponto de coleta</Description>

        <MapContainer>
          {position.latitude && position.longitude && (
            <Map
              initialRegion={{
                latitude: position.latitude,
                longitude: position.longitude,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map(point => (
                <Pin
                  key={point.id.toString()}
                  onPress={() => handleNavigationToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  testID={`point_${point.id}`}
                >
                  <PinBox>
                    <PinImage
                      source={{
                        uri: point.image_url,
                      }}
                      resizeMode="cover"
                    />
                    <PinTitle>{point.name.slice(0, 10)}</PinTitle>
                  </PinBox>
                  <PinArrow>
                    <AntDesign name="caretdown" size={22} color="#34CB79" />
                  </PinArrow>
                </Pin>
              ))}
            </Map>
          )}
        </MapContainer>
      </Container>
      <Items>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 32 }}
        >
          {items.map(item => (
            <Item
              activeOpacity={0.6}
              key={item.image_url.toString()}
              selected={selectedItems.includes(item.id)}
              onPress={() => handleSelectItem(item.id)}
              testID={`item_${item.id}`}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Label>{item.title}</Label>
            </Item>
          ))}
        </ScrollView>
      </Items>
    </>
  );
};

export default Points;
