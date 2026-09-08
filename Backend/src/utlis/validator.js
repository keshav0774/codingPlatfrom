const validator = require('validator');


const validate = (data)=>{
     
    const mandatoryField = ['firstName', 'emailId', 'password'];

    const IsAllow = mandatoryField.every((value)=> Object.keys(data).includes(value));
    if(!IsAllow)
        throw new Error('Field Is Missing')
    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");
    if(!validator.isStrongPassword(data.password))
        throw new Error("Please Choose a Strong Password"); 
}


module.exports = validate;