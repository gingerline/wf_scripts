window.addEventListener("DOMContentLoaded", async () => {
    // global constants
    const API_URL = "https://jsonplaceholder.typicode.com/albums";

    // functions
    async function getData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            return data.results;
        } catch (err) {
            errorDetected();
        }
    }

    function errorDetected() {
        // document.getElementById("load-icon").style.display = "none";
        // document.getElementById("error-msg").style.display = "block";
        // Check if the contentTableDiv has a child element with class "w-dyn-empty"

        // If it has the class, show the contentSectionDiv div and hide the contentTableDiv
        document.getElementById("content-mid-table").style.display = "none";
        document.getElementById("content-mid-starter").style.display = "none";

    }

    // get data
    const em_collections = await getData();

    // stop executing code if error fetching data
    if (!em_collections) {
        errorDetected();
        return;
    }

    // dom elements
    const contentTableDiv = document.getElementById("content-mid-table");
    const contentSectionDiv = document.getElementById("content-mid-starter");

    // initial styles
    // movieGrid.style.opacity = "0%";
    document.body.style.overflow = "hidden";

    // Check if the contentTableDiv has a child element with class "w-dyn-empty"
    if (em_collections && em_collections.length > 0) {
        // If it has the class, show the contentSectionDiv div and hide the contentTableDiv
        contentTableDiv.style.display = "block";
        contentSectionDiv.style.display = "none";
    } else {
        // If it doesn't have the class, show the contentTableDiv and hide the contentSectionDiv div
        contentTableDiv.style.display = "none";
        contentSectionDiv.style.display = "block";
    }

    function duplicateCollectionCard() {
        // Get the element to be duplicated
        const originalElement = document.getElementById("collection_card_link1");

        // Clone the element and all its children
        const clonedElement = originalElement.cloneNode(true);

        // Optionally, you can modify the clonedElement properties if needed.
        // For example, to give it a new ID:
        // clonedElement.id = "newId";

        // Append the cloned element to the same parent as the original
        originalElement.parentNode.appendChild(clonedElement);
        return clonedElement;
    }


    // iterate through data results
    // create img element for each data item
    // add class to each image (class exists in Webflow)
    // append each item to movie grid
    em_collections.forEach((em_coll) => {
        const clonedElement = duplicateCollectionCard();
        // Find the div with class "collection-card-heading" within the cloned element
        const headingDiv = clonedElement.querySelector(".collection-card-heading");
        // Update its content
        if (headingDiv) {
            headingDiv.textContent = em_coll.title;
        }
        // moviePoster.classList.add("movie-image");
        // moviePoster.src = `${IMAGE_PATH}${em_coll.poster_path}`;
        // movieGrid.appendChild(moviePoster);
    });

    // // remove loader and show movie grid
    setTimeout(() => {
        // loader.style.opacity = "0%";
        // loader.classList.toggle("hide");
        // movieGrid.style.opacity = "100%";
        document.body.style.overflow = "auto";
    }, 1500);
});