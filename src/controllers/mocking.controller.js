import { generateMockPets } from '../utils/mocking.js';

const getMockingPets = async(req,res)=>{
    const size = parseInt(req.query.size) || 100;
    const pets = generateMockPets(size);
    // Regresa una respuesta con la misma forma que otros endpoints: status + payload
    res.send({status: 'success', payload: pets});
}

export default { getMockingPets };
