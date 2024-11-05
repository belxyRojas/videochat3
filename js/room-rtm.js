let handleUserJoined = async (MemberId) => {
    console.log("A new user joined channel", MemberId);
    addMemberToDom(MemberId)
    let members = await channel.getMembers()
    membersTotal(members)
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name'])
    addBotMessageToDom(`welcome to the room ${name}! 👋 `)
  };
  
let addMemberToDom = async (MemberId) =>{
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name'])
    let memberWrapper = document.getElementById('member__list')
    let memberItem = ` <div class="member__wrapper" id="member__${name}__wrapper">
        <span class="green__icon"></span>
        <p class="member_name">${name}</p>
    </div>`
   
    memberWrapper.insertAdjacentHTML("beforeend",memberItem)
}

let removeMemberFromDom = async (MemberId) =>{
let {name} = await rtmClient.getUserAttributesByKeys(MemberId,['name'])
 let memberWrapper = document.getElementById(`member__${name}__wrapper`)
   addBotMessageToDom(`${name} left the room.`)
   
   memberWrapper.remove()
}

  //user left
  let handleMemberLeft = async(MemberId) => {
    removeMemberFromDom(MemberId)
    let members = await channel.getMembers()
    membersTotal(members)
    };

    let membersTotal = async (members) => {
        let total = document.getElementById('members__count')
        total.innerText = members.length
       
     }

     let handleChannelMessage = async (messageData,MemberId) => {
        let data = JSON.parse(messageData.text)
        console.log("A new message recieved");
        if (data.type === 'chat') {
            addMessageToDom(data.displayName,data.message)
        }
     }
    let getMembers = async () => {
       let members = await channel.getMembers()
       membersTotal(members)
       for(let i = 0; i < members.length; i++){
       addMemberToDom(members[i])
      }
    }


    let sendMessage= async(e) => {
        e.preventDefault()
       let message = e.target.message.value
       channel.sendMessage({text:JSON.stringify({type:'chat',message:message,displayName:displayName})})
       addMessageToDom(displayName,message)
       e.target.reset()
     }

  let addMessageToDom= async(name,message) => {
let messageWrapper = document.getElementById('messages')
let newMessage = ` <div class="message__wrapper">
<div class="message__body">
    <strong class="message__author">${name}</strong>
    <p class="message__text">${message}</p>
</div>
</div>`
messageWrapper.insertAdjacentHTML("beforeend",newMessage)

let lastMessage = document.querySelector('#messages ,message__wrapper:last-child')
lastMessage && lastMessage.scrollIntoView()

     }

     let addBotMessageToDom= async (botMessage) => {
        let messageWrapper = document.getElementById('messages')
        let newMessage = ` <div class="message__wrapper">
        <div class="message__body__bot">
            <strong class="message__author__bot">🤖 Go Bot</strong>
            <p class="message__text__bot">${botMessage}</p>
        </div>
    </div>`
        messageWrapper.insertAdjacentHTML("beforeend",newMessage)
        
        let lastMessage = document.querySelector('#messages ,message__wrapper:last-child')
        lastMessage && lastMessage.scrollIntoView()
        
             }
        



    let leaveChannel = async () => {
        await channel.leave()
        await client.logout()
    }

    window.addEventListener('beforeunload',leaveChannel)
    let messageForm = document.getElementById('message__form')
    messageForm.addEventListener('submit',sendMessage)