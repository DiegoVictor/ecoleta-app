import faker from 'faker';
import factory from 'factory-girl';

factory.define(
  'Point',
  {},
  {
    point: {
      id: () => String(faker.datatype.number()),
      name: faker.name.findName,
      city: faker.address.city,
      uf: faker.address.state,
      email: faker.internet.email,
      whatsapp: faker.phone.phoneNumber,
      image_url: faker.image.imageUrl,
      latitude: () => Number(faker.address.latitude()),
      longitude: () => Number(faker.address.longitude()),
    },
    items: [
      {
        title: faker.random.word(),
      },
    ],
  },
);

factory.define(
  'Item',
  {},
  {
    id: () => String(faker.datatype.number()),
    title: faker.random.word,
    image_url: faker.image.imageUrl,
  },
);

export default factory;
