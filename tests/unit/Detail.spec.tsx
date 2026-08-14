import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as MailComposer from 'expo-mail-composer';
import { Alert, Linking } from 'react-native';
import Detail from '../../src/app/detail';
import { factory } from '../utils/factory';

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

const mockAxiosGet = jest.fn();
jest.mock('../../src/services/api', () => {
  return {
    api: {
      get: () => mockAxiosGet(),
    },
  };
});

describe('Detail', () => {
  it('should be able to see a collect point details', async () => {
    const { point, items } = await factory.attrs<Point>('Point');

    mockUseLocalSearchParams.mockReturnValue({ pointId: point.id });
    mockAxiosGet.mockResolvedValueOnce({ data: { point, items } });

    const { getByText } = await render(<Detail />);

    await waitFor(() => getByText(point.name));

    expect(getByText(point.name)).toBeTruthy();
    expect(getByText(`${point.city}, ${point.uf}`)).toBeTruthy();
    expect(getByText(items.map(({ title }) => title).join(', '))).toBeTruthy();
  });

  it('should be able to back to previous screen', async () => {
    const { point, items } = await factory.attrs<Point>('Point');

    mockUseLocalSearchParams.mockReturnValue({ pointId: point.id });
    mockAxiosGet.mockResolvedValueOnce({ data: { point, items } });

    const { getByTestId } = await render(<Detail />);

    await waitFor(() => getByTestId('back'));
    await fireEvent.press(getByTestId('back'));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should be able to share through whatsapp', async () => {
    const { point, items } = await factory.attrs<Point>('Point');
    const openURL = jest.spyOn(Linking, 'openURL');

    mockUseLocalSearchParams.mockReturnValue({ pointId: point.id });
    mockAxiosGet.mockResolvedValueOnce({ data: { point, items } });

    const { getByTestId } = await render(<Detail />);

    await waitFor(() => getByTestId('whatsapp'));

    await fireEvent.press(getByTestId('whatsapp'));

    expect(openURL).toHaveBeenCalledWith(
      `whatsapp://send?phone=${point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`,
    );
  });

  it('should be able to share through mail', async () => {
    const { point, items } = await factory.attrs<Point>('Point');
    const composeAsync = jest.spyOn(MailComposer, 'composeAsync');

    mockUseLocalSearchParams.mockReturnValue({ pointId: point.id });
    mockAxiosGet.mockResolvedValueOnce({ data: { point, items } });

    const { getByTestId } = await render(<Detail />);

    await waitFor(() => getByTestId('mail'));

    await fireEvent.press(getByTestId('mail'));

    expect(composeAsync).toHaveBeenCalledWith({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point.email],
    });
  });

  it('should not be able to see a collect point details with network error', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    mockUseLocalSearchParams.mockReturnValue({ pointId: '1' });
    mockAxiosGet.mockRejectedValueOnce(new Error('Network error'));

    await render(<Detail />);

    await waitFor(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!',
    );
  });
});
