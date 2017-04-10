module.exports=function(server,services,bodyParser,uniqueId,marshal,devoteeId,sha512)
{
    server.get("/createdevoteetable",function(req,res){
            var params={
                TableName:'devotee',
                KeySchema: [
                    {
                        AttributeName: "uniqueId",
                        KeyType: "HASH"
                    },{
                        AttributeName: "email",
                        KeyType:"RANGE"
                    }
                ],
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
                        AttributeName: "password",
                        AttributeType: "S"
                    },
                    {
                        AttributeName: "email",
                        AttributeType: "S"
                    }
                ],
                GlobalSecondaryIndexes:[
                    {
                    IndexName: "Index1",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "password",
                            KeyType: "RANGE"
                        }

                    ],
                    Projection: {
                        NonKeyAttributes: [ "user_id","first_name","last_name","password" ],
                        ProjectionType: "INCLUDE"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                },{
                    IndexName: "Index2",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "user_id",
                            KeyType: "RANGE"
                        }

                    ],
                    Projection: {
                        NonKeyAttributes: [ "user_id" ],
                        ProjectionType: "INCLUDE"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
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
                    res.end(JSON.stringify({status:false,error:err}));
                })
    })
    server.post("/login",bodyParser,function(req,res){
        var params={
            TableName:'devotee',
            IndexName:'Index1',
            KeyConditionExpression: 'uniqueId=:val and password=:password  ',
            // KeySchema:{
            //   id:{N:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':email': {S:req.body.email},
                ':password': {S:req.body.password},
                ':val':{S:uniqueId}
            },
            // AttributesToGet: [ // optional (list of specific attribute names to return)
            //     'last_name',"email","first_name"
            //     // ... more attribute names ...
            // ],
            // Select:"SPECIFIC_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
        }
        services.login(params).then(function(data){
            if(data.Items.length>0){
            data.Items=data.Items.map(marshal.unmarshalItem);
               // data.Items=data.Items.map(marshal.unmarshalItem)
                delete data.Items[0].password;
            res.end(JSON.stringify({status:true,"data":data.Items[0]}));
            }
            else{
                res.end(JSON.stringify({status:false,error:"No data found"}));
            }
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.post("/register",bodyParser,function(req,res){
                var params={
                    TableName:"devotee",
                    Item:{
                        uniqueId:{S:uniqueId},
                        user_id:{N:devoteeId.toString()},
                        email:{S:req.body.email},
                        password:{S:req.body.password},
                        first_name:{S:req.body.first_name},
                        last_name:{S:req.body.last_name},
                    },
                    ConditionExpression: 'attribute_not_exists(email)',
                    ReturnItemCollectionMetrics:'SIZE'
               }
               services.register(params).then(function(data){
                   devoteeId++;
                     res.end(JSON.stringify({status:true,data:data}));
               })
                   .catch(function(err){

                       res.end(JSON.stringify({status:false,error:'Email Already Exists'}))
                   })
    })
    server.get("/deletedevoteetable",function(req,res){
        services.deleteTable({TableName:'devotee'}).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        }).catch(function(err){
            res.end(JOSN.stringify({status:false,error:err}));
        })
    })
}
