import React from 'react';
import faker from 'faker';
import { fireEvent, render } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import * as MailComposer from 'expo-mail-composer';
import { Alert, Linking } from 'react-native';

import Detail from '../../src/pages/Detail';
import api from '../../src/services/api';
import factory from '../utils/factory';
import wait from '../utils/wait';

interface Point {
  point: {
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

const point_id = faker.random.number();
const mockedParams = {
  point_id,
};
const mockedGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => {
      return { goBack: mockedGoBack };
    },
    useRoute: () => {
      return {
        params: mockedParams,
      };
    },
  };
});

describe('Detail', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to see a collect point details', async () => {
    const { point, items } = await factory.attrs<Point>('Point');

    apiMock.onGet(`/points/${point_id}`).reply(200, { point, items });

    const { getByText } = render(<Detail />);

    await wait(() => expect(getByText(point.name)).toBeTruthy());

    expect(getByText(point.name)).toBeTruthy();
    expect(getByText(`${point.city}, ${point.uf}`)).toBeTruthy();
    expect(getByText(items.map(({ title }) => title).join(', '))).toBeTruthy();
  });

  it('should be able to back to previous screen', async () => {
    const { point, items } = await factory.attrs<Point>('Point');

    apiMock.onGet(`/points/${point_id}`).reply(200, { point, items });

    const { getByTestId } = render(<Detail />);

    await wait(() => expect(getByTestId('back')).toBeTruthy());
    fireEvent.press(getByTestId('back'));

    expect(mockedGoBack).toHaveBeenCalled();
  });

  it('should be able to share through whatsapp', async () => {
    const { point, items } = await factory.attrs<Point>('Point');
    const openURL = jest.spyOn(Linking, 'openURL');

    apiMock.onGet(`/points/${point_id}`).reply(200, { point, items });

    const { getByTestId } = render(<Detail />);

    await wait(() => expect(getByTestId('whatsapp')).toBeTruthy());

    fireEvent.press(getByTestId('whatsapp'));

    expect(openURL).toHaveBeenCalledWith(
      `whatsapp://send?phone=${point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`,
    );
  });

  it('should be able to share through mail', async () => {
    const { point, items } = await factory.attrs<Point>('Point');
    const composeAsync = jest.spyOn(MailComposer, 'composeAsync');

    apiMock.onGet(`/points/${point_id}`).reply(200, { point, items });

    const { getByTestId } = render(<Detail />);

    await wait(() => expect(getByTestId('mail')).toBeTruthy());

    fireEvent.press(getByTestId('mail'));

    expect(composeAsync).toHaveBeenCalledWith({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point.email],
    });
  });

  it('should not be able to see a collect point details with network error', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onGet(`/points/${point_id}`).reply(500);

    render(<Detail />);

    await wait(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado, tente reabrir o Ecoleta!',
    );
  });
});
