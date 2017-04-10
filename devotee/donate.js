module.exports=function(server,services,bodyParser,uniqueId,marshal,querybuilder,sha512)
{
    var donateid=1;
    server.get("/createdonationtable",function(req,res){
       var params={
           TableName:'donations',
           KeySchema:[{
               AttributeName: "uniqueId",
               KeyType: "HASH"
           },{
               AttributeName: "id",
               KeyType:"RANGE"
           }],
           AttributeDefinitions: [
               {
                   AttributeName: "uniqueId",
                   AttributeType: "S"
               },
               {
                   AttributeName: "user_id",
                   AttributeType: "N"
               },
               {
                   AttributeName: "id",
                   AttributeType: "S"
               },
               {
                   AttributeName: "temple_id",
                   AttributeType: "S"
               }

           ],
           LocalSecondaryIndexes: [{
               IndexName: "Index1",
               KeySchema: [
                   {
                       AttributeName: "uniqueId",
                       KeyType: "HASH"
                   },{
                       AttributeName: "user_id",
                       KeyType: "RANGE"
                   }
               ],
               Projection: {
                   NonKeyAttributes: [ "user_id" ],
                   ProjectionType: "INCLUDE"
               }
           },{
               IndexName: "Index2",
               KeySchema: [
                   {
                       AttributeName: "uniqueId",
                       KeyType: "HASH"
                   },{
                       AttributeName: "temple_id",
                       KeyType: "RANGE"
                   }
               ],
               Projection: {
                   NonKeyAttributes: [ "temple_id" ],
                   ProjectionType: "INCLUDE"
               }
           }],
           ProvisionedThroughput: {
               ReadCapacityUnits: 10,
               WriteCapacityUnits: 10
           }
       }
       services.createTable(params).then(function(data){
           res.end(JSON.stringify({status:true,data:data}))
       }).catch(function(err){
           res.end(JSON.stringify({status:false,error:err}))
       })
    })
    server.post("/donate",function(req,res){
        querybuilder().table("donations")
            .create({
                uniqueId:uniqueId,
                id:donateid.toString(),
                user_id:req.body.user_id,
                temple_id:req.body.temple_id
            }).then(function(data){
                donateid++;
                res.end(JSON.stringify({status:true,data:data}));
        })
            .catch(function(err){
                res.end(JSON.stringify({status:false,error:err}));
            })
    })
    server.post("/getemplesfordonation",function(req,res){
        querybuilder().table('register')
            .select('email','id','temple_name','address','trusty','uniqueId','start_time','end_time')
            .where('uniqueId',uniqueId)
            .then(function(data){
                querybuilder().table('donations')
                    .indexName('Index1')
                    .select("user_id","id","temple_id")
                    .where('uniqueId',uniqueId)
                    .where('user_id',req.body.user_id)
                    .then(function(data2){
                        data.Items.forEach(function(val,key){
                            data.Items[key].isDonate=false;
                            data2.Items.forEach(function(val2){
                                if(val.id==val2.temple_id)
                                {
                                    data.Items[key].isDonate=true;
                                    data.Items[key].donate_id=val2.id,
                                        data.Items[key].temple_id=val2.temple_id
                                }
                            })
                        })
                        res.end(JSON.stringify({status:true,data:data.Items}))
                    })
                    .catch(function(err){
                        res.end(JSON.stringify({status:false,error:err}))
                    })
            })
            .catch(function(err){
                res.end(JSON.stringify({status:false,error:err}))
            })
    })
}
