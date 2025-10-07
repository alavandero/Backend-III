import CustomError from './CustomError.js';

const createError = (key,opts={})=> new CustomError({name:key,message:opts.message||key,cause:opts.cause,code:opts.code||400});

const Errors = {
    USER_INCOMPLETE_VALUES: () => createError('USER_INCOMPLETE_VALUES',{message:'Missing user fields',code:400}),
    USER_ALREADY_EXISTS: () => createError('USER_ALREADY_EXISTS',{message:'User already exists',code:400}),
    USER_NOT_FOUND: () => createError('USER_NOT_FOUND',{message:'User not found',code:404}),
    PET_INCOMPLETE_VALUES: () => createError('PET_INCOMPLETE_VALUES',{message:'Missing pet fields',code:400}),
    PET_NOT_FOUND: () => createError('PET_NOT_FOUND',{message:'Pet not found',code:404}),
    VALIDATION_ERROR: (cause) => createError('VALIDATION_ERROR',{message:'Validation failed',cause,code:400}),
}

export default Errors;
