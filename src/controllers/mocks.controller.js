import { generateMockPets } from '../utils/mocking.js';
import { generateMockUsers } from '../utils/mockingUsers.js';
import { usersService, petsService } from '../services/index.js';

const getMockingPets = async(req,res)=>{
    const size = parseInt(req.query.size) || 100;
    const pets = generateMockPets(size);
    res.send({status: 'success', payload: pets});
}

const getMockingUsers = async(req,res)=>{
    const size = parseInt(req.query.size) || 50;
    const users = await generateMockUsers(size);
    res.send({status:'success', payload: users});
}

const generateData = async(req,res,next)=>{
    try{
        const usersCount = parseInt(req.body.users) || 0;
        const petsCount = parseInt(req.body.pets) || 0;
        const created = {users:0,pets:0};
        if(usersCount>0){
            const users = await generateMockUsers(usersCount);
            // insert users via usersService
            for(const u of users){
                // usersService.create espera un documento sin _id usualmente; dao lo ignorará si hay _id
                await usersService.create({
                    first_name: u.first_name,
                    last_name: u.last_name,
                    email: u.email,
                    password: u.password,
                    role: u.role,
                    pets: u.pets
                });
                created.users++;
            }
        }
        if(petsCount>0){
            const pets = generateMockPets(petsCount);
            for(const p of pets){
                await petsService.create({
                    name: p.name,
                    specie: p.specie,
                    birthDate: p.birthDate,
                    adopted: p.adopted,
                    owner: p.owner,
                    image: p.image
                });
                created.pets++;
            }
        }
        // Comprobar con los servicios GET
        const allUsers = await usersService.getAll();
        const allPets = await petsService.getAll();
        res.send({status:'success', created, usersCount: allUsers.length, petsCount: allPets.length});
    }catch(err){
        next(err);
    }
}

export default { getMockingPets, getMockingUsers, generateData };
