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
    const pr = section_images.querySelector("progress");

    const PROXY = "https://cors.io/?";
    const image_urls = [];
    const url_sp = here.searchParams.get("url");
    const url = url_sp.endsWith("/") ? url_sp : `${url_sp}/`;
    const valid_extentions = ["png","jpg","jpeg","gif"];

    let image_index = 0;
    let image_max = 50;

    Promise.resolve(PROXY + url)
    .then(url => fetch(url))
    .then(response => response.text())
    .then(text => {
        const ele = document.createElement("html");
        ele.innerHTML = text;
        return ele;
    })
    .then(html => {
        section_images.children[0].children[0].classList.remove("spin");
        section_images.children[0].children[0].textContent = url;
        section_images.children[0].children[0].setAttribute("href", url);

        for (const a of html.querySelectorAll("a")) {
            if (a.hasAttribute("href")) {
                const url = a.getAttribute("href");
                const ext = (url.toLowerCase().split(".").reverse()[0]);
        
                if (valid_extentions.includes(ext)) {
                    image_urls.push(url);
                }
            }
        }

        section_images.children[1].textContent = `${image_urls.length} Results`;
        pr.max = image_urls.length;
    });

    function load_next_image() {
        if (image_urls.length > image_index) {
            image_index += 1;
            const i = document.createElement("x-image")
            const u = image_urls[image_index-1];
            i.setAttribute("data-src", (u.startsWith("//")||u.startsWith("http"))?u:`${url}${u}`);
            i.setAttribute("width", (100).toString());
            i.setAttribute("height", (100).toString());
            section_images.children[3].appendChild(i);
            pr.value += 1;
        }
        requestAnimationFrame(load_next_image);
    }
    load_next_image();
}
