const { createContainer, asFunction, asClass, asValue } = require("awilix");
const { loadMongoose } = require("./repositories/dbConnection");
const { UserRepository } = require("./repositories/user.repository");
const userModel = require("./models/user.model");
const { UserService } = require("./services/user.service");
const { UserController } = require("./controllers/user.controller");

const CreateContainer = async () => {
  const container = createContainer();
  const mongooseDB = await loadMongoose();
  container.register({
    mongoose: asValue(mongooseDB),
  });

  // models
  container.register({
    User: asFunction(userModel).singleton(),
  });

  // repositories
  container.register({
    userRepository: asClass(UserRepository).singleton(),
  });

  // services
  container.register({
    userService: asClass(UserService).singleton(),
  });

  // controllers
  container.register({
    userController: asClass(UserController).singleton(),
  });
  return container;
};
module.exports = { CreateContainer };
