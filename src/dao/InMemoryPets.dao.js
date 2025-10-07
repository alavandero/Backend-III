function randomObjectId(){
    const hex = [];
    const chars = 'abcdef0123456789';
    for(let i=0;i<24;i++) hex.push(chars[Math.floor(Math.random()*chars.length)]);
    return hex.join('');
}

export default class InMemoryPets {
    constructor(){
        this.items = [];
    }

    get = (params) =>{
        if(!params) return Promise.resolve(this.items.slice());
        const keys = Object.keys(params);
        return Promise.resolve(this.items.filter(i=> keys.every(k=> String(i[k]) === String(params[k]))));
    }

    getBy = (params) =>{
        const keys = Object.keys(params);
        const found = this.items.find(i=> keys.every(k=> String(i[k]) === String(params[k])));
        return Promise.resolve(found||null);
    }

    save = (doc) =>{
        const _id = doc._id || randomObjectId();
        const created = Object.assign({_id,__v:0}, doc);
        this.items.push(created);
        return Promise.resolve(created);
    }

    update = (id,doc) =>{
        const idx = this.items.findIndex(i=> String(i._id) === String(id));
        if(idx===-1) return Promise.resolve(null);
        this.items[idx] = Object.assign(this.items[idx], doc);
        return Promise.resolve(this.items[idx]);
    }

    delete = (id) =>{
        const idx = this.items.findIndex(i=> String(i._id) === String(id));
        if(idx===-1) return Promise.resolve(null);
        const removed = this.items.splice(idx,1)[0];
        return Promise.resolve(removed);
    }
}
