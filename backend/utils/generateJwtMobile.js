  import jwt from "jsonwebtoken";
  export const generateJwtMobile = async (userId) => {
    console.log("USER ID: ", userId);
    try {
      // Generate the acces token
      const accessToken = jwt.sign({ userId }, process.env.JWT_KEY, {
        expiresIn: "15m",
      });

      // Generate the refresh token
      const refreshToken=jwt.sign({userId}, process.env.JWT_KEY,{
        expiresIn:"30d"
      });
  
      return { accessToken,refreshToken};
    } catch (error) {
      console.error("Error generating JWT token:", error);
    }
  };
