<template>
<main>
    <section class="chat">
        <div ref="v-app">
            <h1> {{ title }} </h1>
        <form>
            <input v-model="text" type="text" />
            <button type="submit" @click.prevent="sendMessage()">Send it</button>
        </form>
        <div class="tab-row">
            <button class="tab-btn" :class="{ active: activeRoom == 'first'}" @click="activeRoom = 'first'" >First</button>
            <button class="tab-btn" :class="{ active: activeRoom == 'second'}" @click="activeRoom = 'second'" >Second</button>
            <button class="tab-btn" :class="{ active: activeRoom == 'third'}" @click="activeRoom = 'third'" >Third</button>
        </div>
        <div class="tab-row">
            Status: {{ isMemberOfActiveRoom ? 'Join' : 'NOT Joined' }} <button @click="toggleRoomMembership()"> {{ isMemberOfActiveRoom ? 'Leave' : 'Join' }} </button>
        </div>
        <p>
            <ul>
                <li v-for="msg of messages[activeRoom]" :key="msg.id"> 
                    <strong> {{ msg.sender }}: </strong> {{ msg.message }}
                </li>
            </ul>
        </p>
        </div>
    </section>
</main>
</template>

<script>
    import { io } from "socket.io-client"
    export default {
        ref: '#v-app',
        data() {
            return {
                        username: '',
                        title: 'MyChat.Vue component',
                        text: '',
                        messages: {
                            first: [],
                            second: [],
                            third: [],
                        },
                        rooms: {
                            first: false,
                            second: false,
                            third: false,
                        },
                        socket: null,
                        activeRoom: 'third'
                    };
        },
        methods: {
            sendMessage() {
                if (this.isMemberOfActiveRoom) {
                    this.socket.emit('msgToServer', { sender: this.username, message: this.text, room: this.activeRoom });
                } else {
                    alert('You must be a member of the active room to send messages');
                }
                this.socket.emit('msgToServer', {sender: this.username, text: this.text});
                this.text = "";
            },
            receiveMessage(msg) {
                this.messages[msg.room].push(msg);
            },
            toggleRoomMembership() {
                if (this.isMemberOfActiveRoom) {
                    this.messages[this.activeRoom] = [];
                    this.socket.emit('leaveRoom', this.activeRoom);
                } else {
                    this.socket.emit('joinRoom', this.activeRoom);
                }
            }
        },
        computed: {
            isMemberOfActiveRoom() {
                return this.rooms[this.activeRoom];
            }
        },
        created() {
            this.username = prompt('~~ Choose your username ~~')
            this.socket = io('http://localhost:3000/');

            this.socket.on('connect', () => {
                this.toggleRoomMembership();
            })
            this.socket.on('msgToClient', (msg) => {
                this.receiveMessage(msg);
            })
            this.socket.on('joinedRoom', (room) => {
                this.rooms[room] = true;
            });
            this.socket.on('leftRoom', (room) => {
                this.rooms[room] = false;
            });
        },
    }
</script>

<style>

section.chat {
    grid-area: chat;
}

.tab-row {
    padding-top: 20px;
}

.tab-btn.active {
    background: blue;
    color: white;
}
</style>