(function () {
    document.getElementById("message")
        .addEventListener("keyup", function (event) {
            event.preventDefault()
            if (event.keyCode == 13) {
                document.getElementById("enterTheMessage").click()
            }
        })
}())

let ws = null

const webSocketInit = () => {

    ws.onopen = () => {
        document.getElementById('enterTheChat').style.display = 'none'
        document.getElementById('leaveTheChat').style.display = 'inline-block'
        document.getElementById('nickNameBlock').style.display = 'none'
        document.getElementById('inputMessage').style.display = 'inline-block'
        document.getElementById('connectState').innerHTML = '連線成功！已加入聊天室！'
    }

    ws.onclose = () => {
        document.getElementById('enterTheChat').style.display = 'inline-block'
        document.getElementById('leaveTheChat').style.display = 'none'
        document.getElementById('nickNameBlock').style.display = 'inline-block'
        document.getElementById('inputMessage').style.display = 'none'
        document.getElementById('connectState').innerHTML = '未加入聊天室！！'
    }

    ws.onmessage = (event) => {
        let arrEvent = JSON.parse(event.data).message
        let chatList = ''
        for (let i = 0; i <= arrEvent.length - 1; i++) {
            chatList += `<p>${arrEvent[i].name}：${arrEvent[i].chat}</p>`
        }
        if (chatList === '') {
            return
        }
        let chatBlock = document.getElementById('chatBlock')
        chatBlock.innerHTML = chatList
        chatBlock.scrollTop = chatBlock.scrollHeight
    }
}

const openConnect = () => {
    ws = new WebSocket('wss://usewebsocket.herokuapp.com/')
    webSocketInit()
}

const leaveTheChat = () => {
    ws.close()
}

const checkNickName = () => {
    let nickName = document.getElementById('nickName').value

    if (String(nickName) === '') {
        alert('請輸入暱稱！')
        return false
    }
    localStorage.setItem('nickName', nickName)
    return true
}

const enterTheChat = () => {
    if (checkNickName())
        openConnect()
}

const enterTheMessage = () => {
    let message = document.getElementById('message').value
    if (message === '')
        return
    const messageData = {
        type: 'catchMessage',
        name: localStorage.getItem('nickName')
    }
    messageData.message = message
    ws.send(JSON.stringify(messageData))

    messageData.message = document.getElementById('message').value = ''
}