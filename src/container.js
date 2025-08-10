const { createContainer, asFunction, asClass, asValue } = require("awilix");
const { loadMongoose } = require("./repositories/dbConnection");
const { UserRepository } = require("./repositories/user.repository")

const container = createContainer();

container.register({
  db: asFunction(loadMongoose).singleton(),
    userRepository: asClass(UserRepository)
});

module.exports = { container };
