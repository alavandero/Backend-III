import CustomError from '../errors/CustomError.js';

export default function errorHandler(err,req,res,next){
    // Si es nuestro CustomError, respetar el código y el mensaje
    if(err instanceof CustomError){
        return res.status(err.code||500).send({status:'error',error:err.message});
    }
    // Manejo por defecto para formas comunes de error
    if(err && err.name === 'ValidationError'){
        return res.status(400).send({status:'error',error:'Validation Error'});
    }
    console.error('Unhandled error:', err);
    return res.status(500).send({status:'error',error:'Internal server error'});
}
