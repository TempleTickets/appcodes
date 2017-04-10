module.exports=function(server,services,bodyParser,uniqueId,marshal,fs,sha512,path)
{
    var usercount=1;
    server.get("/createdietytable",function(req,res){
        var params={
            TableName:'dieties',
            KeySchema: [
                {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "id",
                    KeyType: "RANGE"
                }

            ],
            AttributeDefinitions: [
                {
                    AttributeName: "uniqueId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "id",
                    AttributeType: "N"
                },
                {
                    AttributeName: "user_id",
                    AttributeType: "S"
                }
            ],
            LocalSecondaryIndexes:
                [{
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
                        NonKeyAttributes: [ "name" ,"image","detail","user_id","parent_id"],
                        ProjectionType: "INCLUDE"
                    }
                }],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
        services.createTable(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}))
        })
    })
    server.get("/deletedietytable",function(req,res){
        var params={
            TableName:'dieties',

        }
        services.deleteTable(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}))
        })
    })
    server.post("/adddiety",function(req,res){
        var filename='uploads/dieties/'+sha512(parseInt(Math.random()*1000000000).toString())+'.png';
        fs.writeFile(filename,req.body.image,'base64',function(err){
            if(!err)
            {
                var params={
                    TableName:'dieties',
                    Item: {
                        uniqueId: {S: uniqueId},
                        id: {N: usercount.toString()},
                        name: {S: req.body.name},
                        //password: {S: req.body.password},
                        image: {S: filename},
                        detail: {S: req.body.details},
                        //trusty: {S: req.body.trusty},
                        user_id: {S: req.body.user_id.toString()},
                        //parent_id: {S: req.body.id.toString()},
                        //start_time:{S:req.body.start_time},
                        //end_time:{S:req.body.end_time}
                    }
                }
                services.addDiety(params).then(function(data){
                    usercount++
                    res.end(JSON.stringify({status:true,data:data}));
                }).catch(function(err){
                    res.end(JSON.stringify({status:false,error:err}))
                })
            }
            else{
                res.end(JSON.stringify({status:false,error:err}));
            }
        })

    })
    server.post("/dietylist",function(req,res){
        var params={
            TableName:"dieties",
            IndexName:'Index1',
            KeyConditionExpression: 'uniqueId=:val and user_id=:id  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            // FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':id': {S:req.body.user_id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            //AttributesToGet:["email","uniqueId","about_temple","id","isParent","temple_name","mobile_no1","mobile_no2","address"],
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)

        }
        services.getDieties(params).then(function(data){
            var data=data.Items.map(marshal.unmarshalItem);
            data.forEach(function(val,key){
                data[key].image=path+val.image;
            })
            res.end(JSON.stringify({status:true,data:data}))
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
}
