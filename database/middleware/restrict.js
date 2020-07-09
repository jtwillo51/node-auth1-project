const usersModel = require("../../users/users-model");

function restrict() {
  const authErr = {
    message: "You shall not pass!",
  };
  return async (req, res, next) => {
    try {
      const { username, password } = req.headers;

      if (!username || !password) {
        return res.status(401).json(authErr);
      }
      const user = await usersModel.findBy({ username }).first();
      if (!user) {
        return res.status(401).json(authErr);
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json(authErr);
      }

      if(!req.session || !req.session.user){
        res.status(401).json(authErr)
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
module.exports = restrict;