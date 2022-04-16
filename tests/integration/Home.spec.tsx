import React from 'react';
import faker from '@faker-js/faker';
import { fireEvent, render } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { Alert } from 'react-native';

import Home from '../../src/pages/Home';
import wait from '../utils/wait';
import ibge from '../../src/services/ibge';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => {
      return { navigate: mockedNavigate };
    },
  };
});

describe('Home', () => {
  const ibgeMock = new MockAdapter(ibge);

  it('should be able to choose state and city', async () => {
    const uf = faker.address.stateAbbr();
    const city = faker.address.city();

    ibgeMock
      .onGet('/estados')
      .reply(200, [
        {
          sigla: uf,
        },
      ])
      .onGet(`/estados/${uf}/municipios`)
      .reply(200, [{ nome: city }]);

    const { getByTestId } = render(<Home />);

    await wait(async () => {
      fireEvent(getByTestId('state'), 'onValueChange', uf);
    });

    await wait(async () => {
      fireEvent(getByTestId('city'), 'onValueChange', city);
    });

    fireEvent.press(getByTestId('submit'));

    expect(mockedNavigate).toHaveBeenCalledWith('Points', { uf, city });
  });

  it('should be alerted to choose a state and city', async () => {
    const uf = faker.address.stateAbbr();
    const city = faker.address.city();

    ibgeMock
      .onGet('/estados')
      .reply(200, [
        {
          sigla: uf,
        },
      ])
      .onGet(`/estados/${uf}/municipios`)
      .reply(200, [{ nome: city }]);

    const alert = jest.spyOn(Alert, 'alert');

    const { getByTestId } = render(<Home />);

    fireEvent.press(getByTestId('submit'));

    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith('Escolha um estado e uma cidade!');

    await wait(async () => {
      fireEvent(getByTestId('state'), 'onValueChange', uf);
    });

    fireEvent.press(getByTestId('submit'));

    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith('Escolha um estado e uma cidade!');
  });

  it('should be able to sort states alphabetically', async () => {
    const uf = 'RJ';
    const city = faker.address.city();

    ibgeMock
      .onGet('/estados')
      .reply(200, [
        {
          sigla: uf,
        },
        {
          sigla: 'SP',
        },
        {
          sigla: 'AM',
        },
        {
          sigla: uf,
        },
      ])
      .onGet(`/estados/${uf}/municipios`)
      .reply(200, [{ nome: city }]);

    const { getByTestId } = render(<Home />);

    await wait(async () => {
      fireEvent(getByTestId('state'), 'onValueChange', uf);
    });

    expect(
      getByTestId('state')
        .props.items.map(({ value }: { value: string }) => value)
        .filter((value: string) => value.length > 0),
    ).toStrictEqual(['AM', uf, 'SP']);
  });

  it('should not be able to load states list with network error', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    ibgeMock.onGet('/estados').reply(500);

    render(<Home />);

    await wait(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar a lista de estados, tente reabrir o Ecoleta!',
    );
  });

  it('should not be able to load cities list with network error', async () => {
    const uf = 'SP';
    const alert = jest.spyOn(Alert, 'alert');

    ibgeMock
      .onGet('/estados')
      .reply(200, [
        {
          sigla: uf,
        },
      ])
      .onGet(`/estados/${uf}/municipios`)
      .reply(500);

    const { getByTestId } = render(<Home />);

    await wait(async () => {
      fireEvent(getByTestId('state'), 'onValueChange', uf);
    });

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar a lista de municípios, tente reabrir o Ecoleta!',
    );
  });
});
