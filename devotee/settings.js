module.exports=function(server,services,bodyParser,uniqueId,marshal,path,fs,sha512)
{
    var setting_id=1;
    server.post("/setsettings",function(req,res){
        var params={
            TableName:'devoteesettings',
            Item:{
                uniqueId:{S:uniqueId.toString()},
                user_id:{N:req.body.user_id.toString()},
                id:{N:setting_id.toString()},
                upcoming_pooja:{N:req.body.upcoming_pooja.toString()},
                upcoming_accomodation:{N:req.body.upcoming_pooja.toString()},
                new_offer:{N:req.body.new_offer.toString()}
            }

        }
        services.setSettings(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.post("/changepassword",function(req,res){
        var params={
            TableName:"devotee",
            Key:{
                email:{S:req.body.email.toString()},
                uniqueId:{S:uniqueId.toString()}
            },
            UpdateExpression:"set password=:password  ",
            ExpressionAttributeValues:{
                ":password":{S:req.body.pass.toString()}
            },

            ReturnValues:"UPDATED_NEW"
        };
        services.changePassword(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.post("/getsettings",function(req,res){
        var params={
            TableName:'devoteesettings',
            KeyConditionExpression: 'uniqueId=:val and user_id=:id  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            // FilterExpression: 'id = :type',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':id': {N:req.body.user_id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)

        }
        var params2=
        {
            TableName:'devotee',
                //IndexName:'Index2',
            KeyConditionExpression: 'uniqueId=:val and email=:id  ',
            // KeySchema:{
            //   id:{N:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
            ':id': {S:req.body.email.toString()},
            ':val':{S:uniqueId}
        },
            // AttributesToGet: [ // optional (list of specific attribute names to return)
            //     'last_name',"email","first_name"
            //     // ... more attribute names ...
            // ],
             Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
                ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
        };

        services.getSettings(params).then(function(data){
            setting_id++;
            var settings=(data.Items.length>0)?data.Items.map(marshal.unmarshalItem)[0]:{};
            services.login(params2).then(function(data2){

                var detail=(data2.Items.length>0)?data2.Items.map(marshal.unmarshalItem)[0]:{};
                settings.detail=detail;
                res.end(JSON.stringify({status:true,data:settings}));
            }).catch(function(err){
                res.end(JSON.stringify({status:true,data:settings,detail_error:err}));
            })

        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.get("/createsettingtable",function(req,res){
        var params={
            TableName:'devoteesettings',
            KeySchema:[
                {
                    AttributeName:'uniqueId',
                    KeyType:'HASH'
                },
                {
                    AttributeName:'user_id',
                    KeyType:'RANGE'
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
                    AttributeName: "id",
                    AttributeType: "N"
                },

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
                            AttributeName: "id",
                            KeyType: "RANGE"
                        }

                    ],
                    Projection: {
                        NonKeyAttributes: [ "user_id","id","upcoming_pooja","upcoming_accomodation","new_offer" ],
                        ProjectionType: "INCLUDE"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                },
            ],
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
    server.get("/deletesettingtable",function(req,res){
        var params={
            TableName:'devoteesettings'
        }
        services.deleteTable(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}))
        })
    })

}
