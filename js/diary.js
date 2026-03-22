  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA40GUdfQxAgltcgKgJRAuZ1ugqAyNZJB0",
    authDomain: "ppapp-16df8.firebaseapp.com",
    projectId: "ppapp-16df8",
    storageBucket: "ppapp-16df8.firebasestorage.app",
    messagingSenderId: "403831584107",
    appId: "1:403831584107:web:0d91c7430cbabc119e082e"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

document.addEventListener("DOMContentLoaded", () => {

    const entryInput = document.getElementById("entry");
    const saveBtn = document.getElementById("saveEntryBtn");
    const entriesList = document.getElementById("entriesList");

 async function loadEntries() {

        entriesList.innerHTML = "";

        const q = query(
            collection(db, "diary"),
            orderBy("timestamp", "desc") // 🔥 newest first
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {

            const data = docSnap.data();
            const id = docSnap.id;

            const container = document.createElement("div");
            container.style.marginBottom = "10px";
            container.style.border = "1px solid #ccc";
            container.style.borderRadius = "5px";

            const header = document.createElement("div");
            header.textContent = new Date(
                data.timestamp.seconds * 1000
            ).toLocaleString();

            header.style.padding = "10px";
            header.style.cursor = "pointer";
            header.style.background = "#f0f0f0";
            header.style.fontWeight = "bold";

            const content = document.createElement("div");
            content.style.padding = "10px";
            content.style.display = "none";

            const text = document.createElement("p");
            text.textContent = data.content;

            // ✏️ EDIT BUTTON
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";

            // 🗑️ DELETE BUTTON
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";

            deleteBtn.style.marginLeft = "10px";

            // 🗑️ DELETE LOGIC
            deleteBtn.addEventListener("click", async () => {
                await deleteDoc(doc(db, "diary", id));
                loadEntries(); // refresh
            });

            // ✏️ EDIT LOGIC
            editBtn.addEventListener("click", () => {

                const textarea = document.createElement("textarea");
                textarea.value = data.content;

                const saveBtn = document.createElement("button");
                saveBtn.textContent = "Save";

                content.innerHTML = "";
                content.appendChild(textarea);
                content.appendChild(saveBtn);

                saveBtn.addEventListener("click", async () => {

                    const newText = textarea.value;

                    await updateDoc(doc(db, "diary", id), {
                        content: newText
                    });

                    loadEntries(); // refresh
                });

            });

            // toggle dropdown
            header.addEventListener("click", () => {
                content.style.display =
                    content.style.display === "none" ? "block" : "none";
            });

            content.appendChild(text);
            content.appendChild(editBtn);
            content.appendChild(deleteBtn);

            container.appendChild(header);
            container.appendChild(content);

            entriesList.appendChild(container);

        });

    }

    saveBtn.addEventListener("click", async () => {

        console.log("Button clicked");

        const text = entryInput.value.trim();

        if(text === ""){
            console.log("Empty input");
            return;
        }

        try{
            await addDoc(collection(db, "diary"), {
                date: new Date().toLocaleDateString(),
                content: text,
                timestamp: new Date()
            });
            
            console.log("Saved successfully");
            entryInput.value = "";
            loadEntries();

        } catch(error){
            console.error("Error saving:", error);
        }

    });

    loadEntries();
});
