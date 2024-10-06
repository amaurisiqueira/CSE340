const year_copyright= document.querySelector('.current_year_copyright');
year_copyright.innerHTML = `&copy; ${(new Date()).getFullYear()}, CSE340 App  <a class="error_link" href="/inv/error">Error Link</a>`;
