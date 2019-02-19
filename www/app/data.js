function updateData(){
    const socket = io.connect();

    socket.on('socketData', (data)=>{
        console.log(data);

        document.getElementById("dataReceive").innerHTML = data.dataHasil;
    });
}