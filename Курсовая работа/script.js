let showForm=document.querySelector("#showForm");
let addContact=document.querySelector("#addFromBtn");
let displayContacts=document.querySelector(".main");
let displayAddContact=document.querySelector(".add");
let nameContact=document.querySelector("#nameContact");
let phoneContact=document.querySelector("#phoneContact");
let uncorrectData=document.querySelector('.uncorrect');
let checkFavorites=document.querySelector("#checkFavorites");
let contacts=document.querySelector(".contacts");
let searchContact=document.querySelector("#search");
let newContact="";
let arrayOfContacts=[];
let maxFavoriteId;
if (localStorage.getItem("arrayOfContacts")!== null) {
  arrayOfContacts=(JSON.parse(localStorage.getItem("arrayOfContacts")));
}
refreshContacts();
if (localStorage.getItem("maxFavoriteId")!== null) {
  maxFavoriteId=Number(localStorage.getItem("maxFavoriteId"));
}
else{
  maxFavoriteId=-1;
}
showForm.addEventListener("click",()=>{
  displayContacts.style.display="none";
  displayAddContact.style.display="flex";
});

addContact.addEventListener("click",()=>{
  maxFavoriteId=checkFavorites.checked?maxFavoriteId+1:maxFavoriteId;
  newContact={
    name:nameContact.value,
    phone:phoneContact.value,
    favorite:checkFavorites.checked,
    id:arrayOfContacts.length,
    favoriteId:checkFavorites.checked?maxFavoriteId:-1
  };
  if((newContact.name.split()!="")&&(newContact.phone.length==17)){
  pushElementToDOM(newContact);
  arrayOfContacts.push(newContact);
  updateContacts();
  updateFavoriteId();
  refreshContacts();
  nameContact.value="";
  phoneContact.value="";
  checkFavorites.checked=false;
  displayContacts.style.display="flex";
  displayAddContact.style.display="none";
  uncorrectData.style.display="none";
}
  else
  {
    uncorrectData.style.display="block";
  }
});

function pushElementToDOM(newContact){
  let divContact=document.createElement('div');
  divContact.classList.add("contact");
  let divAvatar=document.createElement('div');
  divAvatar.classList.add("avatar");
  let imgAvatar=document.createElement('img');
  imgAvatar.src='./photo.png';
  divAvatar.appendChild(imgAvatar);
  let divInfo=document.createElement('div');
  divInfo.classList.add("info");
  let pName=document.createElement('p');
  let pPhone=document.createElement('p');
  let divBtns=document.createElement('div');
  divBtns.classList.add("btns");
  let pTimes=document.createElement('p');
  let pFavorite=document.createElement('p');
  pTimes.classList.add("btn");
  pFavorite.classList.add("btn");

  divContact.appendChild(divAvatar);
  pName.innerHTML=newContact.name;
  pPhone.innerHTML=newContact.phone;
  divInfo.appendChild(pName);
  divInfo.appendChild(pPhone);
  pTimes.innerHTML="&times;";
  pTimes.addEventListener("click",()=>{
    maxFavoriteId=newContact.favorite?maxFavoriteId-1:maxFavoriteId;
    console.log("maxFavoriteId-"+maxFavoriteId);
    updateFavoriteId();
    arrayOfContacts=arrayOfContacts.filter((el)=>{
      return el.id!==newContact.id;
    })
    normalize();
    refreshContacts();
    updateContacts();
  });
  pFavorite.innerHTML="&#10084;";//"&#9825;";
  pFavorite.style.color=newContact.favorite?"red":"#000"
  pFavorite.addEventListener("click",()=>{
    newContact.favorite=!newContact.favorite;
    newContact.favoriteId=newContact.favorite?maxFavoriteId+1:-1;
    maxFavoriteId=newContact.favorite?maxFavoriteId+1:maxFavoriteId-1;
    updateFavoriteId();
    if(!newContact.favorite){
      normalize();
    }
    refreshContacts();
    updateContacts();
  });
  divBtns.appendChild(pTimes);
  divBtns.appendChild(pFavorite);

  divContact.appendChild(divAvatar);
  divContact.appendChild(divInfo);
  divContact.appendChild(divBtns);
  contacts.appendChild(divContact);
}

function refreshContacts(){
  let sortByFavoriteArray=sortByFavorite();
  let sortByNameArray=sortByName();
  let sortContacts=[].concat(sortByFavoriteArray,sortByNameArray);
  console.log(sortContacts);
  contacts.innerHTML = '';
  for(let i=0; i<sortContacts.length;i++){
    pushElementToDOM(sortContacts[i]);
    console.log(i);
  }
}
function updateContacts(){
  localStorage.setItem("arrayOfContacts",JSON.stringify(arrayOfContacts));
}
function updateFavoriteId(){
  localStorage.setItem("maxFavoriteId",maxFavoriteId);
}
function sortByFavorite(){
  let tempSortArray = [];
  tempSortArray=arrayOfContacts.filter((el)=>{
    return el.favoriteId!=-1;
  });
  tempSortArray=tempSortArray.sort((a,b)=>{
    return b.favoriteId-a.favoriteId;
  });
  return tempSortArray;
}
function sortByName(){
  let tempSortArray = [];
  tempSortArray=arrayOfContacts.filter((el)=>{
    return el.favoriteId==-1;
  });
  tempSortArray=tempSortArray.sort((a,b)=>{
    return a.name>b.name;
  });
  return tempSortArray;
}
function normalize() {
  let normalizeIdArray=[];
  normalizeIdArray=arrayOfContacts.map((el,i)=>{
    el.id=el.id==i?el.id:i;
    return el;
  });
  let normalizeFavoriteArray=arrayOfContacts.filter((el)=>{
    return el.favoriteId!=-1;
  });
  normalizeFavoriteArray=normalizeFavoriteArray.reverse().map((el,i)=>{
    el.favoriteId=(el.favoriteId==i)?el.favoriteId:i;
    return el;
  });
  for (var i = 0; i < normalizeIdArray.length; i++) {
    for (var j = 0; j < normalizeFavoriteArray.length; j++) {
      if (normalizeIdArray[i].id==normalizeFavoriteArray[j].id) {
        normalizeIdArray.favoriteId=normalizeFavoriteArray.favoriteId;
      }
    }
  }
  return normalizeIdArray;
};
search.addEventListener("input",(event)=>{

 let tempString=event.target.value;
 let sortByFavoriteArray=sortByFavorite();
 let sortByNameArray=sortByName();
 let tempArray=[].concat(sortByFavoriteArray,sortByNameArray);

 if (tempString==""){
   refreshContacts();
 }
  else{
    tempArray=tempArray.filter((el)=>{
      return el.name.toLowerCase().includes(tempString.toLowerCase());
    });
    contacts.innerHTML = '';
    for(let i=0; i<tempArray.length;i++){
      pushElementToDOM(tempArray[i]);
    }
  }
});

window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call( document.querySelectorAll('.tel'), function(input) {
    var keyCode;
    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        var matrix = "+7 (___) ___ ____",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});
