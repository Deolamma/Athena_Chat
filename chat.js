"use strict";
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7265/chathub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

const start = async() => {
    try {
        await connection.start();
        console.log("connceted to signal r")
    } catch(error) {
        console.log(error);
    }

}

// getting the username from prompt model and store it in session
//session  storage, exits till a brower tab is open

const joinUser = async() => {
    
    const name = window.prompt('Enter the name :')
    if(name){
        sessionStorage.setItem('user', name)
        // here user will join the chat
       await joinChat(name);
    }
    console.log(getUser('user'))
}

//   document.getElementById('btn').addEventListener('click', async(e) =>{
//     e.preventDefault();
//     const inputMessage = document.getElementById('inputMessage');
//     const name = inputMessage.value;

//      const joinUser = async() => {
    
//         if(name){
//             sessionStorage.setItem('user', name)
//             // here user will join the chat
//            await joinChat(name);
//         }
//         console.log(getUser('user'))

//     }

//   })
   


const joinChat = async (user) => {
    if(!user)
    return;
    try{
        const message = `${user} joined`;
        await connection.invoke("JoinChat", user, message)
        
    }catch(error){ 
        console.log(error)

    }
}

// fetching the user from session storage
const getUser = () => sessionStorage.getItem('user')

// method for getting notified by server

const receiveMessage = async () =>{
    const currentUser = getUser();
    if(!currentUser)
    return;
    try{
         await connection.on("ReceiveMessage", (user, message)=>{
            const messageClass = currentUser === user ? "send" : "received";
            appendMessage(message, messageClass);
           console.log(message)
           
         });
    }catch(error){
        console.log(error);
    }
}

//append message to the message-section

const appendMessage = (message, messageClass) =>{
    const messageSectionEl = document.getElementById('messageSection');
    const msgBoxEl = document.createElement("div");
    msgBoxEl.classList.add("msg-box");
    msgBoxEl.classList.add(messageClass);
    msgBoxEl.innerHTML = message;
    messageSectionEl.appendChild(msgBoxEl);
}

//binding the event for send button

document.getElementById('btnSend').addEventListener('click', async(e) =>{
    e.preventDefault();
    const user = getUser();
    if (!user)
    return;
    const txtMessageAll = document.getElementById('txtMessage');
    const msg = txtMessageAll.value;
    if(msg){
        await sendMessage(user, `${user}:${msg}`);  // john: hi guys
        txtMessageAll.value = "";
    }
    
})

const sendMessage = async (user, message) =>{
   
    try{
        await connection.invoke('SendMessage', user, message)
    }catch(err){

    }
}

//sending the App
const startApp = async() => {
    await start();
    await joinUser();
    await receiveMessage();
}

startApp();
