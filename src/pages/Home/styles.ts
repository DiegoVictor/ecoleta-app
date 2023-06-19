import styled from 'styled-components/native';
import { Pressable } from 'react-native';

export const Container = styled.ImageBackground`
  background-color: #f0f0f5;
  flex: 1;
  padding: 32px;
`;

export const Main = styled.View`
  flex: 1;
  justify-content: center;
`;

export const Title = styled.Text`
  color: #322153;
  font-family: 'Ubuntu_700Bold';
  font-size: 32px;
  margin-top: 64px;
  max-width: 260px;
`;

export const Description = styled.Text`
  color: #6c6c80;
  font-family: 'Roboto_400Regular';
  font-size: 16px;
  line-height: 24px;
  margin-top: 16px;
  max-width: 260px;
`;

export const Footer = styled.View``;

export const Select = {
  viewContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 60,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  inputAndroid: {
    fontSize: 18,
    height: 60,
    color: '#333',
  },
};

export const Button = styled(Pressable)`
  align-items: center;
  background-color: #34cb79;
  border-radius: 10px;
  flex-direction: row;
  height: 60px;
  margin-top: 8px;
  overflow: hidden;
`;

export const Icon = styled.View`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  justify-content: center;
  height: 60px;
  width: 60px;
`;

export const Label = styled.Text`
  color: #fff;
  flex: 1;
  font-family: 'Roboto_500Medium';
  font-size: 16px;
  justify-content: center;
  margin-left: -25px;
  text-align: center;
`;
