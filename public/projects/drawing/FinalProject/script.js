const tvs = document.querySelectorAll(".tv");

document.addEventListener("mousemove", (event) => {
    tvs.forEach((tv) => {
        const rect = tv.getBoundingClientRect();

        const tvX = rect.left + rect.width / 2;
        const tvY = rect.top + rect.height / 2;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const rotateY = (mouseX - tvX) * 0.04;
        const rotateX = -(mouseY - tvY) * 0.04;

        tv.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
    });
});

document.addEventListener("mouseleave", () => {
    tvs.forEach((tv) => {
        tv.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
});


