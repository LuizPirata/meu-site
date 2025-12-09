document.addEventListener("DOMContentLoaded", () => {

    const menuItems = document.querySelectorAll(".sidebar li");
    const sections = document.querySelectorAll(".section");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {

            // Remover active do menu
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Ocultar todas seções
            sections.forEach(sec => sec.classList.remove("active"));

            // Ativar a seção clicada
            const id = item.getAttribute("data-section");
            document.getElementById(id).classList.add("active");

        });
    });
});
