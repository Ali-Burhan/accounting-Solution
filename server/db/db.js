/*
THIS IS THE CONFIG FILE TO CONNECT SQL SERVER CONTAINS THE IMPORTANT INFO LIKE
USER NAME,
PASSWORD,
SERVER NAME
DATABASE NAME
 */
module.exports = config = {
    user: 'codewithburhan',
    password: 'ali',
    server: 'ALIAHMED',
    database: 'sqlreact',
    options: {
      trustServerCertificate: true, // Only for development/testing environments
    //   enableArithAbort:true,
    //   instancename: 'qaise',
    //   trustedConnection:false
    // connectionPool:{
    //   max:100
    // }
    },
    port:1433
  };
  
