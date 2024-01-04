

connection();
function connection() {
    let xhr = new XMLHttpRequest();
    // requête
    xhr.open("POST", "http://kevin-chapron.fr:8080/login");
// headers
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader("Accept","application/json");
// tache a faire si la demande est lancer
    xhr.onload = function () {
        if(xhr.status===200){
            let jre=JSON.parse(xhr.responseText)
            let { Token,Name } = JSON.parse(xhr.responseText);
            loadingMessage(Token);
            connectionServer(Token,Name);
        }
        else{
            alert ('ya un truc qui marche pas !')
        }
    };
// lancement
    xhr.send(JSON.stringify({"Code":"DIAM02120004"}));

}



function loadingMessage(Token){
    console.log("loadingMessage() appelée avec le token :", Token);

    let xhr = new XMLHttpRequest();

    xhr.open("GET","http://kevin-chapron.fr:8080/messages")
    xhr.setRequestHeader("Authorization","Basic"+" "+Token)

    xhr.onload=function () {
        console.log("Réponse du serveur :", xhr.status, xhr.responseText);

        if(xhr.status===200){
            let list=[];

            list=JSON.parse(xhr.responseText)
            console.log("Données JSON reçues :", list);

            for(let i=0;i<list.length;i++){
                sortieMessage(list[i])
            }
        }
        else{
            console.error ("ya un truc qui marche pas !",xhr.status)
        }
    }
    xhr.send(Token);
}


 function sortieMessage(message){

    let list=document.getElementById('listMessage');
     console.log("Element listMessage :", list);

     let  p=document.createElement('p');
    p.textContent='';
     list.appendChild(p);
     let gras;
     gras = document.createElement("b");

     let italic;
     italic = document.createElement('em');
     message.Date=message.Date.replace('T',' ');

     gras.innerHTML = message.Date
     italic.innerText = message.From
     gras.textContent = '['+message.Date+']'
     italic.textContent = '('+message.From+')'

     list.append(gras,italic,message.Text);
     list.parentNode.scrollTop=list.scrollHeight;

 }


function connectionServer(token,name) {
// Création du websocket avec l'URL du serveur
    let ws=new WebSocket("ws://kevin-chapron.fr:8080/ws")
// Relier l'évènement "open" à une fonction affichant du log
    ws.onopen = function(event){
        console.log("Connected to websocket !");
        let dic={"auth":token};
        ws.send(JSON.stringify(dic));

        let rec= document.getElementById('button').onclick =event=>{

           let e= document.getElementById('ecr').value

            ws.send(JSON.stringify(
                {
                    "message":e
                }

            ))

            document.getElementById('ecr').value="";

        }

    };
    // Relier l'évènement "close" à une fonction affichant du log
    ws.onclose = function(event){
        console.log("Disconnected from websocket !");
    };
    // Relier l'évènement "message" à une fonction affichant du log
    ws.onmessage = function(event){

        lancerMessage(event);


        console.log("Message received from Websocket :" + event.data)
    };


// Relier l'évènement "error" à une fonction affichant du log
    ws.onerror = function(event){
        console.log("Error Websocket : " + event.message);
    };
}




 function lancerMessage(event) {

     let list;
     list = document.getElementById('listMessage');
    let message = []
     message = JSON.parse(event.data)
      let gras;
      gras = document.createElement("b");
      let italic;
      italic = document.createElement('em');
// il y'avais le format de date qui s'affichait:  [2023-10-29T15:28:54]
     //avec un T qui separait la date de l'heure d'ou la synthax ci dessous
     message.Date=message.Date.replace('T',' ');

     gras.innerHTML = message.Date
     italic.innerText = message.From
     gras.textContent = '['+message.Date+']'
     italic.textContent = '('+message.From+')'
     let  p=document.createElement('p');
     p.textContent='';
     list.appendChild(p);
     list.append(gras,italic,message.Text);
     list.parentNode.scrollTop=list.scrollHeight;

 }

