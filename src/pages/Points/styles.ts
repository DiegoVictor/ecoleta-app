import styled, { css } from 'styled-components/native';
import Constants from 'expo-constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';

export const Container = styled.View`
  flex: 1;
  padding: 0px 32px;
  padding-top: ${20 + Constants.statusBarHeight}px;
`;

export const Title = styled.Text`
  font-family: 'Ubuntu_700Bold';
  font-size: 20px;
  margin-top: 24px;
`;

export const Description = styled.Text`
  color: #6c6c80;
  font-family: 'Roboto_400Regular';
  font-size: 16px;
  margin-top: 4px;
`;

export const MapContainer = styled.View`
  flex: 1;
  border-radius: 10px;
  margin-top: 16px;
  overflow: hidden;
  width: 100%;
`;

export const Map = styled(MapView)`
  height: 100%;
  width: 100%;
`;

export const Pin = styled(Marker)`
  height: 100px;
  width: 90px;
`;

export const PinBox = styled.View`
  align-items: center;
  background-color: #34cb79;
  border-radius: 8px;
  flex-direction: column;
  height: 70px;
  overflow: hidden;
  width: 90px;
`;

export const PinArrow = styled.View`
  align-items: center;
  position: absolute;
  top: 62px;
  width: 90px;
`;

export const PinImage = styled.Image`
  height: 45px;
  width: 90px;
`;

export const PinTitle = styled.Text`
  color: #fff;
  flex: 1;
  font-family: 'Roboto_400Regular';
  font-size: 13px;
  line-height: 23px;
`;

export const Items = styled.View`
  flex-direction: row;
  margin-bottom: 32px;
  margin-top: 16px;
`;

export const Item = styled(TouchableOpacity)`
  align-items: center;
  background-color: #fff;
  border-color: #eee;
  border-radius: 8px;
  border-width: 2px;
  height: 120px;
  justify-content: space-between;
  margin-right: 8px;
  padding: 20px 16px 16px;
  text-align: center;
  width: 120px;

  ${props =>
    props.selected &&
    css`
      border-color: #34cb79;
      border-width: 2px;
    `}
`;

export const Label = styled.Text`
  font-family: 'Roboto_400Regular';
  font-size: 13px;
  text-align: center;
`;
