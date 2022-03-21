const {
    requestPasswordResetAdmin,
    passwordResetAdmin,
   
  } = require("../services/passwordReset.service");
  
  
  
  const resetPasswordRequestController = async (req, res) => {
    const requestPasswordResetService = await requestPasswordResetAdmin(
      req , res
    );
  // return res.json(requestPasswordResetService);
  };
  
  const resetPasswordController = async (req, res) => {
    const resetPasswordService = await passwordResetAdmin(
      req , res
    );
  // return res.json(resetPasswordService);
  };
  
  module.exports = {
    resetPasswordRequestController,
    resetPasswordController,
  };