import userSchema from "./userSchema.js";

export const addUser = (obj) => {
  return userSchema(obj).save();
};

export const getUser = (obj) => {
  return userSchema.findUserById({ email });
};
