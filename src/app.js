import express from 'express';
import handlebars from 'express-handlebars'
import viewsrouter  from './routes/views.router.js'
import __dirname from './utils.js'
import { Server } from 'socket.io';
import cors from "cors"
import path from 'path';


const app = express();
const PORT = 8080

const server = app.listen(PORT, ()=>{
    console.log(`Servidor en puerto: ${PORT}`)
})
const io = new Server(server)

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname + '/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))

app.use(cors());


app.use('/', viewsrouter)

const message = [];

io.on("connection", (socket) => {
    console.log(`User ${socket.id} Connection`);

    let userName = "";

    socket.on("userConnection", (data) => {
        userName = data.user;
        message.push({
            id: socket.id,
            info: "connection",
            name: data.user,
            message: `${data.user} Conectado`,
            date: new Date().toTimeString(),
        });
        io.sockets.emit("userConnection", { message, nameUser: userName });
    });

    socket.on("userMessage", (data) => {
        message.push({
            id: socket.id,
            info: "message",
            name: userName,
            message: data.message,
            date: new Date().toTimeString(),
        });
        io.sockets.emit("userMessage", message);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
});
export { io };




