module.exports=function(server,services,bodyParser,uniqueId,marshal,fs,sha512) {
        server.post("/templetimings",bodyParser,function(req,res){
          if(req.body.images)
          {
            var images=req.body.images;
            images.forEach(function(val){
              var imageFile='uploads/temples/'+sha512(parseInt(Math.random()*100000000000))+'.png'
              fs.writeFile(val,imageFile,'base64',function(err){
                if(err)
                {
                  res.end(JSON.stringify({status:false,error:err}))
                }
                else{
                  var params={
                    TableName:'templeImages',
                      Item:{
                          uniqueId:{S:uniqueId},
                          id:{N:req.body.user_id},
                          image:{S:imageFile}
                      }
                  }
                  services.uploadImages(params).then().catch(function(err){
                    res.end(JSON.stringify({status:false,error:err}))
                  })
                }
              })
            })
          }
          var params={
            TableName:'templeDetail',
            Item:{
              uniqueId:{S:uniqueId},
              id:{N:req.body.user_id.toString()},
              morning_open_time:{S:req.body.morning_open_time},
              morning_close_time:{S:req.body.morning_close_time},
              noon_open_time:{S:req.body.noon_open_time},
              noon_close_time:{S:req.body.noon_close_time},
              evening_open_time:{S:req.body.evening_open_time},
              evening_close_time:{S:req.body.evening_close_time},
              about:{S:req.body.about},
            },
             ReturnItemCollectionMetrics:'SIZE'
          }
          services.addTempleTimings(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
          }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
          })

        });
        server.get("/createtimingtable",function(req,res){
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
                AttributeName: "morning_open_time",
                AttributeType: "S"
              },{
                AttributeName: "morning_close_time",
                AttributeType: "S"
              },{
                AttributeName: "noon_open_time",
                AttributeType: "S"
              },{
                AttributeName: "noon_close_time",
                AttributeType: "S"
              },{
                AttributeName: "evening_open_time",
                AttributeType: "S"
              },{
                AttributeName: "evening_close_time",
                AttributeType: "S"
              },{
                AttributeName: "about",
                AttributeType: "S"
              }
            ],
            GlobalSecondaryIndexes:[
              {
              IndexName: "Index5",
              KeySchema: [
                {
                  AttributeName: "uniqueId",
                  KeyType: "HASH"
                },{
                  AttributeName: "evening_open_time",
                  KeyType: "RANGE"
                }
              ],
              Projection: {
                NonKeyAttributes: [ "evening_open_time" ],
                ProjectionType: "INCLUDE"
              },
                ProvisionedThroughput: {
                  ReadCapacityUnits: 10,
                  WriteCapacityUnits: 10
                }
            },
              {
                IndexName: "Index6",
                KeySchema: [
                  {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                  },{
                    AttributeName: "evening_close_time",
                    KeyType: "RANGE"
                  }
                ],
                Projection: {
                  NonKeyAttributes: [ "evening_close_time" ],
                  ProjectionType: "INCLUDE"
                },
                ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
              }
              },
              {
                IndexName: "Index7",
                KeySchema: [
                  {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                  },{
                    AttributeName: "about",
                    KeyType: "RANGE"
                  }
                ],
                Projection: {
                  NonKeyAttributes: [ "about" ],
                  ProjectionType: "INCLUDE"
                },
                ProvisionedThroughput: {
                  ReadCapacityUnits: 10,
                  WriteCapacityUnits: 10
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
                    AttributeName: "morning_open_time",
                    KeyType: "RANGE"
              }
            ],
                Projection: {
                  NonKeyAttributes: [ "morning_open_time" ],
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
                    AttributeName: "morning_close_time",
                    KeyType: "RANGE"
                  }
                ],
                Projection: {
                  NonKeyAttributes: [ "morning_close_time" ],
                  ProjectionType: "INCLUDE"
                }
              },
              {
                IndexName: "Index3",
                KeySchema: [
                  {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                  },{
                    AttributeName: "noon_open_time",
                    KeyType: "RANGE"
                  }
                ],
                Projection: {
                  NonKeyAttributes: [ "noon_open_time" ],
                  ProjectionType: "INCLUDE"
                }
              },
              {
                IndexName: "Index4",
                KeySchema: [
                  {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                  },{
                    AttributeName: "noon_close_time",
                    KeyType: "RANGE"
                  }
                ],
                Projection: {
                  NonKeyAttributes: [ "noon_close_time" ],
                  ProjectionType: "INCLUDE"
                }
              },

            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 10,
              WriteCapacityUnits: 10
            },

            TableName: "templeDetail"

          };
          services.createTable(params).then(function(data){
            res.end(JSON.stringify(data));
          }).catch(function(err){
            res.end(JSON.stringify(err));
          })
        })
    server.get("/createtempleimages",function(req,res){
      var params={
        TableName:'templeImages',
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
                  AttributeName: "image",
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
                          AttributeName: "image",
                          KeyType: "RANGE"
                      }
                  ],
                  Projection: {
                      NonKeyAttributes: [ "image" ],
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
}
