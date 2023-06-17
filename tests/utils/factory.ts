import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Point',
  {},
  {
    point: {
      id: () => String(faker.number.int()),
      name: faker.company.name,
      city: faker.location.city,
      uf: faker.location.state,
      email: faker.internet.email,
      whatsapp: faker.phone.number,
      image_url: faker.image.url,
      latitude: () => Number(faker.location.latitude()),
      longitude: () => Number(faker.location.longitude()),
    },
    items: [
      {
        title: faker.word.sample,
      },
    ],
  },
);

factory.define(
  'Item',
  {},
  {
    id: () => String(faker.number.int()),
    title: faker.word.sample,
    image_url: faker.image.url,
  },
);

export default factory;
