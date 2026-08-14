import {
  Address,
  Button,
  Container,
  Content,
  Cover,
  Footer,
  Items,
  Label,
  Name,
  SafeArea,
  Title,
} from '@/components/detail/styles';
import { api } from '@/services/api';
import { Feather } from '@react-native-vector-icons/feather';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import * as MailComposer from 'expo-mail-composer';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';

interface Point {
  point: {
    name: string;
    email: string;
    whatsapp: string;
    image_url: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

export default function Detail() {
  const [location, setLocation] = useState<Point | null>(null);
  const { pointId } = useLocalSearchParams<'/detail'>();

  const handleComposeMail = () => {
    if (location) {
      MailComposer.composeAsync({
        subject: 'Interesse na coleta de resíduos',
        recipients: [location.point.email],
      });
    }
  };

  const handleWhatsApp = () => {
    if (location) {
      Linking.openURL(
        `whatsapp://send?phone=${location.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`,
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/points/${pointId}`);
        setLocation(data);
      } catch {
        Alert.alert('Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!');
      }
    })();
  }, [pointId]);

  if (!location?.point) {
    return null;
  }

  return (
    <SafeArea>
      <Container>
        <TouchableOpacity onPress={() => router.back()} testID="back">
          <Feather name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Cover
          resizeMode="cover"
          source={{
            uri: location.point.image_url,
          }}
        />
        <Name>{location.point.name}</Name>
        <Items>{location.items.map(item => item.title).join(', ')}</Items>

        <Address>
          <Title>Endereço</Title>
          <Content>
            {location.point.city}, {location.point.uf}
          </Content>
        </Address>
      </Container>

      <Footer>
        <Button onPress={handleWhatsApp}>
          <FontAwesome
            name="whatsapp"
            size={20}
            color="#FFF"
            testID="whatsapp"
          />
          <Label>Whatsapp</Label>
        </Button>
        <Button onPress={handleComposeMail}>
          <Feather name="mail" size={20} color="#FFF" testID="mail" />
          <Label>Email</Label>
        </Button>
      </Footer>
    </SafeArea>
  );
}
