const { createContainer, asFunction, asClass, asValue } = require("awilix");
const { loadMongoose } = require("./repositories/dbConnection");
const { UserRepository } = require("./repositories/user.repository");
const userModel = require("./models/user.model");
const permissionModel = require("./models/permission.model");
const roleModel = require("./models/role.model");
const { UserService } = require("./services/user.service");
const { PermissionService } = require("./services/permission.service");
const { RoleService } = require("./services/role.service");
const { UserController } = require("./controllers/user.controller");
const {
  PermissionRepository,
} = require("./repositories/permission.repository");
const { PermissionController } = require("./controllers/permission.controller");
const { RoleRepository } = require("./repositories/role.repository");
const { RoleController } = require("./controllers/role.controller");

class DIContainer {
  static #instance;

  static getInstance = async () => {
    if (!this.#instance) {
      console.log("created a new instance");
      await this.CreateContainer();
    }
    return this.#instance;
  };

  static CreateContainer = async () => {
    const container = createContainer();
    const mongooseDB = await loadMongoose();
    container.register({
      mongoose: asValue(mongooseDB),
    });

    // models
    container.register({
      User: asFunction(userModel).singleton(),
      Permission: asFunction(permissionModel).singleton(),
      Role: asFunction(roleModel).singleton(),
    });

    // repositories
    container.register({
      userRepository: asClass(UserRepository).singleton(),
      permissionRepository: asClass(PermissionRepository).singleton(),
      roleRepository: asClass(RoleRepository).singleton(),
    });

    // services
    container.register({
      userService: asClass(UserService).singleton(),
      permissionService: asClass(PermissionService).singleton(),
      roleService: asClass(RoleService).singleton(),
    });

    // controllers
    container.register({
      userController: asClass(UserController).singleton(),
      permissionController: asClass(PermissionController).singleton(),
      roleController: asClass(RoleController).singleton(),
    });
    this.#instance = container;
  };
}

module.exports = { GetContainer: DIContainer.getInstance };
