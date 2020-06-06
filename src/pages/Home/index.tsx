import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Image, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import ibge from '../../services/ibge';
import Background from '../../assets/home-background.png';
import Logo from '../../assets/logo.png';
import {
  Container,
  Main,
  Title,
  Description,
  Footer,
  Select,
  Button,
  Icon,
  Label,
} from './styles';

interface UF {
  sigla: string;
}

interface City {
  nome: string;
}

interface SelectItem {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [uf, setUf] = useState('');
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [city, setCity] = useState('');

  const navigation = useNavigation();

  const handleNavigationToPoints = () => {
    navigation.navigate('Points', { uf, city });
  };

  const handleSelectedUf = (value: string) => {
    setUf(value);

    if (value.length > 0 && value !== uf) {
      (async () => {
        try {
          const { data } = await ibge.get<City[]>(
            `/estados/${value}/municipios`,
          );
          if (data.length > 0) {
            setCities(
              data.map(({ nome }) => ({ label: nome, value: nome })).sort(),
            );
          }
        } catch (err) {
          Alert.alert(
            'Opa! Alguma coisa deu errado ao tentar carregar a lista de municípios, tente reabrir o Ecoleta!',
          );
        }
      })();
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ibge.get<UF[]>('/estados');
        if (data.length > 0) {
          setUfs(
            data
              .map(({ sigla }) => ({
                label: sigla,
                value: sigla,
                key: sigla,
              }))
              .sort((a, b) => {
                if (a.label > b.label) {
                  return 1;
                }

                if (a.label < b.label) {
                  return -1;
                }

                return 0;
              }),
          );
        }
      } catch (err) {
        Alert.alert(
          'Opa! Alguma coisa deu errado ao tentar carregar a lista de estados, tente reabrir o Ecoleta!',
        );
      }
    })();
  }, []);

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
        <RNPickerSelect
          placeholder={{
            label: 'Selecione uma UF',
            value: '',
            key: 'UF',
          }}
          onValueChange={value => handleSelectedUf(value)}
          items={ufs}
          value={uf}
          style={Select}
        />
        <RNPickerSelect
          placeholder={{
            label: 'Selecione uma cidade',
            value: '',
            key: 'Cidade',
          }}
          onValueChange={value => setCity(value)}
          items={cities}
          value={city}
          style={Select}
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
