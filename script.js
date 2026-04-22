const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element) => observer.observe(element));

const photoDemo = document.querySelector("[data-photo-demo]");

if (photoDemo) {
  const baseImage = photoDemo.querySelector(".photo-base");
  const taggedImage = photoDemo.querySelector(".photo-tagged");
  const title = photoDemo.querySelector("[data-demo-title]");
  const status = photoDemo.querySelector("[data-demo-status]");
  const photos = [
    { base: "1.jpg", tagged: "1T.jpg", label: "photo 1" },
    { base: "2.jpg", tagged: "2T.jpg", label: "photo 2" },
    { base: "3.jpg", tagged: "3T.jpg", label: "photo 3" },
    { base: "4.jpg", tagged: "4T.jpg", label: "photo 4" },
  ];

  let currentPhoto = 0;

  const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

  const setPhoto = (photo) => {
    photoDemo.style.setProperty("--wipe", "0%");
    baseImage.src = photo.base;
    taggedImage.src = photo.tagged;
    title.textContent = `Scanning ${photo.label}`;
    status.textContent = "Original photo";
  };

  const revealTaggedPhoto = (duration = 1600) =>
    new Promise((resolve) => {
      const startedAt = performance.now();
      photoDemo.classList.add("is-scanning");
      status.textContent = "Tagging students";

      const animate = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        photoDemo.style.setProperty("--wipe", `${eased * 100}%`);

        if (progress < 1) {
          requestAnimationFrame(animate);
          return;
        }

        photoDemo.classList.remove("is-scanning");
        title.textContent = `Tagged ${photos[currentPhoto].label}`;
        status.textContent = "Students identified";
        resolve();
      };

      requestAnimationFrame(animate);
    });

  const cyclePhotos = async () => {
    while (true) {
      setPhoto(photos[currentPhoto]);
      await wait(900);
      await revealTaggedPhoto();
      await wait(1100);
      photoDemo.classList.add("is-fading");
      await wait(420);
      currentPhoto = (currentPhoto + 1) % photos.length;
      setPhoto(photos[currentPhoto]);
      photoDemo.classList.remove("is-fading");
      await wait(380);
    }
  };

  cyclePhotos();
}
