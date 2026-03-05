import mongoose from "mongoose";

const TagModel=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },

})
const Tag=mongoose.model("Tag",TagModel);
export {Tag};