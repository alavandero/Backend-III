import UserRepository from "../repository/UserRepository.js";
import PetRepository from "../repository/PetRepository.js";
import AdoptionRepository from "../repository/AdoptionRepository.js";

const useInMemory = process.env.USE_IN_MEMORY === 'true';

let usersDao, petsDao, adoptionDao;
if(useInMemory){
	const InMemoryUsers = await import('../dao/InMemoryUsers.dao.js');
	const InMemoryPets = await import('../dao/InMemoryPets.dao.js');
	const InMemoryAdoption = await import('../dao/InMemoryAdoption.dao.js').catch(()=>null);
	usersDao = new InMemoryUsers.default();
	petsDao = new InMemoryPets.default();
	// adoption DAO optional; if not present we'll use a lightweight in-memory placeholder
	if(InMemoryAdoption && InMemoryAdoption.default){
		adoptionDao = new InMemoryAdoption.default();
	}else{
		adoptionDao = { get: async()=>[], getBy: async()=>null, save: async()=>null, update: async()=>null, delete: async()=>null };
	}
}else{
	const Users = await import('../dao/Users.dao.js');
	const Pets = await import('../dao/Pets.dao.js');
	const Adoption = await import('../dao/Adoption.js');
	usersDao = new Users.default();
	petsDao = new Pets.default();
	adoptionDao = new Adoption.default();
}

export const usersService = new UserRepository(usersDao);
export const petsService = new PetRepository(petsDao);
export const adoptionsService = new AdoptionRepository(adoptionDao);
