import {
  Container,
  Description,
  Item,
  Items,
  Label,
  Map,
  MapContainer,
  Pin,
  PinArrow,
  PinBox,
  PinImage,
  PinTitle,
  SafeArea,
  Title,
} from '@/components/points/styles';
import { api } from '@/services/api';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Feather } from '@react-native-vector-icons/feather';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface LatLng {
  latitude?: number;
  longitude?: number;
}

interface Point {
  id: number;
  name: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface PointWithTextHeight extends Point {
  textHeight: number;
}

export default function Points() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [position, setPosition] = useState<LatLng>({});
  const [points, setPoints] = useState<PointWithTextHeight[]>([]);

  const { uf, city } = useLocalSearchParams<'/points'>();

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      const filteredItems = selectedItems.filter(item => item !== id);
      return setSelectedItems(filteredItems);
    }

    setSelectedItems([...selectedItems, id]);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('items');

        setItems(data);
      } catch {
        Alert.alert('Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (selectedItems.length > 0) {
          const { data } = await api.get<Point[]>('/points', {
            params: {
              city,
              uf,
              items: selectedItems,
            },
          });

          setPoints(() =>
            data.map(point => {
              const wordsLength = point.name.split(' ').length;
              return {
                ...point,
                textHeight: wordsLength > 1 ? wordsLength * 22 : 25,
              };
            }),
          );
        } else {
          setPoints([]);
        }
      } catch {
        Alert.alert('Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!');
      }
    })();
  }, [city, uf, selectedItems]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
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
    <SafeArea>
      <Container>
        <TouchableOpacity onPress={() => router.back()} testID="back">
          <Feather name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Title>Bem vindo.</Title>
        <Description>Encontre no mapa um ponto de coleta</Description>

        <MapContainer>
          {position.latitude && position.longitude && (
            <Map
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: position.latitude,
                longitude: position.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              {points.map(point => (
                <Pin
                  key={point.id.toString()}
                  onPress={() =>
                    router.navigate({
                      pathname: '/detail',
                      params: { pointId: point.id },
                    })
                  }
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  testID={`point_${point.id}`}
                >
                  <PinBox extraHeight={point.textHeight}>
                    <PinImage
                      resizeMode="cover"
                      source={{
                        uri: point.image_url,
                      }}
                    />
                    <PinTitle ellipsizeMode="tail">
                      {point.name.replace(/\s/g, '\n')}
                    </PinTitle>
                  </PinBox>
                  <PinArrow extraTop={point.textHeight}>
                    <AntDesign name="caret-down" size={22} color="#34CB79" />
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
    </SafeArea>
  );
}
