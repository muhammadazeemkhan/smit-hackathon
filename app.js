
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import { getDatabase ,ref, set ,push ,onValue,
    child,
    query,
    equalTo,
    get,
    orderByChild,
    update,
    remove ,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";


// import {
//     getFirestore, collection, 
//     query, where,
//     addDoc, doc, getDoc, getDocs, setDoc
// } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";


import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword ,onAuthStateChanged ,signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


// FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyBZrQqdGbrts4nflnGxhhKzckKH0WVP0gA",
    authDomain: "smit-hackathon-7edab.firebaseapp.com",
    projectId: "smit-hackathon-7edab",
    storageBucket: "smit-hackathon-7edab.appspot.com",
    messagingSenderId: "638173450438",
    appId: "1:638173450438:web:9a72f316c0d309b27c47c7"
  };





  // FIREBASE FUNCTION


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);







  onAuthStateChanged(auth, (user) => {
    if (user) {
    
      const uid = user.uid;
      console.log('user is present')
      document.getElementById('signup').style.display ='none'
     document.getElementById('dashboard').style.display = 'block'
     renderData()
     
    } else {
      // User is signed out
      // ...
      document.getElementById('signup').style.display ='block'
     document.getElementById('dashboard').style.display = 'none'



    }
  });
  


  function signUp(){
    const firstName = document.getElementById('signup-Firstname').value
    const lastName = document.getElementById('signup-lastname').value
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value
    
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;

    console.log('user uid-->' , user.uid)
    // Swal.fire({
    //     position: 'top-end',
    //     icon: 'success',
    //     title: 'Signup Succesfully',
    //     showConfirmButton: false,
    //     timer: 1500
    //   })


      const userInfo = {
        firstName : firstName ,
        lastName : lastName,
        email : email,
        password : password,
        userUid :  user.uid
      }

      const userRef= ref(db , `users/${user.uid}`)
       set(userRef, userInfo)


  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

  }




// function login(){
//     const email = document.getElementById('signin-email')
//     const password = document.getElementById('signin-password')

//     signInWithEmailAndPassword(auth, email.value, password.value)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });
// console.log('ok')
// }


function logout(){
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
      
}



function saveData(){
    const title = document.getElementById('dashboard-title').value
    const post = document.getElementById('dashboard-post').value
    const postObj = {
        post_title : title ,
        post_description : post
    }

    const postRef = ref(db , `post/${auth.currentUser.uid}`)
    const newPostRef = push(postRef)

    console.log('post Obj-->' , postObj)
    set(newPostRef , postObj)

    document.getElementById('dashboard-title').value = ''
    document.getElementById('dashboard-post').value = ''


}


function renderData(){

const postContainer = document.getElementById('dashboard-post-container')

    const postRef = ref(db , `post/${auth.currentUser.uid}`)


    
    onValue(postRef, snapshot => {
    const isDataExist = snapshot.exists()
    if (isDataExist) {
        postContainer.innerHTML = null
        snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key
        const childData = childSnapshot.val()
        console.log('childKey=>', childKey)
        console.log('childData=>', childData)
        
        const postItem = `
        <h1>${childData.post_title}</h1>
        <p>${childData.post_description}</p>`

        postContainer.innerHTML += postItem
    
      })
    }
  })


}







// function editFunc () {
//     const elementId = this.id.slice(0, this.id.length - 5)
//     const todoRef = ref(db, `todos/${auth.currentUser.uid}/${elementId}`)
//     let newTodo = prompt('Edit your todo', this.parentNode.firstChild)
//     update(todoRef, { status: newTodo })
//   }
  
//   function deleteFunc () {
//     const elementId = this.id.slice(0, this.id.length - 4)
//     console.log(this.id.slice(0, this.id.length - 4))
//     const todoRef = ref(db, `todos/${auth.currentUser.uid}/${elementId}`)
//     remove(todoRef)
//   }

  window.signUp = signUp ;
  window.logout = logout ;
  window.saveData = saveData ;