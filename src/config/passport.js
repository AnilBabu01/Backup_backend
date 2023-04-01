const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const {
  userModel,
  usersRolesModel,
  roleModel,
  employees,
} = require("../models");
const Admin = require("../models/admin.model");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await userModel.findOne({
      where: { id: payload.sub, role_id: payload.role },
      attributes: ["id", "username", "mobileNo", "email", "role_id"],
    });

    const employee = await employees.findOne({
      where: { id: payload.sub, role_id: payload.role },
      attributes: ["id", "username", "email", "role_id"],
    });
    const admins = await Admin.findOne({
      where: { id: payload.sub, role_id: payload.role },
      attributes: ["id", "username", "mobileNo", "email", "role_id"],
    });

    
    if (!user && !employee && !admins) {
      return done(null, false);
    }
    // eslint-disable-next-line prefer-destructuring
    if (user) {
      done(null, user);
    } else if (employee) {
      done(null, employee);
    } else if (admins) {
      done(null, admins);
    }
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
