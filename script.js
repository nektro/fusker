/**
 */
//
"use strict";
//
const here = new URL(location.href);

//
if (!(here.searchParams.has("url"))) {
    const section_submit = document.getElementById("section-submit");
    section_submit.style.display = "block";

    section_submit.children[1].addEventListener("click", function() {
        location.assign(`./?url=${section_submit.children[0].children[1].value}`);
    });
}
else {
    const section_images = document.getElementById("section-images");
    section_images.style.display = "block";

    const PROXY = "https://cors.io/?";
    const image_urls = [];
    const url_sp = here.searchParams.get("url");
    const url = url_sp.endsWith("/") ? url_sp : `${url_sp}/`;
    const valid_extentions = ["png","jpg","jpeg"];

    let image_index = 0;
    let image_max = 50;

    Promise.resolve(PROXY + url)
    .then(a => fetch(a))
    .then(a => a.text())
    .then(a => {
        const ele = document.createElement("html");
        ele.innerHTML = a;
        return ele;
    })
    .then(a => a.querySelectorAll("a"))
    .then(a => {
        section_images.children[0].children[0].classList.remove("spin");
        section_images.children[0].children[0].textContent = url;
        section_images.children[0].children[0].setAttribute("href", url);

        for (const link of a) {
            const ext = (link.getAttribute('href').toLowerCase().split(".").reverse()[0]);
    
            if (valid_extentions.includes(ext)) {
                image_urls.push(link.getAttribute('href'));
            }
        }

        section_images.children[1].textContent = `${image_urls.length} Results`;
        section_images.children[4].children[0].removeAttribute("hidden");
    });

    function load_next_image() {
        if (image_urls.length > image_index && image_index < image_max) {
            image_index += 1;
            const i = document.createElement("img")
            i.setAttribute("src", `${url}${image_urls[image_index-1]}`);
            i.setAttribute("width", (100).toString());
            i.setAttribute("height", (100).toString());
            section_images.children[2].appendChild(i);
        }
        requestAnimationFrame(load_next_image);
    }
    load_next_image();

    section_images.children[4].children[0].addEventListener("click", function() {
        if (image_urls.length >= image_max) {
            image_max += 100;
        }
        else {
            this.textContent = "Done!";
        }
    });
}
