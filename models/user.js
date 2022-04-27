const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
      firstName:{
            type:String,
            required:true
      },
      lastName:{
            type:String,
            required:true
      },
      email:{
            type:String,
            required:true
      },
     password: {
        type:String,
        required:true
      },
      confirmPassword:{
          type:String,
          required:true
      },
      acceptTandC:{
          type:Boolean,
          required:true,
          default:false
      } ,
      img:{
            // data:Buffer,
            //contentType:String,
            type:String,
            required:false
      }
});
// registering my schema for further use in application
module.exports=mongoose.model('User',userSchema);