
const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

function renderCafe(doc){
  let li = document.createElement('li');
  let name = document.createElement('span');
  let location = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  location.textContent = doc.data().location;
  cross.textContent = 'O';

  li.appendChild(name);
  li.appendChild(location);
  li.appendChild(cross);

  cafeList.appendChild(li);

  //delete data
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('cafes').doc(id).delete();
  })

  name.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    let updated = prompt('New name');
    console.log(updated)
    if(updated == null || updated == ''){
      db.collection('cafes').doc(id).update({
        name: doc.data().name
      })
    } else{
      db.collection('cafes').doc(id).update({
        name: updated
      })
    }
  })

  location.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    let updated = prompt('New location');
    if(updated == null || updated == ''){
      db.collection('cafes').doc(id).update({
        location: doc.data().location
      })
    } else {
      db.collection('cafes').doc(id).update({
        location: updated
      })
    }
  })
}

//getting data from firebase

//db.collection('cafes').where('location', '==', 'north blue').orderBy('name').get().then((snapshot) => {
//  snapshot.docs.forEach(doc => {
//    renderCafe(doc)
//  })
//});

//saving data to firebase
form.addEventListener('submit',(e) => {
  e.preventDefault();
  db.collection('cafes').add({
    name: form.name.value,
    location: form.location.value
  })
  form.name.value = '';
  form.location.value = '';

})

//real-time database change

db.collection('cafes').orderBy('location').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    //console.log(change)
    if(change.type == 'added'){
      renderCafe(change.doc);
    } else if(change.type == 'removed'){
      let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
      cafeList.removeChild(li);
    }
  });
});
