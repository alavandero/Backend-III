// Utilidad para generar mascotas de mock con el mismo formato que regresaría mongoose

function randomChoice(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

const NAMES = ['Max','Luna','Charlie','Bella','Rocky','Molly','Buddy','Lucy','Jack','Daisy'];
const SPECIES = ['dog','cat','rabbit','hamster','parrot'];

function randomObjectId(){
    // devuelve una cadena de 24 caracteres hexadecimales como un ObjectId de Mongo
    const hex = [];
    const chars = 'abcdef0123456789';
    for(let i=0;i<24;i++) hex.push(chars[Math.floor(Math.random()*chars.length)]);
    return hex.join('');
}

export function generateMockPets(count = 100){
    const pets = [];
    for(let i=0;i<count;i++){
        const _id = randomObjectId();
        const name = randomChoice(NAMES) + '_' + Math.floor(Math.random()*10000);
        const specie = randomChoice(SPECIES);
        const birthDate = new Date(Date.now() - Math.floor(Math.random()*5*365*24*60*60*1000));
        const adopted = false;
    const owner = null; // sin owner como se solicitó
        const image = null;
        pets.push({
            _id,
            name,
            specie,
            birthDate,
            adopted,
            owner,
            image,
            // Los documentos de Mongoose frecuentemente incluyen __v
            __v: 0
        })
    }
    return pets;
}

export default { generateMockPets };
