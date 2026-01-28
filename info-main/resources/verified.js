// Verified Tick Animation Sequence (tick_0.png to tick_19.png)
document.addEventListener('DOMContentLoaded', () => {
    const verifiedTicks = document.querySelectorAll('.verified-tick-img');
    let frame = 0;
    const totalFrames = 20; // 0 to 19
    const frameSpeed = 50; // ms per frame (20fps)

    // Preload images to avoid flickering
    const images = [];
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = `${window.location.origin}/resources/tick_${i}.png`;
        images.push(img);
    }

    function animate() {
        verifiedTicks.forEach(tick => {
            // Determine the path based on whether we are in a subfolder or not
            // If the src is already set and consistent, it's better.
            // Using relative path based on the root resources folder
            const pathPrefix = window.location.pathname.includes('/admin/') ? '../resources/' : 'resources/';
            tick.src = `${pathPrefix}tick_${frame}.png`;
        });
        frame = (frame + 1) % totalFrames;
    }

    if (verifiedTicks.length > 0) {
        setInterval(animate, frameSpeed);
    }
});
