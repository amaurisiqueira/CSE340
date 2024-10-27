const year_copyright= document.querySelector('.current_year_copyright');
year_copyright.innerHTML = `&copy; ${(new Date()).getFullYear()}, CSE340 App  <a class="error_link" href="/inv/type/0">Error Link</a>`;


 
const pswdBtn = document.querySelector("#pswdBtn");
      if( pswdBtn != undefined){ 

     
        // console.log('pswdBtn:',pswdBtn);

      pswdBtn.addEventListener("click", function () {
          const pswdInput = document.getElementById("account_password");
          const type = pswdInput.getAttribute("type");
          if (type === "password") {
              pswdInput.setAttribute("type", "text");
              pswdBtn.innerHTML = "Hide Password";
          } else {
              pswdInput.setAttribute("type", "password");
              pswdBtn.innerHTML = "Show Password";
          }
      }); 
}


'use strict' 
 
 // Get a list of items in inventory based on the classification_id 
 let classificationList = document.querySelector("#classificationList")

if(classificationList){
 classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value 
  // console.log(`a classification_id is: ${classification_id}`) 


  let classIdURL = "/inv/getInventory/"+classification_id 

  // console.log("classIdURL =", classIdURL );

  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   // console.log(data); 
     buildInventoryList(data); 
  }) 
  .catch(function (error) { 
   // console.log('a.There was a problem: ', error.message) 
  }) 
 })

}//end if(classificationList)
 
 // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventoryDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Vehicle Name</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
     // console.log(element.inv_id + ", " + element.inv_model); 
     dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
     dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
   }