function openFullScreen() {
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("fullImg");
    const img = document.getElementById("kvmImage");
  
    modal.style.display = "block";
    modalImg.src = img.src;
  }
  
  function closeFullScreen() {
    document.getElementById("imgModal").style.display = "none";
  }
  
  function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active'); 
  }
  