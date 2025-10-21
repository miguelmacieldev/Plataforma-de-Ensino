const toggle = document.getElementById("toggle-theme");
const body = document.body;

if (localStorage.getItem('theme') === 'white') {
    body.classList.add('white-mode');
    toggle.checked = true;
} 

toggle.addEventListener('change', () => {
    body.classList.toggle('white-mode');
    const isWhite = body.classList.contains('white-mode');
    localStorage.setItem('theme', isWhite ? 'white' : 'dark');
});