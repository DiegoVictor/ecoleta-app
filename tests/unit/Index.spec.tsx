import { faker } from '@faker-js/faker';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Index from '../../src/app';

const mockAxiosGet = jest.fn();
jest.mock('../../src/services/ibge', () => {
  return {
    ibge: {
      get: () => mockAxiosGet(),
    },
  };
});

const mockNavigate = jest.fn();
jest.mock('expo-router', () => {
  return {
    router: {
      navigate: (options: NavigationOptions) => mockNavigate(options),
    },
  };
});

describe('Index', () => {
  it('should be able to choose state and city', async () => {
    const uf = faker.location.state({ abbreviated: true });
    const city = faker.location.city();

    mockAxiosGet
      .mockResolvedValueOnce({ data: [{ sigla: uf }] })
      .mockResolvedValueOnce({ data: [{ nome: city }] });

    const { getByTestId } = await render(<Index />);

    await fireEvent(getByTestId('state'), 'onValueChange', uf);
    await fireEvent(getByTestId('city'), 'onValueChange', city);

    await fireEvent.press(getByTestId('submit'));

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/points',
      params: { uf, city },
    });
  });

  it('should be alerted to choose a state and city', async () => {
    const uf = faker.location.state({ abbreviated: true });
    const city = faker.location.city();

    mockAxiosGet
      .mockResolvedValueOnce({ data: [{ sigla: uf }] })
      .mockResolvedValueOnce({ data: [{ nome: city }] });

    const alert = jest.spyOn(Alert, 'alert');

    const { getByTestId } = await render(<Index />);

    await fireEvent.press(getByTestId('submit'));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith('Escolha um estado e uma cidade!');

    await fireEvent(getByTestId('state'), 'onValueChange', uf);

    await fireEvent.press(getByTestId('submit'));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith('Escolha um estado e uma cidade!');
  });

  it('should be able to sort states alphabetically', async () => {
    const uf = 'RJ';
    const city = faker.location.city();

    mockAxiosGet
      .mockResolvedValueOnce({
        data: [{ sigla: uf }, { sigla: 'SP' }, { sigla: 'AM' }, { sigla: uf }],
      })

      .mockResolvedValueOnce({ data: [{ nome: city }] });

    const { getByTestId } = await render(<Index />);

    await fireEvent(getByTestId('state'), 'onValueChange', uf);

    expect(
      getByTestId('state')
        .props.items.map(({ value }: { value: string }) => value)
        .filter((value: string) => value.length > 0),
    ).toStrictEqual(['AM', uf, 'SP']);
  });

  it('should not be able to load states list with network error', async () => {
    const alert = jest.spyOn(Alert, 'alert');

    mockAxiosGet.mockRejectedValueOnce(new Error('Network Error'));

    await render(<Index />);

    await waitFor(() => expect(alert).toHaveBeenCalled());

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar a lista de estados, tente reabrir o Ecoleta!',
    );
  });

  it('should not be able to load cities list with network error', async () => {
    const uf = 'SP';
    const alert = jest.spyOn(Alert, 'alert');

    mockAxiosGet
      .mockResolvedValueOnce({ data: [{ sigla: uf }] })
      .mockRejectedValueOnce(new Error('Network Error'));

    const { getByTestId } = await render(<Index />);

    await fireEvent(getByTestId('state'), 'onValueChange', uf);

    expect(alert).toHaveBeenCalledWith(
      'Opa! Alguma coisa deu errado ao tentar carregar a lista de municípios, tente reabrir o Ecoleta!',
    );
  });
});
