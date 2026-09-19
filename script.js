function filtrarProyectos() {
    const statusSelected = document.getElementById('filterStatus').value;
    const districtSelected = document.getElementById('filterDistrict').value;
    const dormsSelected = document.getElementById('filterDorms').value;

    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        const cardDistrict = card.getAttribute('data-district');
        const cardDorms = card.getAttribute('data-dorms');

        const matchStatus = (statusSelected === 'todos' || statusSelected === cardStatus);
        const matchDistrict = (districtSelected === 'todos' || districtSelected === cardDistrict);
        const matchDorms = (dormsSelected === 'todos' || dormsSelected === cardDorms);

        if (matchStatus && matchDistrict && matchDorms) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}