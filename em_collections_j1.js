// attaching listeners to all modal input boxes for delete collection
(function keyChangeDeleteCollectionInput() {
    const inputTexts = document.getElementsByClassName("delete-collection-input");

    for (let inputEl of inputTexts) {
        inputEl.addEventListener("keyup", event => {

            //const activeFormElement = document.querySelector('#delete-popup[style="display: block; opacity: 1;"] #wf-form-Delete-Collection');
            const em_collectionId = event.target.getAttribute("em-collectionId");
            const selector = "#wf-form-Delete-Collection[em-collectionId=\"" + em_collectionId + "\"]";
            const activeFormElement = document.querySelector(selector);

            if (activeFormElement) { // Only proceed if the activeFormElement exists.
                const submitButton = activeFormElement.querySelector(".popup-form-error-button");
                submitButton.disabled = true;
                submitButton.classList.add("disabled");
                const inputText = activeFormElement.querySelector("#delete-collection-input");
                var actualItemName = inputText.getAttribute("collection-item").trim();

                var inputVal = inputText.value.trim();
                if (inputVal === actualItemName) {
                    submitButton.disabled = false;
                    submitButton.classList.remove("disabled");
                } else {
                    submitButton.disabled = true;
                    submitButton.classList.add("disabled");
                }
            }
        });
    }
})();

function getNextSiblingWithClass(element, className) {
    while (element = element.nextSibling) {
        if (element.nodeType === 1 && element.classList.contains(className)) {
            return element;
        }
    }
    return null;
}
// attaching listeners to all delete collection buttons
function openDeletePopupClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    const em_collectionName = elem.getAttribute("em-collectionName");
    const em_collectionId = elem.getAttribute("em-collectionId");
    const deleteModal = document.getElementById("delete-popup");
    if (deleteModal) {

        deleteModal.classList.add('add-animation');
        deleteModal.style.display = "block";
        deleteModal.style.opacity = "100%";
    }

    const inputElement = deleteModal.querySelector("#delete-collection-input");
    if (inputElement) {
        inputElement.setAttribute("collection-item", em_collectionName);
        inputElement.setAttribute("em-collectionId", em_collectionId);
    }

    // Find the text element with id "confirm-text" and replace its text content
    const confirmText = deleteModal.querySelector("#confirm-text");
    if (confirmText && em_collectionName) {
        confirmText.textContent = `Are you sure you want to delete "${em_collectionName}"?`;
    }


    const form = deleteModal.querySelector("#wf-form-Delete-Collection");

    if (form) {
        form.setAttribute("em-collectionId", em_collectionId);
        // Reset the inputs in the form
        form.reset();
        const submitButton = form.querySelector(".popup-form-error-button");
        submitButton.disabled = true;
        submitButton.classList.add("disabled");

        // Show the form
        form.style.display = "block";

        // Get the success message div with class "w-form-done"
        var successDiv = getNextSiblingWithClass(form, "w-form-done");
        if (successDiv) {
            successDiv.style.display = "none";
        }

        // Get the error message div with class "w-form-done"
        var errorDiv = getNextSiblingWithClass(form, "w-form-fail");
        if (errorDiv) {
            errorDiv.style.display = "none";
        }
    }

    openDropdownClickHandler(event);

}


// attaching listeners to all delete collection buttons
function openDropdownClickHandler(event) {
    // Set the initial state for all sibling elements
    const dropdownTrigger = event.target;
    //const em_collectionId = dropdownTrigger.getAttribute("em-collectionId");
    //const dropdownContent = getNextSiblingWithClass(dropdownTrigger, "dropdown-content");

    let dropdownWrapper = event.target.closest(".dropdown-wrapper");

    const dropdownContent = dropdownWrapper.getElementsByClassName("dropdown-content");
    if (dropdownContent.length > 0) {
        if (dropdownContent[0].style.display === "none" || dropdownContent[0].style.display === "") {

            dropdownContent[0].classList.add('add-animation');
            dropdownContent[0].style.display = "block";
            dropdownContent[0].style.opacity = "100%";
        }
        else {
            dropdownContent[0].style.display = "none";
            dropdownContent[0].style.opacity = "0%";
        }


    }

}

function getOutsetaKey() {
    return sessionStorage.getItem("Outseta.nocode.accessToken");
}
let outsetaJWT = getOutsetaKey();
// Log headers before the request
const headersData = {
    'Authorization': 'Bearer ' + outsetaJWT
};

window.addEventListener("DOMContentLoaded", async () => {
    // global constants
    const API_URL = "https://test-emno.fly.dev/collections";
    debugger;
    // functions
    async function fetchDataAndHandleResponse() {
        try {
            let response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    ...headersData,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
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
    const em_collections = await fetchDataAndHandleResponse();

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
        // Clone the element and all its children using jQuery
        const clonedElement = $('#collection-wrapper').clone(true);
        clonedElement.attr('id', 'new-collection-wrapper');
        // Append the cloned element to the same parent as the original using jQuery
        clonedElement.appendTo('#table-wrapper');


        const deleteMenu = clonedElement.find(".edit-coll-button");
        deleteMenu.on("click", openDeletePopupClickHandler);

        const dropdownTrigger = clonedElement.find(".dropdown-trigger");
        dropdownTrigger.on("click", openDropdownClickHandler);

        return clonedElement;
    }


    // iterate through data results
    // create img element for each data item
    // add class to each image (class exists in Webflow)
    // append each item to movie grid
    em_collections.forEach((em_coll) => {
        const clonedElement = duplicateCollectionCard();

        // Update the div with ID "coll-name" within the cloned element
        clonedElement.find("#coll-name").text(em_coll.name);

        // Update the div with ID "coll-description" within the cloned element
        clonedElement.find("#coll-description").text(em_coll.description);

        clonedElement.attr('em-collectionId', em_coll.id);
        clonedElement.attr('em-collectionName', em_coll.name);

        clonedElement.find(".action-link").attr('em-collectionId', em_coll.id);
        clonedElement.find(".action-link").attr('em-collectionName', em_coll.name);

        // Show the cloned element (assuming it was hidden before)
        clonedElement.show();
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