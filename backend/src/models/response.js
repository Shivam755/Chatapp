class CustomResponse{
    constructor(success=false, data={}, error="") {
        this.success = success;
        this.data = data;
        this.error = error;
    }
}

module.exports = {CustomResponse};