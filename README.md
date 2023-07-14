# clydeapi
A basic unofficial api to interact with discord's AI, clyde.
WARNING: This requires a user account to run, this IS against discord's TOS and may lead to a ban, you have been warned!

How to use:
There is one function this library gives, askClyde, it takes 3 inputs
prompt: String with what to ask it, this is equivalent to sending a message to it normally. (It is not required to put @Clyde)
token: The token of your discord account
channelid: The channel id with which to send the messages, i reccommend this channel id be a DM with clyde because anybody else talking can break this library

It then returns a promise that resolves to a string containing clydes exact response.

Current issues:
Cant have two messages at once in the same channel, this can be solved by creating many channels and rotating between them however this is obviously not ideal

To install:
```bash
npm i @thecrazyinsanity2/clydeapi
```
- Usage example:
```javascript
const {
    askClyde,
    createChannel,
    deleteChannel,
    listChannels,
    deleteChannelsWithDelay,
    delay
  } = require('./path/to/js/file');
  
  const token = 'your discord token';
  const guildId = 'your server id';
  const parentId = null;
  const channelName = 'testing';
  
  async function processChannels() {
    try {
      const channels = await listChannels(guildId, parentId, token);
      const matchingChannels = channels.filter(channel => channel.name === channelName);
  
      if (matchingChannels.length > 0) {
        const channelIds = matchingChannels.map(channel => channel.id);
        
        const response = await askClyde('@Clyde Im fine thank you', token, channelIds);
        console.log(response);
        await deleteChannelsWithDelay(10000, channelIds, token);
      } else {
        const channelId = await createChannel(guildId, parentId, channelName, token);
        console.log('New channel created with ID:', channelId);
        const response = await askClyde('@Clyde Hello Clyde', token, channelId);
        console.log(response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  processChannels();
```
