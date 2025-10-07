import { generateMockUsers } from './src/utils/mockingUsers.js';

(async ()=>{
    const users = await generateMockUsers(5);
    console.log(JSON.stringify(users, null, 2));
})();
