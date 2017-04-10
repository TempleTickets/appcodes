module.exports=function(server,services,bodyParser,uniqueId,marshal,fs,sha512,querybuilder,path){
  var poojaCount=1;
  var timeid=1;
  var timeDetail=1;
  server.post("/addpooja",bodyParser,function(req,res){

        var params={
          TableName:'pooja',
          Item:{
            user_id:{S:req.body.user_id.toString()},
            id:{N:poojaCount.toString()},
            uniqueId:{S:uniqueId},
            title:{S:req.body.title.toString()},
            description:{S:req.body.description},
            significance:{S:req.body.significance},
            pujari_name:{S:req.body.pujari_name},
            price:{S:req.body.price},
            type:{S:req.body.type},
            duration:{S:req.body.duration},
            terms:{S:req.body.terms},
            samagri:{S:req.body.samagri.toString()},
            startdate:{S:req.body.startdate},
            enddate:{S:req.body.enddate},
            limit:{S:req.body.limit},
            pooja_type:{S:req.body.pooja_type},
            number_days:{S:req.body.number_of_days},
            is_approval:{S:req.body.is_approval.toString()},
            accept_online:{S:req.body.accept_online.toString()},
            accept_walkin:{S:req.body.accept_walkin.toString()},
            accept_walkin_offline:{S:req.body.accept_walkin.toString()},
            accept_quick_bookin:{S:req.body.accept_quick_booking.toString()}

          },
          ReturnItemCollectionMetrics:'SIZE'
        };
        services.addPooja(params).then(function(result){

          res.end(JSON.stringify({status:true,message:result,id:poojaCount}));
          poojaCount++;
        }).catch(function(err){
          res.end(JSON.stringify({status:false,error:err}));
        })



  })
  server.post("/addpoojatiming",bodyParser,function(req,res){

        var params={
          TableName:'poojaTiming',
          Item:{
            user_id:{S:req.body.user_id.toString()},
            id:{N:timeid.toString()},
            uniqueId:{S:uniqueId},
            limit:{S:req.body.limit},
            days:{S:req.body.days},
            hours:{S:req.body.hours},
            sunday:{S:req.body.sunday.isTrue.toString()},
            monday:{S:req.body.monday.isTrue.toString()},
            tuesday:{S:req.body.tuesday.isTrue.toString()},
            wednesday:{S:req.body.wednesday.isTrue.toString()},
            thursday:{S:req.body.thursday.isTrue.toString()},
            friday:{S:req.body.friday.isTrue.toString()},
            saturday:{S:req.body.saturday.isTrue.toString()},

          },
          ReturnItemCollectionMetrics:'SIZE'
        };
        var params2={
          TableName:'poojaTimingDetails',
          Item:{
            user_id:{S:req.body.user_id.toString()},
            id:{N:timeDetail.toString()},
            uniqueId:{S:uniqueId},
            sundaystart:{S:req.body.sunday.start},
            sundayend:{S:req.body.sunday.end},
            mondaystart:{S:req.body.monday.start},
            mondayend:{S:req.body.monday.end},
            tuesdaystart:{S:req.body.tuesday.start},
            tuesdayend:{S:req.body.tuesday.end},
            wednesdaystart:{S:req.body.wednesday.start},
            wednesdayend:{S:req.body.wednesday.end},
            thursdaystart:{S:req.body.thursday.start},
            thursdayend:{S:req.body.thursday.end},
            fridaystart:{S:req.body.friday.start},
            fridayend:{S:req.body.friday.end},
            saturdaystart:{S:req.body.saturday.start},
            saturdayend:{S:req.body.saturday.end},

          },
          ReturnItemCollectionMetrics:'SIZE'
        };
        services.addPoojaTiming(params).then(function(result){
          services.addPoojaTimingDetails(params2).then(function(result2){
            res.end(JSON.stringify({status:true,mesasage1:result,message:result2}));
            timeid++;timeDetail++;
          })
            .catch(function(err){
              res.end(JSON.stringify({status:false,error:err}))
            })

        }).catch(function(err){
          res.end(JSON.stringify({status:false,error:err}));
        })



  })
    server.post("/addpoojatimingweekly",function(req,res){
        var params={
            TableName:'poojaTiming',
            Item:{
                user_id:{S:req.body.user_id.toString()},
                id:{N:timeid.toString()},
                uniqueId:{S:uniqueId},
                limit:{S:req.body.limit},
                days:{S:req.body.days},
                hours:{S:req.body.hours},
                sunday:{S:req.body.sunday.isTrue.toString()},
                monday:{S:req.body.monday.isTrue.toString()},
                tuesday:{S:req.body.tuesday.isTrue.toString()},
                wednesday:{S:req.body.wednesday.isTrue.toString()},
                thursday:{S:req.body.thursday.isTrue.toString()},
                friday:{S:req.body.friday.isTrue.toString()},
                saturday:{S:req.body.saturday.isTrue.toString()},

            },
            ReturnItemCollectionMetrics:'SIZE'
        };
        services.addPoojaTiming(params).then(function(result) {
            res.end(JSON.stringify({status:true,error:result}));
        }).catch(function(err){
          res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.post("/addpoojatimingspecial",function(req,res){
        var params={
            TableName:'poojaTiming',
            Item:{
                user_id:{S:req.body.user_id.toString()},
                id:{N:timeid.toString()},
                uniqueId:{S:uniqueId},
                limit:{S:req.body.limit},
                days:{S:req.body.days},
                hours:{S:req.body.hours},
                sunday:{S:req.body.sunday.isTrue.toString()},
                monday:{S:req.body.monday.isTrue.toString()},
                tuesday:{S:req.body.tuesday.isTrue.toString()},
                wednesday:{S:req.body.wednesday.isTrue.toString()},
                thursday:{S:req.body.thursday.isTrue.toString()},
                friday:{S:req.body.friday.isTrue.toString()},
                saturday:{S:req.body.saturday.isTrue.toString()},

            },
            ReturnItemCollectionMetrics:'SIZE'
        };
        services.addPoojaTiming(params).then(function(result) {
            res.end(JSON.stringify({status:true,error:result}));
        }).catch(function(err){
          res.end(JSON.stringify({status:false,error:err}));
        })
    })
  server.get("/createpoojatable",function(req,res){
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
          AttributeName: "user_id",
          AttributeType: "S"
        },{
          AttributeName: "title",
          AttributeType: "S"
        },{
          AttributeName: "description",
          AttributeType: "S"
        },{
          AttributeName: "significance",
          AttributeType: "S"
        },{
          AttributeName: "pujari_name",
          AttributeType: "S"
        },{
          AttributeName: "price",
          AttributeType: "S"
        },{
          AttributeName: "type",
          AttributeType: "S"
        },{
          AttributeName: "duration",
          AttributeType: "S"
        },{
          AttributeName: "terms",
          AttributeType: "S"
        },{
          AttributeName: "samagri",
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
              AttributeName: "title",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "title",'startdate','enddate','limit','pooja_type','number_days',"is_approval","accept_online","accept_walkin","accept_walkin_offline","accept_quick_booking" ],
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
              AttributeName: "description",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "description" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        },
        {
          IndexName: "Index8",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "significance",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "significance" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        },
        {
          IndexName: "Index9",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "pujari_name",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "pujari_name" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        },
        {
          IndexName: "Index10",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "price",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "price" ],
            ProjectionType: "INCLUDE"
          },
        ProvisionedThroughput: {
      ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
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
      }
       ,
        {
          IndexName: "Index2",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "type",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "type" ],
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
              AttributeName: "duration",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "duration" ],
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
              AttributeName: "terms",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "terms" ],
            ProjectionType: "INCLUDE"
          }
        },
        {
          IndexName: "Index5",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "samagri",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "samagri" ],
            ProjectionType: "INCLUDE"
          }
        },

      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },

      TableName: "pooja"

    };
    services.createTable(params).then(function(data){
      res.end(JSON.stringify(data));
    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.get("/deletepoojatable",function(req,res){
    var params = {
      TableName: 'pooja',
    };
    services.deleteTable(params).then(function(data) {
      // an error occurred
      res.end(JSON.stringify(data)); // successful response
    }).catch(function(err){
      res.end(JSON.stringify(err));
    });
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
        ':id': {S:req.body.user_id.toString()},
       // ':type': {S:'1'},
        ':val':{S:uniqueId}
      },
      Select:"ALL_ATTRIBUTES",
      ConsistentRead: false, // optional (true | false)
      ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    };
    services.gePoojaList(params).then(function(data) {
      // an error occurred
      res.end(JSON.stringify({status:true,data:data.Items.map(marshal.unmarshalItem)})); // successful response
    }).catch(function(err){
      res.end(JSON.stringify({status:false,error:err}));
    });
  })
  server.post("/getbookedpoojalist",function(req,res){
      querybuilder().table("bookedPoojas")
          .indexName("Index2")
          .select("id","user_id","temple_id","pooja_id","is_accepted")
          .where("uniqueId",uniqueId)
          .where("temple_id",req.body.user_id.toString())
          .then(function(data){
            querybuilder().table("devotee")
                .select("user_id","email","first_name","last_name")
                //.indexName('Index2')
                .where("uniqueId",uniqueId)
                //.where("user_id",req.body.user_id.toString())
                .then(function(data2){
                  querybuilder().table("profiledetails")
                      .select("mobile_no","dob","dom","gender","gotra","rashi","nakshatra","address","user_id","image")
                      .where("uniqueId",uniqueId)
                      .then(function(data3){
                        querybuilder().table('pooja')
                            .indexName("Index1")
                            .select("id","title","description","significance","pujari_name","price","type","duration",'terms',"samagri",'startdate','enddate','limit','pooja_type','number_days',"is_approval")
                            .where("uniqueId",uniqueId)
                            .where("user_id",req.body.user_id.toString())
                            .then(function(data4){
                                  data2.Items.forEach(function(val,key)
                                  {
                                      data3.Items.forEach(function(val2){
                                          if(val.user_id==val2.user_id)
                                          {
                                              data2.Items[key].mobile_no=val2.mobile_no;
                                              data2.Items[key].dob=val2.dob;
                                              data2.Items[key].dom=val2.dom;
                                              data2.Items[key].gender=val2.gender;
                                              data2.Items[key].address=val2.address;
                                              data2.Items[key].gotra=val2.gotra;
                                              data2.Items[key].rashi=val2.rashi;
                                              data2.Items[key].nakshatra=val2.nakshatra;
                                              data2.Items[key].image=path+val2.image;
                                          }
                                      })
                                  })
                                  data.Items.forEach(function(val,key){
                                      data2.Items.forEach(function(val2){
                                          if(val.user_id.toString()==val2.user_id.toString())
                                          {
                                              data.Items[key].user_details=val2;
                                          }
                                      })
                                      data4.Items.forEach(function(val2){
                                        if(val.pooja_id==val2.id)
                                        {
                                          data.Items[key].pooja_details=val2;
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
                .catch(function(err){
                res.end(JSON.stringify({status:false,error:err}))
            })

          })
          .catch(function(err){
            res.end(JSON.stringify({status:false,error:err}))
      })
  })
  server.get("/createtimingpoojatable",function(req,res){
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
      AttributeDefinitions:[{
        AttributeName:"uniqueId",
        AttributeType:"S"
      },
        {
          AttributeName:"id",
          AttributeType:"N"
        },
        {
          AttributeName:"user_id",
          AttributeType:"S"
        }
      ],
      GlobalSecondaryIndexes:[
        {
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
            NonKeyAttributes: [ "user_id",'limit','days','hours','sunday','monday','tuesday','wednesday','thursday','friday','saturday' ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
      TableName:'poojaTiming'

    };
    var params2={
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
      AttributeDefinitions:[{
        AttributeName:"uniqueId",
        AttributeType:"S"
      },
        {
          AttributeName:"id",
          AttributeType:"N"
        },
        {
          AttributeName:"user_id",
          AttributeType:"S"
        }
      ],
      GlobalSecondaryIndexes:[
        {
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
            NonKeyAttributes: [ "user_id","time_id",'sundaystart','sundayend','mondaystart','mondayend','tuesdaystart','tuesdayend','wednesdaystart','wednesdayend','thursdaystart','thursdayend','fridaystart','fridayend','saturdaystart','saturdayend' ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
      TableName:'poojaTimingDetails'

    }
    services.createTable(params).then(function(data){
      services.createTable(params2).then(function(data2){
        res.end(JSON.stringify({status:true,"message":data2}));
      }).catch(function(err){
        res.end(JSON.stringify(err))
      })
    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.get("/deletetimingpoojatable",function(req,res){
    services.deleteTable({TableName:'poojaTiming'}).then(function(data){
      services.deleteTable({TableName:'poojaTimingDetails'}).then(function(data2){
        res.end(JSON.stringify(data2));
      })
        .catch(function(err2){
          res.end(JSON.stringify(err2))
        })
    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.post("/acceptbookingrequest",function(req,res){
      var params={
          TableName:"bookedPoojas",
          Key:{
              id:{S:req.body.id.toString()},
              uniqueId:{S:uniqueId.toString()}
          },
          UpdateExpression:"set is_accepted=:isaccept",
          ExpressionAttributeValues:{
              ":isaccept":{S:req.body.is_accept.toString()},

          },
          ReturnValues:"UPDATED_NEW"
      }
      services.acceptBookingRequest(params).then(function(data){
        res.end(JSON.stringify({status:true,data:data}));
      }).catch(function(err){
        res.end(JSON.stringify({status:false,error:err}));
      })
  })
  server.post("/addpandit",function(req,res){
    var pandits=[];
    req.body.panditList.forEach(function(val){
      pandits.push(val.id);
    })
      var params={
          TableName:"pooja",
          Key:{
              id:{N:req.body.pooja_id.toString()},
              uniqueId:{S:uniqueId.toString()}
          },
          UpdateExpression:"set pandits=:pandits ",
          ExpressionAttributeValues:{
              ":pandits":{S:pandits.toString()},

          },
          ReturnValues:"UPDATED_NEW"
      }
      services.updatePooja(params).then(function(data){
        res.end(JSON.stringify({status:true,data:data}))
      }).catch(function(err){
        res.end(JSON.stringify({status:false,error:err}));
      })
  })
}
