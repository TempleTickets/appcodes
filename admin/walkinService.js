module.exports=function(server,services,bodyParser,uniqueId,marshal,fs,sha512){
  var walkinDate=1;
  var walkindateid=1;
  var walkinfamilymember=1;
  server.post("/bookwalkins",bodyParser,function(req,res){
    var params={
      TableName:"walkin_vastudosh",
      Item:{
        uniqueId:{S:uniqueId},
        id:{N:walkinDate.toString()},
        user_id:{S:req.body.user_id},
        devote_name:{S:req.body.devote_name},
        email_id:{S:req.body.email_id},
        mobile_number:{S:req.body.mobile_number},
        rashi:{S:req.body.rashi},
        gotra:{S:req.body.gotra},
        comment:{S:req.body.comment},
        ammenties:{S:req.body.ammenties.toString()}
      },
      ReturnItemCollectionMetrics:'SIZE'

    }
    var datesdata=[];
    var familydata=[];
    for(dateCount=0;dateCount<=req.body.dates.length-1;dateCount++)
    {
      var putData={
        PutRequest: {
          Item: {
            "uniqueId":{
              S:uniqueId
            },
            "user_id":{
              S:req.body.user_id.toString()
            },
            "from": {
              S: req.body.dates[dateCount].from
            },
            "to": {
              S: req.body.dates[dateCount].to
            },
            "walkinid": {
              S: walkinDate.toString()
            },
            "id": {
              N: walkindateid.toString()
            }
          }
        }
      }
      datesdata.push(putData);
      walkindateid++;
    }
    var params2={
      RequestItems: {
        "walkin_vastudosh_dates": datesdata
      }
    }
    for(familycount=0;familycount<=req.body.familymembers.length-1;familycount++){
      var putdata={
        PutRequest: {
          Item: {
            "uniqueId":{
              S:uniqueId
            },
            "user_id":{
              S:req.body.user_id.toString()
            },
            "name": {
              S: req.body.familymembers[familycount].name
            },
            "email": {
              S: req.body.familymembers[familycount].email
            },
            "phone": {
              S: req.body.familymembers[familycount].phone
            },
            "photo": {
              S: 'no image'
            },
            "walkinid": {
              S: walkinDate.toString()
            },
            "id": {
              N: walkinfamilymember.toString()
            }
          }
        }
      }
      familydata.push(putdata)
      walkinfamilymember++;
    }
    var params3={
      RequestItems:{
        'walkin_vastudosh_familymembers':familydata
      }
    }
  //  res.end(JSON.stringify(params3));
    services.bookWalkins(params).then(function(resp){
      services.addDatesForWalkin(params2).then(function(response){
        services.addFamilyMembers(params3).then(function(response){
          res.end(JSON.stringify({status:true,data:response,walinDate:walkinDate}));
          walkinDate++;
        }).catch(function(err){
          res.end(JSON.stringify({status:false,respose:"3",error:err}));
        })

      })
        .catch(function(err){
          res.end(JSON.stringify({status:false,respose:"2",error:err}));
        })

    }).catch(function(err){
      res.end(JSON.stringify({status:false,respose:"1",error:err}))
    })
  })

  server.post("/getwalkinslist",bodyParser,function(req,res){

    var params = {
      TableName: 'walkin_vastudosh',
      IndexName:'Index6',
      KeyConditionExpression: 'uniqueId=:val and user_id=:id  ',
      // KeySchema:{
      //   type:{S:'0'},
      //   email:{S:req.body.email},
      //  // password:{S:'123456'},
      // },
      // FilterExpression: 'id = :type',
      ExpressionAttributeValues: { // a map of substitutions for all attribute values
        ':id': {S:req.body.user_id.toString()},
        // ':type': {S:'1'},
        ':val':{S:uniqueId}
      },
     // Select:"ALL_PROJECTED_ATTRIBUTES",
      ConsistentRead: false, // optional (true | false)
      ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    };
    var params2 = {
      TableName: 'walkin_vastudosh_dates',
      IndexName:'Index1',
      KeyConditionExpression: 'uniqueId=:val and user_id=:id  ',
      // KeySchema:{
      //   type:{S:'0'},
      //   email:{S:req.body.email},
      //  // password:{S:'123456'},
      // },
      // FilterExpression: 'id = :type',
      ExpressionAttributeValues: { // a map of substitutions for all attribute values
        ':id': {S:req.body.user_id.toString()},
        // ':type': {S:'1'},
        ':val':{S:uniqueId}
      },
      //Select:"ALL_ATTRIBUTES",
      ConsistentRead: false, // optional (true | false)
      ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    };
    var params3 = {
      TableName: 'walkin_vastudosh_familymembers',
      IndexName:'Index1',
      KeyConditionExpression: 'uniqueId=:val and user_id=:id  ',
      // KeySchema:{
      //   type:{S:'0'},
      //   email:{S:req.body.email},
      //  // password:{S:'123456'},
      // },
      // FilterExpression: 'id = :type',
      ExpressionAttributeValues: { // a map of substitutions for all attribute values
        ':id': {S:req.body.user_id.toString()},
        // ':type': {S:'1'},
        ':val':{S:uniqueId}
      },
      //Select:"ALL_ATTRIBUTES",
      ConsistentRead: false, // optional (true | false)
      ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    };

    console.log(params);
    services.getWalkinsList(params).then(function(data){
         var walkinItems=data.Items.map(marshal.unmarshalItem);
      services.getWalkinsList(params2).then(function(data2){
        var walkinDates=data2.Items.map(marshal.unmarshalItem);
        services.getWalkinsList(params3).then(function(data3){
          var walkinFamilyMembers=data3.Items.map(marshal.unmarshalItem);

          walkinItems.forEach(function(val,key){
            walkinDatesNew=[];
            walkinFamilyMembersNew=[];
            walkinDates.forEach(function(val2,key2){
              if(val2.walkinid==val.id)
              {
                if(walkinDatesNew.indexOf(val2)==-1)
                {
                  walkinDatesNew.push(val2);
                }
              }
            })
            walkinFamilyMembers.forEach(function(val2,key2){
              if(val2.walkinid==val.id)
              {
                if(walkinFamilyMembersNew.indexOf(val2)==-1)
                {
                  walkinFamilyMembersNew.push(val2);
                }
              }
            })
            walkinItems[key].walkinDates=walkinDatesNew;
            walkinItems[key].walkinfamilymembers=walkinFamilyMembersNew;
          })
          res.end(JSON.stringify({status:true,walkins:walkinItems}));//,walkinDates:walkinDatesNew,familyMembers:walkinFamilyMembersNew}))
        })
          .catch(function(err){
            res.end(JSON.stringify({status:false,error:err,params:params3}))
          })

      }).catch(function(err){
        res.end(JSON.stringify({status:false,error:err,params:params2}))
      })

    }).catch(function(err){
      res.end(JSON.stringify({status:false,error:err,params:params}));
    })

  })

  server.get("/createwalkintable",function(req,res){
    var params={
      KeySchema: [
        {
          AttributeName: "uniqueId",
          KeyType: "HASH"
        },{
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
          AttributeName:"user_id",
          AttributeType:"S"
        }
      ],
      GlobalSecondaryIndexes:[
        {
          IndexName: "Index6",
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
            NonKeyAttributes: [ "user_id",'devote_name','email_id','mobile_number','rashi','gotra','comment','ammenties' ],
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
      },


      TableName: "walkin_vastudosh"

    };
    var params2={
      "TableName":'walkin_vastudosh_dates',
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
      AttributeDefinitions:[{
        AttributeName:'uniqueId',
        AttributeType:"S"
      },
        {
          AttributeName:'id',
          AttributeType:'N'
        },{
          AttributeName:'user_id',
          AttributeType:'S'
        }
      ],
      KeySchema:[
        {
          AttributeName: "uniqueId",
          KeyType: "HASH"
        },
        {
          AttributeName: "id",
          KeyType: "RANGE"
        }
      ],
      GlobalSecondaryIndexes:[{
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
          NonKeyAttributes: [ "user_id","walkinid",'from','to' ],
          ProjectionType: "INCLUDE"
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
        }
      },


      ]
    };
    var params3={
      "TableName":'walkin_vastudosh_familymembers',
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
      AttributeDefinitions:[{
        AttributeName:'uniqueId',
        AttributeType:"S"
      },
        {
          AttributeName:'id',
          AttributeType:'N'
        },{
          AttributeName:'user_id',
          AttributeType:'S'
        }
      ],
      KeySchema:[
        {
          AttributeName: "uniqueId",
          KeyType: "HASH"
        },
        {
          AttributeName: "id",
          KeyType: "RANGE"
        }
      ],
      GlobalSecondaryIndexes:[{
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
          NonKeyAttributes: [ "user_id","walkinid",'name','email','phone','image' ],
          ProjectionType: "INCLUDE"
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
        }
      },

      ]
    };
    services.createTable(params).then(function(data){
      services.createTable(params2).then(function(data2){
        services.createTable(params3).then(function(data3){
          res.end(JSON.stringify(data3));
        }).catch(function(err3){
          res.end(JSON.stringify(err3))
        })

      }).catch(function(err2){
        res.end(JSON.stringify(err2));
      })

    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.get("/deletewalkintable",function(req,res){
    var params={
      TableName:"walkin_vastudosh"
    }
    services.deleteTable({TableName:"walkin_vastudosh"}).then(function(data){
      services.deleteTable({TableName:"walkin_vastudosh_dates"}).then(function(data2){
        services.deleteTable({TableName:"walkin_vastudosh_familymembers"}).then(function(data3){
          res.end(JSON.stringify(data3))
        }).catch(function(err3){
          res.end(JSON.stringify(err3))
        })
      }).catch(function(err2){
        res.end(JSON.stringify(err2))
      })
    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.get("/describeTable/:table",bodyParser,function(req,res){
    console.log(req.params);

    var params={
      TableName:req.params.table
    }
    services.describeTable(params).then(function(data){
      res.end(JSON.stringify({status:true,data:data}));
    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.get("/scan/:table",bodyParser,function(req,res){
    var params={
      TableName: req.params.table,
     // Limit: 0, // optional (limit the number of items to evaluate)
      // ScanFilter: { // optional (map of attribute name to Condition)
      //
      //   attribute_name: {
      //     ComparisonOperator: 'EQ', // (EQ | NE | IN | LE | LT | GE | GT | BETWEEN |
      //                               //  NOT_NULL | NULL | CONTAINS | NOT_CONTAINS | BEGINS_WITH)
      //     AttributeValueList: [ { S: 'STRING_VALUE' }, ],
      //   },
      //   // more conditions ...
      // },
      Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES |
                                //           SPECIFIC_ATTRIBUTES | COUNT)
      // AttributesToGet: [ // optional (list of specific attribute names to return)
      //   'attribute_name',
      //   // ... more attributes ...
      // ],
      // Segment: 0, // optional (for parallel scan)
      // TotalSegments: 0, // optional (for parallel scan)
      // ExclusiveStartKey: { // optional (for pagination, returned by prior calls as LastEvaluatedKey)
      //   attribute_name: { S: 'STRING_VALUE' },
      //   // anotherKey: ...
      // },
      ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    }
    services.scanTable(params).then(function(data){
        res.end(JSON.stringify({status:true,data:data}));
    })
      .catch(function(err){
        res.end(JSON.stringify({status:false,error:err}));
      })
  })
}
