const axios = require("axios")

function getLastMessage(token, channelid){
    let promise = new Promise(function(resolve, reject) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://discord.com/api/v9/channels/${channelid}/messages?limit=1`,
      headers: { 
        'X-Discord-Timezone': ' America/New_York', 
        'X-Discord-Locale': ' en-US', 
        'sec-ch-ua-platform': ' "Windows"', 
        'Accept': ' */*', 
        'Origin': ' https://discord.com', 
        'Sec-Fetch-Site': ' same-origin', 
        'Sec-Fetch-Mode': ' cors', 
        'Sec-Fetch-Dest': ' empty', 
        'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9013 Chrome/108.0.5359.215 Electron/22.3.2 Safari/537.36', 
        'Host': 'discord.com', 
        'Authorization': token
      }
    };
    
    axios.request(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data));
      response = response.data[0]
      if(response.author.username == "clyde"){
        console.log("pass")
        clyder = JSON.stringify(response.content)
        clyder = clyder.substr(1, clyder.length - 1)
        clyder = clyder.substr(0, clyder.length - 1)
        //console.log(clyder)
        //return clyder
        resolve(clyder)
    }else{
        //console.log("fail")
        reject("not clyde")
    }
    })
    .catch((error) => {
      console.log(error);
      reject("error " + error)
    });
    })
    return promise
}

function sendMessage(message, token, channelid){
    let promise = new Promise(function(resolve, reject) {
    random = Math.floor(Math.random() * 1519787823201779712);
    let data = JSON.stringify({
        "content": message,
        "nonce": random,
        "tts": false, //i want to set this to true so badly
        "flags": 0
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://discord.com/api/v9/channels/${channelid}/messages?limit=1`,
        headers: { 
          'X-Discord-Timezone': ' America/New_York', 
          'X-Discord-Locale': ' en-US', 
          'sec-ch-ua-platform': ' "Windows"', 
          'Accept': ' */*', 
          'Origin': ' https://discord.com', 
          'Sec-Fetch-Site': ' same-origin', 
          'Sec-Fetch-Mode': ' cors', 
          'Sec-Fetch-Dest': ' empty', 
          'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9013 Chrome/108.0.5359.215 Electron/22.3.2 Safari/537.36', 
          'Host': 'discord.com', 
          'Content-Type': 'application/json', 
          'Authorization': token
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        //return "success"
        resolve("success")
      })
      .catch((error) => {
        //console.log(error);
        //return "error"
        reject("error " + error)
      });
    })
    return promise
}

function createChannel(guildId, parentId, channelName, token) {
  let promise = new Promise(function(resolve, reject) {
      let data = JSON.stringify({
          "type": 0,  // 0 is a text channel
          "name": channelName,
          "permission_overwrites": [],
          "parent_id": parentId
      });

      let config = {
          method: 'post',
          url: `https://discord.com/api/v9/guilds/${guildId}/channels`,
          headers: { 
              'Authorization': token, 
              'Content-Type': 'application/json',
              'X-Discord-Timezone': 'Asia/Barnaul',
              'X-Discord-Locale': 'en-US',
              // Include any other headers as needed
          },
          data: data
      };
    
      axios.request(config)
      .then((response) => {
          resolve(response.data.id);  // resolve the promise with the channel ID
      })
      .catch((error) => {
          reject("error " + error);
      });
  });

  return promise;
}

function listChannels(guildId, parentId, token) {
  let promise = new Promise(function(resolve, reject) {
      let config = {
          method: 'get',
          url: `https://discord.com/api/v9/guilds/${guildId}/channels`,
          headers: { 
              'Authorization': token, 
              // Include any other headers as needed
          }
      };
    
      axios.request(config)
      .then((response) => {
          // Filter channels by parentId and resolve the promise with the result
          const channelsInCategory = response.data.filter(channel => channel.parent_id === parentId);
          resolve(channelsInCategory);
      })
      .catch((error) => {
          reject("error " + error);
      });
  });

  return promise;
}

function deleteChannel(channelId, token) {
  let promise = new Promise(function(resolve, reject) {
      let config = {
          method: 'delete',
          url: `https://discord.com/api/v9/channels/${channelId}`,
          headers: { 
              'Authorization': token, 
              'X-Discord-Timezone': 'Asia/Barnaul',
              'X-Discord-Locale': 'en-US',
              // Include any other headers as needed
          }
      };
    
      axios.request(config)
      .then((response) => {
          resolve('Channel deleted successfully');  // resolve the promise with a success message
      })
      .catch((error) => {
          reject("Error: " + error);
      });
  });

  return promise;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function deleteChannelsWithDelay(delayDuration, channelIds, token) {
  for (let id of channelIds) {
    await delay(delayDuration);
    deleteChannel(id, token)
      .then(message => console.log(message))
      .catch(error => console.error(error));
  }
}

function askClyde(prompt, token, channelid){
    let promise = new Promise(function(resolve, reject) {
        sendMessage(prompt, token, channelid).then((response) =>{
            console.log("sent message")
            function dotheshit(){
                getLastMessage(token, channelid).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    if(error == "not clyde"){
                        console.log("idk what to log here")
                        setTimeout(dotheshit, 2000)
                    }
                })
            }
            setTimeout(dotheshit, 2000)
        })
    })
    return promise //🤓
}

function editPersonality(prompt, guildId, token) {
  if (prompt.length > 500) {
    throw new Error('Prompt must be <=500 characters');
  }

  let data = JSON.stringify({
    "personality": prompt
  });

  let config = {
    method: 'patch',
    url: `https://discord.com/api/v9/guilds/${guildId}/clyde-settings`,
    headers: { 
      'accept': '*/*',
      'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
      'authorization': token,
      'content-type': 'application/json',
      'x-discord-locale': 'en-US',
      'x-discord-timezone': 'Asia/Barnaul',
    },
    data: data
  };

  return axios(config);
}

module.exports = {
  askClyde,
  createChannel,
  editPersonality,
  deleteChannel,
  deleteChannelsWithDelay,
  delay,
  listChannels
};
