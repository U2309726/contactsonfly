import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBRZdSNDkC2vq5TA5QYjNQtw-xUbWEye2Y",
  authDomain: "contact-on-the-go.firebaseapp.com",
  projectId: "contact-on-the-go",
  storageBucket: "contact-on-the-go.firebasestorage.app",
  messagingSenderId: "19775203867",
  appId: "1:19775203867:web:e1918bb1215565da8be6be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const contactList = document.getElementById('contact-list');
const emptyMessage = document.getElementById('emptyMessage');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const emailInput = document.getElementById('emailInput');

// Current editing contact (for Update)
let editingContactId = null;

// Modal Functions
addBtn.addEventListener('click', () => {
  console.log('Add Contact button clicked!');
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
});

cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
  clearForm();
});

// Save Contact
saveBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !phone || !email) {
    alert('Please fill in all fields!');
    return;
  }

  if (!/^\d+$/.test(phone)) {
    alert('Phone number should contain only numbers!');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address!');
    return;
  }

  try {
    const contactId = `${name.toLowerCase().replace(/ /g, '-')}-${phone}`;

    if (editingContactId) {
      // Update existing contact
      await updateDoc(doc(db, "contacts", editingContactId), {
        name,
        phone,
        email,
        timestamp: new Date()
      });

      console.log("Contact updated in Firestore!");
    } else {
      // Create new contact
      await setDoc(doc(db, "contacts", contactId), {
        name,
        phone,
        email,
        timestamp: new Date()
      });

      console.log("Contact saved to Firestore!");
    }

    // Add or update contact in the list
    addContactToList(name, phone, email, contactId);

    // Hide the empty message
    emptyMessage.style.display = 'none';

    // Hide modal and clear form
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    clearForm();

    // Reset editing mode
    editingContactId = null;

  } catch (error) {
    console.error("Error saving/updating contact: ", error);
    alert(`Failed to save contact. Error: ${error.message}`);
  }
});

// Updated addContactToList function with aligned buttons
function addContactToList(name, phone, email, contactId) {
  const li = document.createElement('li');

  // info span
  const info = document.createElement('span');
  info.textContent = `${name} — ${phone} — ${email}`;
  info.classList.add('contact-info');

  // actions container
  const actions = document.createElement('div');
  actions.classList.add('contact-actions');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.classList.add('editBtn');
  editBtn.addEventListener('click', () => editContact(contactId));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.addEventListener('click', () => deleteContact(contactId, li));

  actions.append(editBtn, deleteBtn);

  // assemble
  li.append(info, actions);
  contactList.appendChild(li);
}

// Edit Contact (Populate Modal with Contact Data)
function editContact(contactId) {
  const contactRef = doc(db, "contacts", contactId);
  contactRef.get().then((docSnap) => {
    if (docSnap.exists()) {
      const contact = docSnap.data();
      nameInput.value = contact.name;
      phoneInput.value = contact.phone;
      emailInput.value = contact.email;
      editingContactId = contactId;
      modal.style.display = 'flex';
      document.body.classList.add('modal-open');
    } else {
      console.log("No such contact!");
    }
  });
}

// Delete Contact
async function deleteContact(contactId, listItem) {
  try {
    await deleteDoc(doc(db, "contacts", contactId));
    console.log("Contact deleted from Firestore!");
    contactList.removeChild(listItem);
    if (contactList.children.length === 0) {
      emptyMessage.style.display = 'block';
    }
  } catch (error) {
    console.error("Error deleting contact: ", error);
    alert(`Failed to delete contact. Error: ${error.message}`);
  }
}

// Clear Form
function clearForm() {
  nameInput.value = '';
  phoneInput.value = '';
  emailInput.value = '';
}

// Load Existing Contacts at Startup
async function loadContacts() {
  try {
    const querySnapshot = await getDocs(collection(db, "contacts"));

    if (querySnapshot.empty) {
      emptyMessage.style.display = 'block';
      return;
    }

    querySnapshot.forEach((doc) => {
      const contact = doc.data();
      addContactToList(contact.name, contact.phone, contact.email, doc.id);
    });

    emptyMessage.style.display = 'none';

  } catch (error) {
    console.error("Error loading contacts: ", error);
    alert('Failed to load contacts.');
  }
}

// Call loadContacts on page load
window.addEventListener('DOMContentLoaded', loadContacts);
