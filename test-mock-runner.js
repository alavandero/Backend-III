import { generateMockPets } from './src/utils/mocking.js';

const pets = generateMockPets(5);
console.log(JSON.stringify(pets, null, 2));
