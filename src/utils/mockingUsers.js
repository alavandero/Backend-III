import { createHash } from './index.js';

function randomChoice(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

const FIRST = ['Juan','María','Carlos','Ana','Luis','Sofía','Diego','Lucía','Mateo','Valentina'];
const LAST = ['García','Rodríguez','López','Martínez','Pérez','González','Sosa','Ríos','Romero','Torres'];
const ROLES = ['user','admin'];

function randomObjectId(){
    const hex = [];
    const chars = 'abcdef0123456789';
    for(let i=0;i<24;i++) hex.push(chars[Math.floor(Math.random()*chars.length)]);
    return hex.join('');
}

export async function generateMockUsers(count = 50){
    const users = [];
    for(let i=0;i<count;i++){
        const _id = randomObjectId();
        const first_name = randomChoice(FIRST) + '_' + Math.floor(Math.random()*1000);
        const last_name = randomChoice(LAST);
        const email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}${Math.floor(Math.random()*1000)}@example.com`;
        // password debe ser 'coder123' encriptada
        const password = await createHash('coder123');
        const role = randomChoice(ROLES);
        const pets = [];
        users.push({
            _id,
            first_name,
            last_name,
            email,
            password,
            role,
            pets,
            __v:0
        })
    }
    return users;
}

export default { generateMockUsers };
