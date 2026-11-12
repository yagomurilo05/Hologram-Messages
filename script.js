
const conversations = {
    Luna: [
        { type: "received", text: "Olá! Bem-vindo ao futuro da comunicação! ✨" },
        { type: "sent", text: "Oi, Luna! Como funciona essa tecnologia?" },
        { type: "received", text: "As mensagens são transmitidas em uma interface holográfica!" }
    ],

    Kai: [
        { type: "received", text: "Olá! Acabei de enviar os arquivos do projeto." },
        { type: "sent", text: "Perfeito! Vou conferir agora." }
    ],

    Maya: [
        { type: "received", text: "Você está disponível para conversar?" },
        { type: "sent", text: "Claro! Podemos conversar por aqui." }
    ]
};

let currentContact = "Luna";

const names = {
    Luna: "Luna Martins",
    Kai: "Kai Oliveira",
    Maya: "Maya Costa"
};

// Contador de mensagens não lidas
const unreadMessages = {
    Luna: 0,
    Kai: 0,
    Maya: 0
};

// Registrar horário
function getTime() {
    return new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Mostrar mensagens
function showMessages() {
    const area = document.getElementById("messages");

    area.innerHTML = "";

    conversations[currentContact].forEach(message => {
        const bubble = document.createElement("div");

        bubble.className = message.type;

        const text = document.createElement("span");
        text.textContent = message.text;

        const time = document.createElement("small");
        time.className = "message-time";
        time.textContent = message.time || "";

        bubble.appendChild(text);
        bubble.appendChild(time);

        area.appendChild(bubble);
    });

    area.scrollTop = area.scrollHeight;
}

// Atualizar notificações dos contatos
function updateNotifications() {
    document.querySelectorAll(".contact").forEach(button => {
        const contact = Object.keys(names).find(name =>
            button.textContent.includes(names[name])
        );

        if (!contact) return;

        let badge = button.querySelector(".unread-badge");

        if (unreadMessages[contact] > 0) {
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "unread-badge";
                button.appendChild(badge);
            }

            badge.textContent = unreadMessages[contact];
        } else if (badge) {
            badge.remove();
        }
    });
}

// Trocar de contato
function selectContact(name) {
    if (!conversations[name]) return;

    currentContact = name;

    // Zerar notificações ao abrir a conversa
    unreadMessages[name] = 0;
    updateNotifications();

    document.getElementById("chatName").textContent = names[name];
    document.getElementById("chatAvatar").textContent = name[0];

    document.querySelectorAll(".contact").forEach(button => {
        button.classList.remove("active");

        if (button.textContent.includes(names[name])) {
            button.classList.add("active");
        }
    });

    showMessages();
}

// Respostas automáticas
function automaticReply(message, contact) {
    const text = message.toLowerCase();

    if (text.includes("oi") || text.includes("olá")) {
        return "Olá! Que bom conversar com você! 😊";
    }

    if (text.includes("tecnologia") || text.includes("funciona")) {
        return "Nossa tecnologia utiliza uma interface holográfica para tornar a comunicação mais interativa! ✨";
    }

    if (text.includes("projeto") || text.includes("arquivo")) {
        return "Recebi sua mensagem! Vamos trabalhar nisso juntos! 🚀";
    }

    if (text.includes("obrigado") || text.includes("obrigada")) {
        return "Disponha! Estou sempre por aqui para ajudar! 💙";
    }

    if (text.includes("tudo bem") || text.includes("como vai")) {
        return "Estou funcionando perfeitamente! E você? 😄";
    }

    const replies = {
        Luna: "Interessante! Estou aqui para conversar com você. ✨",
        Kai: "Entendido! Vamos trabalhar nisso juntos. 🚀",
        Maya: "Que legal! Me conte mais sobre isso! 💜"
    };

    return replies[contact];
}

// Enviar mensagem e receber resposta
function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (text === "") return;

    const contact = currentContact;

    // Guardar mensagem enviada
    conversations[contact].push({
        type: "sent",
        text: text,
        time: getTime()
    });

    input.value = "";

    showMessages();
    input.focus();

    // Mostrar que o contato está digitando
    const area = document.getElementById("messages");
    const typing = document.createElement("div");

    typing.className = "received";
    typing.id = "typing";
    typing.textContent = "Digitando...";

    area.appendChild(typing);
    area.scrollTop = area.scrollHeight;

    // Resposta automática
    setTimeout(() => {
        const typingElement = document.getElementById("typing");

        if (typingElement) {
            typingElement.remove();
        }

        const reply = automaticReply(text, contact);

        // Guardar resposta recebida
        conversations[contact].push({
            type: "received",
            text: reply,
            time: getTime()
        });

        if (currentContact === contact) {
            showMessages();
        } else {
            unreadMessages[contact]++;
            updateNotifications();
        }
    }, 1500);
}

// Enviar pelo Enter
document.getElementById("messageInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// Enviar pelo botão
document.querySelector(".send-area button").addEventListener("click", sendMessage);

// Pesquisar contatos
document.getElementById("search").addEventListener("input", function() {
    const search = this.value.toLowerCase();

    document.querySelectorAll(".contact").forEach(button => {
        button.style.display = button.textContent.toLowerCase().includes(search)
            ? "flex"
            : "none";
    });
});

// Mostrar conversa inicial
showMessages();
updateNotifications();

// Simulação de chamada holográfica
let callActive = false;

document.getElementById("callButton").addEventListener("click", function() {
    callActive = !callActive;

    if (callActive) {
        this.textContent = "✕ Encerrar";
        this.classList.add("active");

        alert("📡 Chamada holográfica iniciada com " + names[currentContact] + "!");
    } else {
        this.textContent = "◉ Chamar";
        this.classList.remove("active");

        alert("Chamada holográfica encerrada.");
    }
});
// Abrir e fechar informações do contato
document.getElementById("infoButton").addEventListener("click", function() {
    const panel = document.getElementById("contactInfo");

    const isHidden = panel.style.display === "none";

    panel.style.display = isHidden ? "block" : "none";

    document.getElementById("infoName").textContent = names[currentContact];
    document.getElementById("infoAvatar").textContent = currentContact[0];
});