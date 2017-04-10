module.exports=function(server,services,bodyParser,uniqueId,marshal,path,fs,sha512)
{
    var profileId=1;
    server.post("/addprofile",function(req,res){
        console.log(req.body);
        var filename='uploads/userProfile/profile_'+sha512(req.body.user_id.toString())+'.jpg';
        fs.writeFile(filename,req.body.image,'base64',function(error){
            if(!error)
            {
                var params={
                    TableName:"profiledetails",
                    Item:{
                        first_name:{S:req.body.first_name},
                        user_id:{N:req.body.user_id.toString()},
                        id:{S:profileId.toString()},
                        uniqueId:{S:uniqueId.toString()},
                        last_name:{S:req.body.last_name},
                        email:{S:req.body.email},
                        mobile_no:{S:req.body.mobile_no},
                        dob:{S:req.body.dob},
                        gender:{S:req.body.gender},
                        dom:{S:req.body.dom},
                        gotra:{S:req.body.gotra},
                        rashi:{S:req.body.rashi},
                        nakshtra:{S:req.body.nakshtra},
                        address:{S:req.body.address},
                        pin_no:{S:req.body.pin_no},
                        pan_no:{S:req.body.pan_no},
                        image:{S:filename.toString()}
                    }
                }
                services.addProfile(params).then(function(data){
                    profileId++;
                    res.end(JSON.stringify({status:true,data:data}))
                }).catch(function(err){
                    res.end(JSON.stringify({status:false,error:err}));
                })
            }
            else{
                res.end(JSON.stringify({status:false,error:error}));
            }
        })

    })
    server.get("/createprofiletable",function(req,res){
        var params={
            TableName:'profiledetails',
            KeySchema: [
                {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                },{
                    AttributeName: "user_id",
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
                    AttributeName: "id",
                    AttributeType: "S"
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
                        NonKeyAttributes: [ "user_id","id","first_name","last_name","email","mobile_no","dob","dom","gotra","rashi","nakshatra","gender","address","pin_no","pan_no","image" ],
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
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.get("/deleteprofiletable",function(req,res){
        var params={
            TableName:"profiledetails"
        }
        services.deleteTable(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        })
            .catch(function(err){
                res.end(JSON.stringify({status:false,error:err}));
            })
    })
    server.post("/getmyprofile",function(req,res){
        var params={
            TableName:'profiledetails',
           // IndexName:'Index1',
            KeyConditionExpression: 'uniqueId=:val and user_id=:profileid  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            // FilterExpression: 'id = :type',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':profileid': {N:req.body.user_id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        }
        services.getMyProfile(params).then(function(data){
            data.Items=data.Items.map(marshal.unmarshalItem)
            var profile={};
            if(data.Items.length>0){
                var profile=data.Items[0];
                profile.image=path+profile.image;
            }
            res.end(JSON.stringify({status:true,data:profile}))
        }).catch(function(err){
            res.end(JSON.stringify({status:true,error:err}));
        })

    })
}
