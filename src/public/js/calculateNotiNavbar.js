//tang chi so thong bao ket ban
function increaseNotiNavbar(className){
	currentValue=+$("."+className).text(); //+ DE chuyen tu string sang kieu int
	currentValue+=1;
	if(currentValue===0)
	{
		$("."+className).css("display","none").html("");
	}	
	$("."+className).css("display","block").html(currentValue);
}

//giam chi so thong bao ket bam
function decreaseNotiNavbar(className){
	currentValue=+$("."+className).text(); //+ DE chuyen tu string sang kieu int
	if(currentValue>0){ // TRANH TRUONG HOP KO GUI LOI MOI MA VAN HUY DC
		currentValue-=1;
	}
	if(currentValue===0)
	{
		$("."+className).css("display","none").html("");
	}	
	$("."+className).css("display","block").html(currentValue);
}