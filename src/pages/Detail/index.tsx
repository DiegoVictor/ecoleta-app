import React, { useEffect, useState } from 'react';
import { Linking, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';
import {
  SafeArea,
  Container,
  Cover,
  Name,
  Items,
  Address,
  Title,
  Content,
  Footer,
  Button,
  Label,
} from './styles';

interface DetailParams {
  point_id: number;
}

interface Location {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail: React.FC = () => {
  const [location, setLocation] = useState<Location>({} as Location);

  const navigation = useNavigation();

  const route = useRoute();
  const { point_id } = route.params as DetailParams;

  const handleNavigationToHome = () => {
    navigation.goBack();
  };

  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [location.point.email],
    });
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${location.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`,
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/points/${point_id}`);
        setLocation(data);
      } catch (err) {
        Alert.alert('Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!');
      }
    })();
  }, [point_id]);

  if (!location.point) {
    return null;
  }

  return (
    <SafeArea>
      <Container>
        <TouchableOpacity onPress={handleNavigationToHome}>
          <Feather name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Cover
          resizeMode="cover"
          source={{
            uri: location.point.image,
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
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Label>Whatsapp</Label>
        </Button>
        <Button onPress={handleComposeMail}>
          <Feather name="mail" size={20} color="#FFF" />
          <Label>Email</Label>
        </Button>
      </Footer>
    </SafeArea>
  );
};

export default Detail;