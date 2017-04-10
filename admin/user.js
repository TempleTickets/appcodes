module.exports=function(server,services,bodyParser,uniqueId,marshal,fs,sha512,userCount){
  server.post("/adduser",bodyParser,function(req,res){

    var params={
      TableName:'users',
      Item:{
        temple_id:{S:req.body.user_id.toString()},
        temple_name:{S:'aty'},
        id:{N:userCount.toString()},
        uniqueId:{S:uniqueId},
        name:{S:req.body.name},
        email:{S:req.body.email},
        password:{S:req.body.password},
        address:{S:req.body.address},
        phone:{S:req.body.phone},

      },
      ConditionExpression: 'attribute_not_exists(email)',
      ReturnItemCollectionMetrics:'SIZE'
    };
    console.log(params)
    services.addUser(params).then(function(result){
        userCount++;
      res.end(JSON.stringify({status:true,message:result}));
    }).catch(function(err){
      res.end(JSON.stringify({status:false,error:err}));
    })



  })
  server.get("/createusertable",function(req,res){
    var params={
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
        },{
          AttributeName: "temple_id",
          AttributeType: "S"
        },{
          AttributeName: "name",
          AttributeType: "S"
        },{
          AttributeName: "email",
          AttributeType: "S"
        },{
          AttributeName: "password",
          AttributeType: "S"
        },{
          AttributeName: "address",
          AttributeType: "S"
        },{
          AttributeName: "phone",
          AttributeType: "S"
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
              AttributeName: "temple_id",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "temple_id","temple_name","id","email","name","address","phone" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 100,
            WriteCapacityUnits: 100
          }
        },
        {
          IndexName: "Index7",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "name",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "name" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 100,
            WriteCapacityUnits: 100
          }
        },
        {
          IndexName: "Index8",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "email",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "email" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 100,
            WriteCapacityUnits: 100
          }
        },
        {
          IndexName: "Index9",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "password",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "password" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 100,
            WriteCapacityUnits: 100
          }
        }],
      LocalSecondaryIndexes: [
        {
          IndexName: "Index1",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "address",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "address" ],
            ProjectionType: "INCLUDE"
          }
        },
        {
          IndexName: "Index2",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "phone",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "phone" ],
            ProjectionType: "INCLUDE"
          }
        },
         ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 100,
        WriteCapacityUnits: 100
      },

      TableName: "users"

    };
    services.createTable(params).then(function(data){
      res.end(JSON.stringify(data));
    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.get("/deleteuserstable",function(req,res){
    var params = {
      TableName: 'users',
    };
    services.deleteTable(params).then(function(data) {
      // an error occurred
      res.end(JSON.stringify(data)); // successful response
    }).catch(function(err){
      res.end(JSON.stringify(err));
    });
  })
  server.post("/getusertable",function(req,res){
    var params = {
      TableName: 'users',
      IndexName:'Index6',
      KeyConditionExpression: 'uniqueId=:val and temple_id=:temple_id',
      // KeySchema:{
      //   id:{N:'0'},
      //   email:{S:req.body.email},
      //  // password:{S:'123456'},
      // },
     // FilterExpression: 'email = :email',
      ExpressionAttributeValues: { // a map of substitutions for all attribute values
        //':email': {S:req.body.email},
        //':password': {S:req.body.password},
        ':val':{S:uniqueId},
          ':temple_id':{S:req.body.user_id.toString()}
      },
       // AttributesToGet:["temple_id","id","name","email","phone","address"],
       // Select:"SPECIFIC_ATTRIBUTES",
      //ConsistentRead: true, // optional (true | false)
      ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    };
    services.getUser(params).then(function(data) {
      // an error occurred
      res.end(JSON.stringify({status:true,data:data.Items.map(marshal.unmarshalItem)})); // successful response
    }).catch(function(err){
      res.end(JSON.stringify({status:false,error:err}));
    });
  })
}
