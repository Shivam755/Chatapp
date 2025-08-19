const { createContainer, asFunction, asClass, asValue } = require("awilix");

// db and others
const { loadMongoose } = require("./utilities/dbConnection");
const { DbValueInsertOnCreation } = require("./utilities/defaultValues");
const { getRedisClient } = require("./utilities/RedisConnection");

// models
const userModel = require("./models/user.model");
const permissionModel = require("./models/permission.model");
const roleModel = require("./models/role.model");

// repositories
const { UserRepository } = require("./repositories/user.repository");
const {
  PermissionRepository,
} = require("./repositories/permission.repository");
const { RoleRepository } = require("./repositories/role.repository");

// services
const { UserService } = require("./services/user.service");
const { PermissionService } = require("./services/permission.service");
const { RoleService } = require("./services/role.service");

// controllers
const { UserController } = require("./controllers/user.controller");
const { PermissionController } = require("./controllers/permission.controller");
const { RoleController } = require("./controllers/role.controller");
const { Encryption } = require("./utilities/Encryption");

class DIContainer {
  static #instance;

  static getInstance = async () => {
    if (!this.#instance) {
      console.log("created a new instance");
      await this.RegisterContainer();
    }
    return this.#instance;
  };

  static RegisterContainer = async () => {
    this.#instance = createContainer();
    const mongooseDB = await loadMongoose();
    const redisClient = await getRedisClient();
    // db and otehrs
    this.#instance.register({
      mongoose: asValue(mongooseDB),
      dbValueInsertOnCreation: asClass(DbValueInsertOnCreation).singleton(),
      redisClient: asValue(redisClient),
      encryption: asClass(Encryption).singleton(),
    });

    // models
    this.#instance.register({
      User: asFunction(userModel).singleton(),
      Permission: asFunction(permissionModel).singleton(),
      Role: asFunction(roleModel).singleton(),
    });

    // repositories
    this.#instance.register({
      userRepository: asClass(UserRepository).singleton(),
      permissionRepository: asClass(PermissionRepository).singleton(),
      roleRepository: asClass(RoleRepository).singleton(),
    });

    // services
    this.#instance.register({
      userService: asClass(UserService).singleton(),
      permissionService: asClass(PermissionService).singleton(),
      roleService: asClass(RoleService).singleton(),
    });

    // controllers
    this.#instance.register({
      userController: asClass(UserController).singleton(),
      permissionController: asClass(PermissionController).singleton(),
      roleController: asClass(RoleController).singleton(),
    });
    this.#instance = this.#instance;
  };
}

module.exports = { GetContainer: DIContainer.getInstance };
