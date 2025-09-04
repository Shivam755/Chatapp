export default class ApiResponse<T>{
    public success:boolean;
    public data:T | null;
    public error:string | null;

    constructor(){
        this.success = true;
        this.data = null;
        this.error = null;
    }
}