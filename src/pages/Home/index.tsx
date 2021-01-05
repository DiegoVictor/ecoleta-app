import React, { useState, useEffect, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Image, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';

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
  key: string;
}

interface UfPickerItem extends SelectItem {
  key: string;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [uf, setUf] = useState('');
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [city, setCity] = useState('');

  const navigation = useNavigation();

  const handleNavigationToPoints = useCallback(() => {
    navigation.navigate('Points', { uf, city });
  }, [uf, city]);

  const handleSelectedUf = useCallback((value: string) => {
    setUf(value);

    (async () => {
      try {
        const { data } = await ibge.get<City[]>(`/estados/${value}/municipios`);
        setCities(
          data
            .map(({ nome }) => ({ label: nome, value: nome, key: nome }))
            .sort(),
        );
      } catch (err) {
        Alert.alert(
          'Opa! Alguma coisa deu errado ao tentar carregar a lista de municípios, tente reabrir o Ecoleta!',
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ibge.get<UF[]>('/estados');

        const uniqueItems: { [key: string]: UfPickerItem } = {};

        data.forEach(({ sigla }) => {
          if (!uniqueItems[sigla]) {
            return (uniqueItems[sigla] = {
              label: sigla,
              value: sigla,
              key: sigla,
            });
          }
        });

        setUfs(
          Object.values(uniqueItems).sort((a, b) => {
            if (a.label > b.label) {
              return 1;
            }

            return -1;
          }),
        );
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
        <Picker
          onValueChange={value => handleSelectedUf(String(value))}
          selectedValue={uf}
          style={Select.viewContainer}
          itemStyle={Select.inputAndroid}
          testID="state"
        >
          <Picker.Item
            value=""
            label="Selecione uma UF"
            color={Select.inputAndroid.color}
          />
          {ufs.map(uf => (
            <Picker.Item key={uf.key} value={uf.value} label={uf.label} />
          ))}
        </Picker>
        <Picker
          onValueChange={value => setCity(String(value))}
          selectedValue={city}
          style={Select.viewContainer}
          itemStyle={Select.inputAndroid}
          testID="city"
        >
          <Picker.Item
            value=""
            label="Selecione uma cidade"
            color={Select.inputAndroid.color}
          />
          {cities.map(city => (
            <Picker.Item key={city.key} value={city.value} label={city.label} />
          ))}
        </Picker>

        <Button onPress={handleNavigationToPoints} testID="submit">
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
