let url
if(process.env.PRODUCTION){
    url = "http://3.18.205.56/api"
}else{
    url = "http://localhost:8080/api"
}
export default url