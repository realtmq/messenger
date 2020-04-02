export let pushSocketIdToArray=(client,userId,socketId)=>{
	if(client[userId]){
		client[userId].push(socketId);
	}else{
		client[userId]=[socketId];
	}
	return client;
};

export let removeSocketIdFromArray=(client,userId,socketId)=>{
    client[userId]= client[userId].filter((socketId)=>{return socketId!==socketId;})
		if(!client[userId].length)
		delete client[userId];
	return client;      
};	