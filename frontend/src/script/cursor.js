const cursorOuter = document.querySelector('.cursor-outer');
        const cursorInner = document.querySelector('.cursor-inner');

        document.addEventListener('mousemove', e => {
        const { clientX: x, clientY: y } = e;
        cursorOuter.style.left = `${x}px`;
        cursorOuter.style.top = `${y}px`;
        cursorInner.style.left = `${x}px`;
        cursorInner.style.top = `${y}px`;
        });