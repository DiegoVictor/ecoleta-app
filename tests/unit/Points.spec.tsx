import { faker } from '@faker-js/faker';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { PropsWithChildren } from 'react';
import { Alert } from 'react-native';
import Points from '../../src/app/points';
import { factory } from '../utils/factory';

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

jest.mock('react-native-svg', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Image } = require('react-native');
  return {
    SvgUri: Image,
  };
});

const mockAxiosGet = jest.fn();
jest.mock('../../src/services/api', () => {
  return {
    api: {
      get: () => mockAxiosGet(),
    },
  };
});

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockUseLocalSearchParams = jest.fn();
jest.mock('expo-router', () => {
  return {
    router: {
      navigate: (options: NavigationOptions) => mockNavigate(options),
      back: () => mockGoBack(),
    },
    useLocalSearchParams: () => mockUseLocalSearchParams(),
  };
});

jest.mock('react-native-maps', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const MockReturnView: React.FC<PropsWithChildren> = ({
    children,
    ...props
  }) => {
    return <View {...props}>{children}</View>;
  };

  return {
    __esModule: true,
    default: MockReturnView,
    Marker: MockReturnView,
  };
});

const mockRequestForegroundPermissionsAsync = jest.fn();
const mockGetCurrentPositionAsync = jest.fn();
jest.mock('expo-location', () => {
  return {
    requestForegroundPermissionsAsync: () =>
      mockRequestForegroundPermissionsAsync(),
    getCurrentPositionAsync: () => mockGetCurrentPositionAsync(),
  };
});

describe('Points', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be able to go back to previous screen', async () => {
    const item = await factory.attrs<Item>('Item');
    const { point } = await factory.attrs<Point>('Point', {
      items: [{ title: item.title }],
    });

    mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
      expires: 'never',
      granted: false,
      canAskAgain: true,
    });

    mockGetCurrentPositionAsync.mockResolvedValueOnce({
      timestamp: new Date().getTime(),
      coords: {
        latitude: Number(faker.location.latitude()),
        longitude: Number(faker.location.longitude()),
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    });

    mockAxiosGet.mockResolvedValueOnce({ data: [item] });

    mockUseLocalSearchParams.mockReturnValue({
      uf: point.uf,
      city: point.city,
    });

    const { getByTestId } = await render(<Points />);

    await fireEvent.press(getByTestId('back'));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should be able to unselect an item', async () => {
    const item = await factory.attrs<Item>('Item');
    const { point } = await factory.attrs<Point>('Point', {
      items: [{ title: item.title }],
    });

    mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
      expires: 'never',
      granted: false,
      canAskAgain: true,
    });

    mockGetCurrentPositionAsync.mockResolvedValueOnce({
      timestamp: new Date().getTime(),
      coords: {
        latitude: Number(faker.location.latitude()),
        longitude: Number(faker.location.longitude()),
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    });

    mockAxiosGet.mockResolvedValueOnce({ data: [item] });

    mockUseLocalSearchParams.mockReturnValue({
      uf: point.uf,
      city: point.city,
    });

    const { getByTestId } = await render(<Points />);

    await waitFor(() => getByTestId(`item_${item.id}`));

    expect(getByTestId(`item_${item.id}`)).not.toHaveStyle({
      borderColor: '#34cb79',
      borderWidth: 2,
    });

    await fireEvent.press(getByTestId(`item_${item.id}`));

    expect(getByTestId(`item_${item.id}`)).toHaveStyle({
      borderColor: '#34cb79',
      borderWidth: 2,
    });

    await fireEvent.press(getByTestId(`item_${item.id}`));

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

    mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
      expires: 'never',
      granted: false,
      canAskAgain: true,
    });

    mockGetCurrentPositionAsync.mockResolvedValueOnce({
      timestamp: new Date().getTime(),
      coords: {
        latitude: Number(faker.location.latitude()),
        longitude: Number(faker.location.longitude()),
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    });

    mockAxiosGet
      .mockResolvedValueOnce({ data: [item] })
      .mockResolvedValueOnce({ data: [point] });

    mockUseLocalSearchParams.mockReturnValue({
      uf: point.uf,
      city: point.city,
    });

    const { getByTestId } = await render(<Points />);

    await waitFor(() => getByTestId(`item_${item.id}`));
    await fireEvent.press(getByTestId(`item_${item.id}`));

    await waitFor(() => getByTestId(`point_${point.id}`));
    await fireEvent.press(getByTestId(`point_${point.id}`));

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/detail',
      params: {
        pointId: point.id,
      },
    });
  });

  it('should not be able to load items list with network error', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
      expires: 'never',
      granted: false,
      canAskAgain: true,
    });

    mockGetCurrentPositionAsync.mockResolvedValueOnce({
      timestamp: new Date().getTime(),
      coords: {
        latitude: Number(faker.location.latitude()),
        longitude: Number(faker.location.longitude()),
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    });

    mockAxiosGet.mockRejectedValueOnce(new Error('Network Error'));

    mockUseLocalSearchParams.mockReturnValue({
      uf: 'SP',
      city: 'São Paulo',
    });

    await render(<Points />);

    await waitFor(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!',
    );
  });

  it('should not be able to load points list with network error', async () => {
    const item = await factory.attrs<Item>('Item');
    const alert = jest.spyOn(Alert, 'alert');

    mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
      expires: 'never',
      granted: false,
      canAskAgain: true,
    });

    mockGetCurrentPositionAsync.mockResolvedValueOnce({
      timestamp: new Date().getTime(),
      coords: {
        latitude: Number(faker.location.latitude()),
        longitude: Number(faker.location.longitude()),
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    });

    mockAxiosGet
      .mockResolvedValueOnce({ data: [item] })
      .mockRejectedValueOnce(new Error('Network Error'));

    mockUseLocalSearchParams.mockReturnValue({
      uf: 'SP',
      city: 'São Paulo',
    });

    const { getByTestId } = await render(<Points />);

    await waitFor(() => getByTestId(`item_${item.id}`));

    await fireEvent.press(getByTestId(`item_${item.id}`));

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

    mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'denied',
      expires: 'never',
      granted: false,
      canAskAgain: true,
    });

    mockAxiosGet
      .mockResolvedValueOnce({ data: [item] })
      .mockResolvedValueOnce({ data: [{ point, items }] });

    mockUseLocalSearchParams.mockReturnValue({
      uf: 'SP',
      city: 'São Paulo',
    });

    await render(<Points />);

    await waitFor(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Precisamos de sua permissão para obter a localização!',
    );
    expect(mockGetCurrentPositionAsync).not.toHaveBeenCalled();
  });
});
