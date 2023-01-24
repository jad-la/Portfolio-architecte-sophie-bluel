let modal = null;
const btnModal = document.querySelector('.open-modal');

const closeModal = (e) =>{
    if(modal === null) return
    e.preventDefault();
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.btn-close').removeEventListener('click', closeModal)
    modal.querySelector('.modal-stop').removeEventListener('click', stopPropagation)
    modal = null;


}
const openModal = (e) => {
    e.preventDefault();
    const target = document.querySelector('.modal');
    console.log(target);
    target.style.display = 'flex';
    target.removeAttribute('aria-hidden');
    modal = target;
    modal.addEventListener('click', closeModal)
    modal.querySelector('.btn-close').addEventListener('click', closeModal)
    modal.querySelector('.modal-stop').addEventListener('click', stopPropagation)
}

const stopPropagation = (e) =>{
    e.stopPropagation();
}
btnModal.addEventListener('click', openModal);

window.addEventListener('keydown', (e) =>{
    if(e.key === "Escape" || e.key === "Esc"){
        closeModal(e);
    }
});




