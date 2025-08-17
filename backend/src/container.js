const { createContainer, asFunction, asClass, asValue } = require("awilix");


// db and others
const { loadMongoose } = require("./utilities/dbConnection");
const { DbValueInsertOnCreation } = require("./utilities/defaultValues");
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
    // db and otehrs
    container.register({
      mongoose: asValue(mongooseDB),
      dbValueInsertOnCreation: asClass(DbValueInsertOnCreation).singleton(),
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
