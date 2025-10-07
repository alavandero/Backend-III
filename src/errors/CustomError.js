export default class CustomError extends Error{
    constructor({name='CustomError',message='Error',cause=null,code=500}){
        super(message);
        this.name = name;
        this.cause = cause;
        this.code = code;
    }
}
