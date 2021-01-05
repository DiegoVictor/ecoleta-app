import React from 'react';
import faker from 'faker';
import { fireEvent, render } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
// import 'isomorphic-fetch';

import Points from '../../src/pages/Points';
import api from '../../src/services/api';
import factory from '../utils/factory';
import wait from '../utils/wait';

interface Item {
  id: string;
  title: string;
  image_url: string;
}

interface Point {
  point: {
    id: string;
    name: string;
    city: string;
    uf: string;
    email: string;
    whatsapp: string;
    image_url: string;
  };
  items: {
    title: string;
  }[];
}

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedParams = {
  uf: faker.address.stateAbbr(),
  city: faker.address.city(),
};

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => {
      return { goBack: mockedGoBack, navigate: mockedNavigate };
    },
    useRoute: () => {
      return {
        params: mockedParams,
      };
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    TouchableOpacity: (props: { [key: string]: any }) => {
      return <View {...props} />;
    },
  };
});

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    SvgUri: () => {
      return <View />;
    },
  };
});

describe('Points', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to go back to previous screen', async () => {
    const item = await factory.attrs<Item>('Item');
    const { point, items } = await factory.attrs<Point>('Point', {
      items: [{ title: item.title }],
    });

    jest.spyOn(Location, 'requestPermissionsAsync').mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          status: Location.PermissionStatus.GRANTED,
          expires: 'never',
          granted: false,
          canAskAgain: true,
        });
      });
    });

    jest.spyOn(Location, 'getCurrentPositionAsync').mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          timestamp: new Date().getTime(),
          coords: {
            latitude: Number(faker.address.latitude()),
            longitude: Number(faker.address.longitude()),
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
        });
      });
    });

    apiMock
      .onGet('/items')
      .reply(200, [item])
      .onGet('/points')
      .reply(200, [{ point, items }]);

    const { getByTestId } = render(<Points />);

    await wait(() => {
      fireEvent.press(getByTestId('back'));
    });

    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be able to unselect an item', async () => {
    const item = await factory.attrs<Item>('Item');
    const { point } = await factory.attrs<Point>('Point', {
      items: [{ title: item.title }],
    });

    jest.spyOn(Location, 'requestPermissionsAsync').mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          status: Location.PermissionStatus.GRANTED,
          expires: 'never',
          granted: false,
          canAskAgain: true,
        });
      });
    });

    jest.spyOn(Location, 'getCurrentPositionAsync').mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          timestamp: new Date().getTime(),
          coords: {
            latitude: Number(faker.address.latitude()),
            longitude: Number(faker.address.longitude()),
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
        });
      });
    });

    apiMock
      .onGet('/items')
      .reply(200, [item])
      .onGet('/points')
      .reply(200, [point]);

    const { getByTestId, debug } = render(<Points />);

    await wait(() => expect(getByTestId(`item_${item.id}`)).toBeTruthy());

    expect(getByTestId(`item_${item.id}`)).not.toHaveStyle({
      borderColor: '#34cb79',
      borderWidth: 2,
    });

    await wait(() => {
      fireEvent.press(getByTestId(`item_${item.id}`));
    });

    expect(getByTestId(`item_${item.id}`)).toHaveStyle({
      borderColor: '#34cb79',
      borderWidth: 2,
    });

    await wait(() => {
      fireEvent.press(getByTestId(`item_${item.id}`));
    });

    expect(getByTestId(`item_${item.id}`)).not.toHaveStyle({
      borderColor: '#34cb79',
      borderWidth: 2,
    });
  });

  it('should be able to see points on the map', async () => {
    const item = await factory.attrs<Item>('Item');
    const { point } = await factory.attrs<Point>('Point', {
      items: [{ title: item.title }],
    });

    jest.spyOn(Location, 'requestPermissionsAsync').mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          status: Location.PermissionStatus.GRANTED,
          expires: 'never',
          granted: false,
          canAskAgain: true,
        });
      });
    });

    jest.spyOn(Location, 'getCurrentPositionAsync').mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          timestamp: new Date().getTime(),
          coords: {
            latitude: Number(faker.address.latitude()),
            longitude: Number(faker.address.longitude()),
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
        });
      });
    });

    apiMock
      .onGet('/items')
      .reply(200, [item])
      .onGet('/points')
      .reply(200, [point]);

    const { getByTestId, debug } = render(<Points />);

    await wait(() => expect(getByTestId(`item_${item.id}`)).toBeTruthy());

    await wait(() => {
      fireEvent.press(getByTestId(`item_${item.id}`));
    });

    await wait(() => expect(getByTestId(`point_${point.id}`)).toBeTruthy());

    await wait(() => {
      fireEvent.press(getByTestId(`point_${point.id}`));
    });

    expect(mockedNavigate).toHaveBeenCalledWith('Detail', {
      point_id: point.id,
    });
  });

  it('should not be able to load items list with network error', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onGet('/items').reply(500);

    render(<Points />);

    await wait(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!',
    );
  });

  it('should not be able to load points list with network error', async () => {
    const item = await factory.attrs<Item>('Item');
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onGet('/items').reply(200, [item]).onGet('/points').reply(500);

    const { getByTestId } = render(<Points />);

    await wait(() => expect(getByTestId(`item_${item.id}`)).toBeTruthy());

    await wait(() => {
      fireEvent.press(getByTestId(`item_${item.id}`));
    });

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!',
    );
  });

  it('should not be able to get device location', async () => {
    const item = await factory.attrs<Item>('Item');
    const { point, items } = await factory.attrs<Point>('Point', {
      items: [{ title: item.title }],
    });
    const alert = jest.spyOn(Alert, 'alert');

    jest.spyOn(Location, 'requestPermissionsAsync').mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          status: Location.PermissionStatus.DENIED,
          expires: 'never',
          granted: false,
          canAskAgain: true,
        });
      });
    });

    apiMock
      .onGet('/items')
      .reply(200, [item])
      .onGet('/points')
      .reply(200, [{ point, items }]);

    render(<Points />);

    await wait(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Precisamos de sua permissão para obter a localização!',
    );
  });
});
