class DbValueInsertOnCreation{
    constructor({permissionRepository, roleRepository}){
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    insertDefaultPermissions = async () => {
        try {
            const defaultPermissions = [
                { name: "users:deleteOthers" },
                { name: "users:deleteSelf" },
                { name: "users:editSelf" },
                { name: "users:changePasswordSelf" },
                { name: "users:changePasswordOthers" },
                { name: "all:all" },
            ];

            await this.permissionRepository.addMultiplePermissionsIfNotExists(defaultPermissions);
            console.log("Default Permissions inserted successfully.");
        } catch (error) {
            console.error("Error inserting default Permissions:", error);
        }
    }

    insertDefaultRoles = async () => {
        try {
            const allId = await this.permissionRepository.getPermissionIdByName("all:all");
            if (!allId) {
                console.error("Default role 'all:all' permission not found. Cannot create default roles.");
                return;
            }
            const defaultPermissions = await this.permissionRepository.getPermissionIdsByNames([
                "users:editSelf",
                "users:changePasswordSelf",
                "users:deleteSelf"
            ]);
            if (!defaultPermissions || defaultPermissions.length === 0) {
                console.error("Default permissions not found. Cannot create default roles.");
                return;
            }
            const defaultRoles = [
                { name: "admin", permissions: [allId] },
                { name: "user", permissions: defaultPermissions },
            ];

            await this.roleRepository.addMultipleRolesIfNotExists(defaultRoles);
            console.log("Default Roles inserted successfully.");
        } catch (error) {
            console.error("Error inserting default Roles:", error);
        }
    };

    insertDefaultValues = async () => {
        await this.insertDefaultPermissions();
        await this.insertDefaultRoles();
    }
    
}

module.exports = { DbValueInsertOnCreation };