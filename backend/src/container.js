const { createContainer, asFunction, asClass, asValue, listModules } = require("awilix");
const path = require("path");

// db and others
const { loadMongoose } = require("./utilities/dbConnection");
const { DbValueInsertOnCreation } = require("./utilities/defaultValues");
const { getRedisClient } = require("./utilities/RedisConnection");
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
    // db and others
    this.#instance.register({
      mongoose: asValue(mongooseDB),
      dbValueInsertOnCreation: asClass(DbValueInsertOnCreation).singleton(),
      redisClient: asValue(redisClient),
      encryption: asClass(Encryption).singleton(),
    });

    // auto loading models
    this.#instance.loadModules(
      [
        ["src/models/*.model.js"],
        // you can add more models here
      ],
      {
        formatName: (name) => {
          name = name.split(".")[0];
          name = name.charAt(0).toUpperCase() + name.slice(1);
          return name;
        },
        resolverOptions: {
          lifetime: "SINGLETON",
          register: asFunction
        },
      }
    );
    // auto loading repositories, services, controllers, middlewares
    this.#instance.loadModules(
      [
        ["src/repositories/*.repository.js"],
        ["src/services/*.service.js"],
        ["src/controllers/*.controller.js"],
        ["src/middlewares/*.middleware.js"],
      ],
      {
        formatName: "camelCase",
        resolverOptions: {
          lifetime: "SINGLETON",
          register: asClass,
        },
      }
    );

  };
}

module.exports = { GetContainer: DIContainer.getInstance };
