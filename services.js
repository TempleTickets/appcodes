
var services=function(dynamoDB,dynamo,defer){
  return{
    createTable:function(params){
      var registerDefer= new defer();
      console.log(dynamoDB);
      dynamoDB.createTable(params,function(err,data){
        if(err)
          registerDefer.reject(err)
          else
            registerDefer.resolve(data)
      })
      return registerDefer.promise()
    },
    login:function(params){
      var loginDefer=new defer();
      console.log(params)
      dynamoDB.query(params,function(err,data){

        console.log(err);
        if (err) {
          loginDefer.reject(err);
        } else {
          loginDefer.resolve(data);
        }
      })
      return loginDefer.promise();
    },
    register:function(params){
      var registerDefer=new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          registerDefer.reject(err);
        }else{
          registerDefer.resolve(data);
        }

      })
      return registerDefer.promise();
    },
      updateTemple:function(params){
      var updateDefer= new defer();
      dynamoDB.updateItem(params,function(err,data){
        if(err) updateDefer.reject(err);
        else updateDefer.resolve(data);
      });
      return updateDefer.promise();
      },
    deleteTable:function(params){
      var deleteDefer=new defer()
      dynamoDB.deleteTable(params, function(err, data) {
        if (err) deleteDefer.reject(err); // an error occurred
        else deleteDefer.resolve(data); // successful response

      });
      return deleteDefer.promise();
    },
    addBankDetail:function(params){
      var bankDefer= new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          bankDefer.reject(err);
        }else{
          bankDefer.resolve(data);
        }
      })
      return bankDefer.promise();
    },
    addTempleTimings:function(params){
      var registerDefer=new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          registerDefer.reject(err);
        }else{
          registerDefer.resolve(data);
        }

      })
      return registerDefer.promise();
    },addPooja:function(params){
      var registerDefer=new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          registerDefer.reject(err);
        }else{
          registerDefer.resolve(data);
        }

      })
      return registerDefer.promise();
    },addUser:function(params){
      var registerDefer=new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          registerDefer.reject(err);
        }else{
          registerDefer.resolve(data);
        }

      })
      return registerDefer.promise();
    },getUser:function(params){
      var loginDefer=new defer();
      console.log(params)
      dynamoDB.query(params,function(err,data){

        console.log(err);
        if (err) {
          loginDefer.reject(err);
        } else {
          loginDefer.resolve(data);
        }
      })
      return loginDefer.promise();
    },
    gePoojaList:function(params){
      var poojaDefer=new defer();
      console.log(params)
      dynamoDB.query(params,function(err,data){
        console.log(err);
        if (err) {
          poojaDefer.reject(err);
        } else {
          poojaDefer.resolve(data);
        }
      })
      return poojaDefer.promise();
    },
    bookWalkins:function(params){
      var bookWalkinDefer=new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          bookWalkinDefer.reject(err);
        }else{
          bookWalkinDefer.resolve(data);
        }

      })
      return bookWalkinDefer.promise();
    },
    getWalkinsList:function(params){
      var bookWalkinDefer=new defer();
      dynamoDB.query(params,function(err,data){
        if(err){
          bookWalkinDefer.reject(err);
        }else{
          bookWalkinDefer.resolve(data);
        }

      })
      return bookWalkinDefer.promise();
    },
    addDatesForWalkin:function(params){
      var bookWalkinDefer=new defer();
      dynamoDB.batchWriteItem(params,function(err,data){
        if(err){
          bookWalkinDefer.reject(err);
        }else{
          bookWalkinDefer.resolve(data);
        }

      })
      return bookWalkinDefer.promise();
    },
    addFamilyMembers:function(params){
      var familyMember=new defer();
      dynamoDB.batchWriteItem(params,function(err,data){
        if(err){
          familyMember.reject(err);
        }else{
          familyMember.resolve(data);
        }

      })
      return familyMember.promise();
    },
    addPoojaTiming:function(params){
      var poojadefer=new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          poojadefer.reject(err);
        }else{
          poojadefer.resolve(data);
        }

      })
      return poojadefer.promise();
    },
    addPoojaTimingDetails:function(params){
      var poojadefer=new defer();
      dynamoDB.putItem(params,function(err,data){
        if(err){
          poojadefer.reject(err);
        }else{
          poojadefer.resolve(data);
        }

      })
      return poojadefer.promise();
    },
    describeTable:function(params){
      var describedefer=new defer();
      dynamoDB.describeTable(params,function(err,data){
        if(err){
          describedefer.reject(err);
        }else{
          describedefer.resolve(data);
        }

      })
      return describedefer.promise();

    },
    scanTable:function(params){
      var scanDefer=new defer();
      dynamoDB.scan(params,function(err,data){
        if(err)
        {
          scanDefer.reject(err);
        }
        else{
          scanDefer.resolve(data)
        }

      })
      return scanDefer.promise();
    },
      getTempleList:function(params){
          var loginDefer=new defer();
          dynamoDB.query(params,function(err,data){

              console.log(err);
              if (err) {
                  loginDefer.reject(err);
              } else {
                  loginDefer.resolve(data);
              }
          })
          return loginDefer.promise();
      },
      getTemple:function(params){
          var loginDefer=new defer();
          dynamoDB.query(params,function(err,data){

              console.log(err);
              if (err) {
                  loginDefer.reject(err);
              } else {
                  loginDefer.resolve(data);
              }
          })
          return loginDefer.promise();
      },
      bookPooja:function(params){
        var bookDefer= new defer();
        dynamoDB.putItem(params,function(err,data){
          if(err)
          {
            bookDefer.reject(err);
          }
          else{
            bookDefer.resolve(data);
          }
        })
          return bookDefer.promise();
      },
      getPoojaList:function(params){
        var bookDefer=new defer();
          dynamoDB.query(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      getFamilyMembers:function(params){
        var bookDefer=new defer();
          dynamoDB.query(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      addProfile:function(params){
        var bookDefer=new defer();
          dynamoDB.putItem(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      addDevoteeFamilyMembers:function(params){
        var bookDefer=new defer();
          dynamoDB.putItem(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      getMyProfile:function(params){
        var bookDefer=new defer();
          dynamoDB.query(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      updateDevoteeFamilyMembers:function(params){
          var bookDefer=new defer();
          dynamoDB.updateItem(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      setSettings:function(params){
          var bookDefer=new defer();
          dynamoDB.putItem(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      getSettings:function(params){
          var bookDefer=new defer();
          dynamoDB.query(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      changePassword:function(params)
      {
          var bookDefer=new defer();
          dynamoDB.updateItem(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      acceptBookingRequest:function(params)
      {
          var bookDefer=new defer();
          dynamoDB.updateItem(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      updatePassword:function(params)
      {
          var updateDefer=new defer();
          dynamoDB.updateItem(params,function(err,data){
              if(err)
              {
                  updateDefer.reject(err);
              }
              else{
                  updateDefer.resolve(data);
              }
          })
          return updateDefer.promise();
      },
      uploadImages:function(params){
      var bookDefer=new defer();
          dynamoDB.query(params,function(err,data){
              if(err)
              {
                  bookDefer.reject(err);
              }
              else{
                  bookDefer.resolve(data);
              }
          })
          return bookDefer.promise();
      },
      addDiety:function(params){
          var dietydefer=new defer();
          dynamoDB.putItem(params,function(err,data){
              if(err)
              {
                  dietydefer.reject(err);
              }
              else{
                  dietydefer.resolve(data);
              }
          })
          return dietydefer.promise();
      },
      getDieties:function(params){
          var dietydefer=new defer();
          dynamoDB.query(params,function(err,data){
              if(err)
              {
                  dietydefer.reject(err);
              }
              else{
                  dietydefer.resolve(data);
              }
          })
          return dietydefer.promise();
      }
      ,
      updatePooja:function(params)
    {
        var updateDefer=new defer();
        dynamoDB.updateItem(params,function(err,data){
            if(err)
            {
                updateDefer.reject(err);
            }
            else{
                updateDefer.resolve(data);
            }
        })
        return updateDefer.promise();
    },
      updateAdminProfile:function(params)
    {
        var updateDefer=new defer();
        dynamoDB.updateItem(params,function(err,data){
            if(err)
            {
                updateDefer.reject(err);
            }
            else{
                updateDefer.resolve(data);
            }
        })
        return updateDefer.promise();
    }
  }

}

module.exports=services;
