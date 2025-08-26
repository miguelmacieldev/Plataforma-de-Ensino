const cursorOuter = document.createElement("div");
    const cursorInner = document.createElement("div");
    cursorOuter.classList.add("cursor-outer");
    cursorInner.classList.add("cursor-inner");
    document.body.appendChild(cursorOuter);
    document.body.appendChild(cursorInner);

    document.addEventListener("mousemove", e => {
        const { clientX: x, clientY: y } = e;
        cursorOuter.style.left = `${x}px`;
        cursorOuter.style.top = `${y}px`;
        cursorInner.style.left = `${x}px`;
        cursorInner.style.top = `${y}px`;
    });

    // Opcional: esconder cursor padrão
    document.body.style.cursor = "none";