<!--
## ChatBotWindow is a simple chat window that connects to a WebSocket server and sends and receives messages.
- The chat window is a dialog element that can be shown and hidden.
- The chat window has an input field for entering messages and a button to send the message.
- The chat window displays the chat history in a div element.
- The chat window connects to a WebSocket server when it is shown and sends and receives messages.
- The chat window displays the chat history in the chat history div element.
- The chat window has a close button that closes the chat window and disconnects from the WebSocket server.

## ChatBotWindow uses two environment variables to configure its behavior:
- PUBLIC_WS_URL: the WebSocket endpoint URL
- PUBLIC_WS_PRESERVE_HISTORY: if true, the chat history is preserved between chat sessions

## Below is a fragment of Docker Compose file that shows how to configure 
signomix-docs-website (web application using the ChatBotWindow) with the environment variables:

```yaml 
signomix-docs-website:
    ...
    environment:
      PUBLIC_WS_URL: ws://hcms.localhost/chat/
      PUBLIC_WS_PRESERVE_HISTORY: true
    ... 
```
-->
<dialog id="chat-dialog">
  <div class="container">
    <div id="chat-content" class="chats">
    </div>
    <div class="mt-2">
      <form>
        <div class="input-group w-100">
          <input id="chat-input" type="text" class="form-control" placeholder="Say something">
          <span class="input-group-btn ms-1">
            <button class="btn btn-outline-primary ms-1" type="button" on:click={sendMessage}>Send</button><button
              class="btn btn-outline-primary ms-1" type="button" on:click={closeDialog}>Close</button>
          </span>
        </div>
      </form>
    </div>
  </div>
</dialog>
<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { env } from '$env/dynamic/public';

  let wsEndpoint = env.PUBLIC_WS_URL;
  let preserveHistory = env.PUBLIC_WS_PRESERVE_HISTORY;

  let show = false

  export const b5modal = {
    dialog: null,
    toggle() {
      show = !show
    },
    show() {
      show = true
      //console.log("sob--: show -> show", show)
      this.dialog.showModal()
      openConnection()
    },
    hide() {
      show = false
      //console.log("sob--: hide -> show", show)
      this.dialog.close()
    },
    showHide(isShow) {
      isShow ? (show = true) : (show = false)
      //console.log("sob--: showHide -> isShow", isShow)
    }
  }

  let socket = null
  let chatHistory = []
  let chatContent
  let chatInput
  let clientId = 'c' + Date.now() + "" + Math.floor(Math.random() * 1000)
  let dialog

  onMount(() => {
    b5modal.dialog = document.getElementById("chat-dialog")
    chatContent = document.getElementById("chat-content")
    chatInput = document.getElementById("chat-input")
    chatInput.focus();
    try {
      preserveHistory = preserveHistory.toLowerCase() === 'true'
    } catch (e) {
      preserveHistory = false
    }
    console.log("ChatBotWindow preserveHistory: ", preserveHistory)
  });

  function openConnection() {
    if (preserveHistory == false) {
      chatHistory.length = 0
    }
    if (socket == null || socket.readyState !== WebSocket.OPEN) {
      clientId = 'c' + Date.now() + "" + Math.floor(Math.random() * 1000)
      socket = new WebSocket(wsEndpoint + clientId)
      socket.addEventListener("open", () => {
        console.log("Opened")
        console.log("Socket readyState: ", socket.readyState)
        
        /*         console.log("Sending hello ...")
                try {
                  let msg = {
                    clientId: clientId,
                    message: "Hello"
                  }
                  socket.send(msg.message)
                  printHistory()
                  console.log("Chat connection opened")
                } catch (e) {
                  console.error("Error sending hello: ", e)
                } */
      })
      socket.addEventListener("message", (event) => {
        console.log("Message from server", event.data)
        displayMessage(event.data)
      })
      socket.addEventListener("close", () => {
        console.log("Closed")
      })
    }
  }

  function sendMessage(event) {
    try {
      let msg = {
        clientId: clientId,
        message: chatInput.value
      }
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(msg.message)
        chatHistory.push(msg)
        printHistory()
      } else {
        console.log("Connection not open - skiping message")
      }
      if (msg.message.trim().toLowerCase() == "/q" || msg.message.trim().toLowerCase() == "/quit") {
        closeDialog()
      }
    } catch (e) {
      console.log("Error: ", e)
    }
  }



  function displayMessage(message) {
    try {
      // message format: clientId:messageText
      /*  clientId=message.substring(0,message.indexOf(":"))
       console.log("new clientId: ", clientId) 
       */
      let msg = {
        clientId: null,
        message: message
      }
      chatHistory.push(msg)
      printHistory()
      chatInput.focus();
    } catch (e) {
      console.log("Error: ", e)
    }
  }
  function printHistory() {
    try {
      let chatText = ""
      let avatar = "<i class='bi bi-robot me-1'></i>"
      for (let i = 0; i < chatHistory.length; i++) {
        if (chatHistory[i].clientId == null) {
          chatText += "<div class='w-100 fw-normal'>" + avatar + " " + chatHistory[i].message + "</div>"
        } else {
          chatText += "<div class='w-100 fw-bold'>" + chatHistory[i].message + "</div>"
        }
      }
      if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].clientId != null) {
        chatText += "<div class='w-100 fw-normal'>" + avatar + " "
        chatText += "<div class='spinner-border spinner-border-sm text-secondary' role='status'><span class='visually-hidden'>Loading...</span></div>"
        chatText += "</div>"
      }
      chatContent.innerHTML = chatText
    } catch (e) {
      console.log("Error: ", e)
    }
  }
  function closeDialog() {
    if (socket != null && preserveHistory == false) {
      socket.close()
      socket = null
      clientId = null
    }
    if (preserveHistory == false) {
      chatHistory.length = 0
      clientId = null
    }
    b5modal.hide()
  };

</script>
<style>
</style>