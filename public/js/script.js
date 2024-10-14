const year_copyright= document.querySelector('.current_year_copyright');
year_copyright.innerHTML = `&copy; ${(new Date()).getFullYear()}, CSE340 App  <a class="error_link" href="/inv/type/0">Error Link</a>`;


 
      const pswdBtn = document.querySelector("#pswdBtn");
      if( pswdBtn != undefined){ 

     
        console.log('pswdBtn:',pswdBtn);

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