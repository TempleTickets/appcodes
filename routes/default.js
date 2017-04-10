/**
 * Created by AS168 on 2/15/2017.
 */
module.exports=function (server,sha512){
  server.get('/sha512/:text',function(req,res){
    res.end(sha512(req.params.text));
  })
}
