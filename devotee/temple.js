module.exports=function(server,services,bodyParser,uniqueId,marshal,devoteeId,sha512)
{
    var bookId=1;
    server.post("/gettemplelist",function(req,res){
        var params={
                TableName: 'register',

                Select: 'SPECIFIC_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES |
                                          //           SPECIFIC_ATTRIBUTES | COUNT)
                AttributesToGet: [ // optional (list of specific attribute names to return)
                  'email','id','temple_name','address','trusty','uniqueId','start_time','end_time'
                  // ... more attributes ...
                ],

                ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
            }
        var params2={
                TableName: 'templeDetail',

                Select: 'SPECIFIC_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES |
                                          //           SPECIFIC_ATTRIBUTES | COUNT)
                AttributesToGet: [ // optional (list of specific attribute names to return)
                  'email','id','temple_name','address','trusty','uniqueId','start_time','end_time'
                  // ... more attributes ...
                ],

                ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
            }
        services.scanTable(params).then(function(data){
            var temple=data.Items.map(marshal.unmarshalItem);
             services.scanTable(params2).then(function(data2){
                var timings=data2.Items.map(marshal.unmarshalItem);
                  temple.forEach(function(val,key){
                    timings.forEach(function(val2,key2){
                        if(val.id==val2.id)
                        {
                            temple[key].start_time=val2.morning_open_time;
                            temple[key].end_time=val2.morning_close_time;
                        }
                    })
                })
                data.Items
                res.end(JSON.stringify({status:true,list:temple}));
            })
            .catch(function(err){
                res.end(JSON.stringify({status:false,error:err}));
            })
          }).catch(function(err){
                res.end(JSON.stringify({status:false,error:err}));
            })
    })
    server.post("/getpoojalist",function(req,res){
        var params = {
            TableName: 'pooja',
            IndexName:'Index1',
            KeyConditionExpression: 'uniqueId=:val and user_id=:id  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            // FilterExpression: 'id = :type',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':id': {S:req.body.temple_id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        var params2={
                TableName: 'register',

                Select: 'SPECIFIC_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES |
                //           SPECIFIC_ATTRIBUTES | COUNT)
                AttributesToGet: [ // optional (list of specific attribute names to return)
                    'id','temple_name'
                    // ... more attributes ...
                ],

                ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
            };
        var  params3={
            TableName:"bookedPoojas",
            IndexName:'Index1',
            KeyConditionExpression: 'uniqueId=:val and user_id=:user_id  ',
            // KeySchema:{
            //   id:{N:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
           // FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                  ':user_id': {N:req.body.user_id.toString()},
                    ':val':{S:uniqueId}
                },
            // AttributesToGet: [ // optional (list of specific attribute names to return)
            //     'pooja_id',"id","temple_id"
            //     // ... more attribute names ...
            // ],
             Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
        }
        services.gePoojaList(params).then(function(data) {
            services.scanTable(params2).then(function(data2){
                services.getPoojaList(params3).then(function(data3){
                    var poojaList=data.Items.map(marshal.unmarshalItem);
                    var templeList=data2.Items.map(marshal.unmarshalItem);
                    var bookedList=data3.Items.map(marshal.unmarshalItem);
                    poojaList.forEach(function(val,key){
                        poojaList[key].isBooked=false;
                        templeList.forEach(function(val2,key2){
                            if(val.user_id==val2.id)
                            {
                                poojaList[key].temple_name=val2.temple_name;
                            }
                        })
                        bookedList.forEach(function(val2,key2){
                            if(val.id==val2.pooja_id)
                            {
                                poojaList[key].isBooked=true;
                            }

                        })
                    })
                    res.end(JSON.stringify({status:true,data:poojaList,booked:bookedList})); // successful response
                })
                    .catch(function(err){
                        res.end(JSON.stringify({status:false,error:err}));
                    })

            })
            .catch(function(err){
                res.end(JSON.stringify({status:false,error:err}));
            })

        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        });
    })
    server.post("/bookpooja",function(req,res){
        var params= {
            TableName: 'bookedPoojas',
            Item: {
                user_id: {N: req.body.user_id.toString()},
                temple_id: {S: req.body.temple_id.toString()},
                pooja_id: {S: req.body.pooja_id.toString()},
                uniqueId: {S: uniqueId},
                id:{S:bookId.toString()}
            }
        };
        services.bookPooja(params).then(function(data){
            bookId++;
            res.end(JSON.stringify({status:true,data:data}))
        })
        .catch(function(err){
            res.end(JSON.stringify({status:false,error:err}))
        })
    })
    server.get("/createbookpoojatable",function(req,res){
        var params={
            TableName:'bookedPoojas',
            KeySchema: [
                {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                },{
                    AttributeName: "id",
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
                {
                    AttributeName: "temple_id",
                    AttributeType: "S"
                },
                {
                    AttributeName: "pooja_id",
                    AttributeType: "S"
                },
                {
                    AttributeName: "is_accepted",
                    AttributeType: "S"
                }

            ],
            LocalSecondaryIndexes:[
                {
                    IndexName: "Index1",
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

                },
                {
                    IndexName: "Index2",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "temple_id",
                            KeyType: "RANGE"
                        }

                    ],

                    Projection: {
                        NonKeyAttributes: [ "temple_id" ],
                        ProjectionType: "INCLUDE"
                    },
                },
                {
                    IndexName: "Index3",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "pooja_id",
                            KeyType: "RANGE"
                        }

                    ],
                    Projection: {
                        NonKeyAttributes: [ "pooja_id" ],
                        ProjectionType: "INCLUDE"
                    },

                },
                {
                    IndexName: "Index4",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "is_accepted",
                            KeyType: "RANGE"
                        }

                    ],
                    Projection: {
                        NonKeyAttributes: [ "is_accepted" ],
                        ProjectionType: "INCLUDE"
                    },

                }
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
    server.get("/deletebookedpoojatable",function(req,res){
        var params={
            TableName:'bookedPoojas'
        }
        services.deleteTable(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}))
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.get("/createTempleLiketable",function(req,res){
        var params={
            TableName:'TempleLikes',
            KeySchema:[
                {
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
                },
                {
                    AttributeName: "like",
                    AttributeType: "S"
                }
            ],
            LocalSecondaryIndexes:[
                {
                    IndexName: "Index1",
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

                },
                {
                    IndexName: "Index2",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "temple_id",
                            KeyType: "RANGE"
                        }

                    ],

                    Projection: {
                        NonKeyAttributes: [ "temple_id" ],
                        ProjectionType: "INCLUDE"
                    },
                },
                {
                    IndexName: "Index3",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "like",
                            KeyType: "RANGE"
                        }

                    ],
                    Projection: {
                        NonKeyAttributes: [ "like" ],
                        ProjectionType: "INCLUDE"
                    },

                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
    })
}
