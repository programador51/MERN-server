const mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'});

const conectionDB = async() => {
    try{
        await mongoose.connect(process.env.DB_MONGO,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        });
        console.log(`Database coneted`);

    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = {conectionDB}