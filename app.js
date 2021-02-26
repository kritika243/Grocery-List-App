// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.querySelector('#grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn');


// edit option
let editElements;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems);

// load items from loacal storage
window.addEventListener('DOMContentLoaded', setupLoad);



// ****** FUNCTIONS **********
function addItem(e){
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if(value && !editFlag){
   createListItems(id, value)
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add('show-container');
    // add to local storage 
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();

  }
  else if(value && editFlag ){
    editElements.innerHTML = value
    displayAlert("value changed", "success");
    // edit local storage
    editLocalStorage(editId,value);
    setBackToDefault();
  }
  else {
   displayAlert("please enter the value", "danger");
  }
}

// display alert
function displayAlert(text, action){
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // to remove alert 
  setTimeout(function(){
    alert.textContent = "";
  alert.classList.remove(`alert-${action}`);
  },1000)

}

// clear all items
function clearItems(){
  const items = document.querySelectorAll('.grocery-item');
  if(items.length>0){
    items.forEach(function(item){
      list.removeChild(item);
    })
  }
  // to hide the container containing clear list button
  container.classList.remove('show-container');
  displayAlert('list cleared', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}

//delete function
function deleteItems(e){
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if(list.children.length===0){
    container.classList.remove('show-container');
  }
  displayAlert('item removed', 'danger');
  setBackToDefault();
  //remove from local storage
  removeFromLocalStorage(id)
}

// edit function
function editItems(e){
  const element = e.currentTarget.parentElement.parentElement;
  editElements = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElements.innerHTML;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = 'Edit'

}

// set back to default
function setBackToDefault(){
  grocery.value = "";
  editFlag = false;
  editId="";
  submitBtn.textContent= "add";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
  const grocery = { id,value};
  let items = getLocalStorage();
  items.push(grocery);
 
  localStorage.setItem("list", JSON.stringify(items))
}

function removeFromLocalStorage(id){
let items= getLocalStorage();

items = items.filter(function(item){
  if(item.id !== id)
  return item;
});

localStorage.setItem("list", JSON.stringify(items))

}
function editLocalStorage(id, value){
  let items = getLocalStorage();
  items = items.map(function(item){
    if(item.id === id)
    item.value = value;
    return item;

  });
localStorage.setItem("list", JSON.stringify(items))

}
function getLocalStorage(){
  return localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')):[];
  items.push(grocery);
}

// ****** SETUP ITEMS **********
function setupLoad(){
  let items = getLocalStorage();
  if(items.length>0){
    items.forEach(function(item){
      createListItems(item.id,item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItems(id, value){
  const element = document.createElement('article');
  // adding class
  element.classList.add('grocery-item');
  // adding id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML =`<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`;
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  deleteBtn.addEventListener('click', deleteItems);
  editBtn.addEventListener('click', editItems);
  // append child
  list.appendChild(element);
}