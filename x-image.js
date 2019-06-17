/**
 */
//
const observer = new IntersectionObserver(function(changes) {
    changes.forEach(function(change) {
        if(change.isIntersecting) {
            change.target.setAttribute("src", change.target.parentElement.getAttribute("data-src"));
            observer.unobserve(change.target);
	    }
    });
});
//
customElements.define("x-image", class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const i = document.createElement("img");
        i.src = "https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/VCHXZQKsxil3lhgr4/animation-loading-circle-icon-on-white-background-with-alpha-channel-4k-video_sjujffkcde_thumbnail-small01.jpg";
        observer.observe(i);
        this.appendChild(i);
    }
});
