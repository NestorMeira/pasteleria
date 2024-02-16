import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYPD9Th0QLwfvN3ss-UcTYeQ8LBt35Vrc",
    authDomain: "crud-275cd.firebaseapp.com",
    projectId: "crud-275cd",
    storageBucket: "crud-275cd.appspot.com",
    messagingSenderId: "382243670639",
    appId: "1:382243670639:web:9daa13abda6161ce495b9a"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const formulario = document.getElementById('formulario');
const listaDatos = document.getElementById('listaDatos');
const fileInput = document.getElementById('imagen');
const datos= document.getElementById('datos')

// Elimina un registro
async function eliminarRegistro(id) {
    const docRef = doc(collection(db, 'pruebas'), id);
    try {
        await deleteDoc(docRef);
        console.log("Document deleted successfully!");
    } catch (error) {
        console.error("Error deleting document:", error);
    }
    fetchData();
}

// Obtiene y muestra datos
async function fetchData() {
    listaDatos.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, 'pruebas'));

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement('li');
        listItem.classList.add('lista');
        listItem.innerHTML = `
            <h2>${data.titulo}</h2> <p>${data.descripcion}</p>
            <span>$${data.precio}</span>
            <img src="${data.imagen}" alt="Imagen"> <!-- Muestra la imagen -->
            <button class="editar-btn" data-id="${doc.id}" data-titulo="${data.titulo}" data-descripcion="${data.descripcion}" data-imagen="${data.imagen}" data-precio="${data.precio}">Editar</button>
            <button class="eliminar-btn" data-id="${doc.id}">Eliminar</button>
        `;
        listaDatos.appendChild(listItem);

        const editarButton = listItem.querySelector('.editar-btn');
        editarButton.addEventListener('click', editarRegistro);

        const eliminarButton = listItem.querySelector('.eliminar-btn');
        eliminarButton.addEventListener('click', () => eliminarRegistro(doc.id));
    });
}


async function fetchDat() {

    datos.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, 'pruebas'));

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement('div');
         listItem.classList.add('lista');
        listItem.innerHTML = `
           <div class='foto'>
            <img src="${data.imagen}" alt="Imagen">
            </div>
            <div class='info'> 
            <h2>${data.titulo}</h2>
            <p>${data.descripcion}</p>  
            <span>$ ${data.precio}</span>
            </div>
        `;
        datos.appendChild(listItem);
    });
}
fetchDat()


// Edita un registro
async function editarRegistro(event) {
    scroll(top)
    const id = event.currentTarget.getAttribute('data-id');
    const titulo = event.currentTarget.getAttribute('data-titulo');
    const descripcion = event.currentTarget.getAttribute('data-descripcion');
    const precio = parseFloat(event.currentTarget.getAttribute('data-precio'));

    document.getElementById('titulo').value = titulo;
    document.getElementById('descripcion').value = descripcion;
    document.getElementById('precio').value = precio;
    document.getElementById('docId').value = id;

    document.querySelector('button[type="submit"]').innerText = "Editar";
    const imagenActual = event.currentTarget.getAttribute('data-imagen');
    if (imagenActual) {
        // Puedes agregar lógica para mostrar la imagen actual si es necesario
        // Por ejemplo, podrías tener un elemento img en tu formulario con un ID como 'imagenPreview'
        // document.getElementById('imagenPreview').src = imagenActual;
    }
}

// Agrega un evento al formulario
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const docId = document.getElementById('docId').value;

    let imagenUrl = '';
    const file = fileInput.files[0];
    if (file) {
        const storageRef = ref(storage, 'imagenes/' + file.name);
        await uploadBytes(storageRef, file);
        imagenUrl = await getDownloadURL(storageRef);
    }

    if (docId) {
        try {
            await updateDoc(doc(collection(db, 'pruebas'), docId), {
                titulo,
                descripcion,
                precio,
                imagen: imagenUrl
            });
            console.log("Document updated successfully!");
        } catch (error) {
            console.error("Error updating document:", error);
        }
    } else {
        await addDoc(collection(db, 'pruebas'), {
            titulo,
            descripcion,
            precio,
            imagen: imagenUrl
        });
        console.log("Document added successfully!");
    }

    formulario.reset();
    fetchData();
});

// Obtiene y muestra datos al cargar la página
fetchData();

