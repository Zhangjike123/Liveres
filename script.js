const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch"); // Creates a storage folder

// Now use localStorage
// localStorage.setItem("userName", "manohar");
console.log(localStorage.getItem("userName")); // manohar

