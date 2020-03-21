//tang chi so thong bao ket ban
function increaseNotiContact(className){
	currentValue=+$("."+className).find("em").text(); //+ DE chuyen tu string sang kieu int
	currentValue+=1;
	if(currentValue===0)
	{
		$("."+className).html("");
	}	
	$("."+className).html("(<em>"+currentValue+"</em>)");
}

//giam chi so thong bao ket bam
function decreaseNotiContact(className){
	currentValue=+$("."+className).find("em").text(); //+ DE chuyen tu string sang kieu int
	if(currentValue>0){ // TRANH TRUONG HOP KO GUI LOI MOI MA VAN HUY DC
		currentValue-=1;
	}
	if(currentValue===0)
	{
		$("."+className).html("");
	}	
	$("."+className).html("(<em>"+currentValue+"</em>)");
}