import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import Constants from 'expo-constants';

export const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  padding: 32px;
  padding-top: ${20 + Constants.statusBarHeight}px;
`;

export const Cover = styled.Image`
  border-radius: 10px;
  height: 120px;
  margin-top: 32px;
  width: 100%;
`;

export const Name = styled.Text`
  color: #322153;
  font-family: 'Ubuntu_700Bold';
  font-size: 28px;
  margin-top: 24px;
`;

export const Items = styled.Text`
  color: #34cb79;
  font-family: 'Roboto_400Regular';
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  margin-top: 8px;
`;

export const Address = styled.View`
  margin-top: 32px;
`;

export const Title = styled.Text`
  color: #322153;
  font-family: 'Roboto_500Medium';
  font-size: 16px;
`;

export const Content = styled.Text`
  color: #6c6c80;
  font-family: 'Roboto_400Regular';
  line-height: 24px;
  margin-top: 8px;
`;

export const Footer = styled.View`
  border-color: #999;
  border-top-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 32px;
  padding-bottom: 0px;
`;

export const Button = styled(Pressable)`
  align-items: center;
  background-color: #34cb79;
  border-radius: 10px;
  flex-direction: row;
  height: 50px;
  justify-content: center;
  width: 48%;
`;

export const Label = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Roboto_500Medium';
  margin-left: 8px;
`;
