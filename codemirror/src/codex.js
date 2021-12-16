var axios = require('axios');
var data = JSON.stringify({
           "code":`#include<bits/stdc++.h>
           using namespace std;
           int main()
           {
             cout << "hello world";
           }`,
           "language":"cpp",
           "input":""
           });

var config = {
  method: 'post',
  url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(response.data.output);
})
.catch(function (error) {
  console.log(error);
});