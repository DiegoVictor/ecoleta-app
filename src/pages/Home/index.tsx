import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Background from '../../assets/home-background.png';
import Logo from '../../assets/logo.png';
import {
  Container,
  Main,
  Title,
  Description,
  Footer,
  Input,
  Button,
  Icon,
  Label,
} from './styles';

const Home = () => {
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  const navigation = useNavigation();

  const handleNavigationToPoints = () => {
    navigation.navigate('Points', { uf, city });
  };

  return (
    <Container source={Background} imageStyle={{ width: 274, height: 368 }}>
      <Main>
        <Image source={Logo} />

        <View>
          <Title>Seu marketplace de coleta de resíduos</Title>
          <Description>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Description>
        </View>
      </Main>

      <Footer>
        <Input
          value={uf}
          onChangeText={setUf}
          placeholder="Digite UF"
          maxLength={2}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <Input
          value={city}
          onChangeText={setCity}
          placeholder="Digite cidade"
          autoCorrect={false}
        />

        <Button onPress={handleNavigationToPoints}>
          <Icon>
            <Text>
              <Feather name="arrow-right" color="#FFF" size={24} />
            </Text>
          </Icon>
          <Label>Entrar</Label>
        </Button>
      </Footer>
    </Container>
  );
};

export default Home;
