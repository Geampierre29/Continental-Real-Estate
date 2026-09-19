const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
    const cardDistrict = card.getAttribute('data-district');
    const cardType = card.getAttribute('data-type');
    const cardStatus = card.getAttribute('data-status');

    const matchDistrict = (districtSelected === 'todos' || districtSelected === cardDistrict);
    const matchType = (typeSelected === 'todos' || typeSelected === cardType);
    const matchStatus = (statusSelected === 'todos' || statusSelected === cardStatus);

    if (matchDistrict && matchType && matchStatus) {
        card.style.display = 'block';
    } else {
        card.style.display = 'none';
    }
});