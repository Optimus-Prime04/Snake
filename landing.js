
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});


const playBtn = document.querySelector(".play-btn");

playBtn.addEventListener("click", (e) => {

    playBtn.style.transform = "scale(0.95)";

    setTimeout(() => {
        playBtn.style.transform = "";
        window.location.href = "game.html";
    }, 120);

});


document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        window.location.href = "game.html";
    }

});


document.addEventListener("mousemove", (e) => {

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    document.querySelector(".hero").style.transform =
        `translate(${x}px, ${y}px)`;

});