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
// attaching listeners to delete collection buttons
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

    // finally close the dropdown menu
    openDropdownClickHandler(event);

}


// attaching listeners to edit collection buttons
function openEditPopupClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    const em_collectionName = elem.getAttribute("em-collectionName");
    const em_collectionId = elem.getAttribute("em-collectionId");
    const em_collectionDescription = elem.getAttribute("em-collectionDescription");
    const editModal = document.getElementById("edit-popup");



    const form = editModal.querySelector("#wf-form-Edit-Collection");
    if (form) {
        form.setAttribute("em-collectionId", em_collectionId);
        // Reset the inputs in the form
        form.reset();
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


    // Find the input element with the name attribute equal to "name"
    var nameInput = editModal.querySelector('input[name="name"]');
    // Check if the input element exists before setting its value
    if (nameInput) {
        nameInput.value = em_collectionName;
    }

    // Find the textarea element with the name attribute equal to "description" within the form
    var textarea = editModal.querySelector('textarea[name="description"]');
    // Check if the textarea element exists within the form
    if (textarea && em_collectionDescription) {
        // Set the value of the textarea to "abc"
        textarea.value = em_collectionDescription;
    }

    editModal.classList.add('add-animation');
    editModal.style.display = "block";
    editModal.style.opacity = "100%";

    // finally close the dropdown menu
    openDropdownClickHandler(event);

}


// attaching listeners to all delete collection buttons
function openDropdownClickHandler(event) {
    // Set the initial state for all sibling elements
    let targetDropdownWrapper = event.target.closest(".dropdown-wrapper");



    // Get all dropdown wrappers
    var allDropdownWrappers = document.querySelectorAll(".dropdown-wrapper");
    // Close all other dropdowns except for the one that was clicked
    allDropdownWrappers.forEach(function (wrapper) {
        if (wrapper !== targetDropdownWrapper) {
            var dropdownContent = wrapper.querySelector(".dropdown-content");
            if (dropdownContent) {
                dropdownContent.style.display = "none";
                dropdownContent.style.opacity = "0%";
            }
        }
    });

    const targetDropdownContent = targetDropdownWrapper.getElementsByClassName("dropdown-content");
    if (targetDropdownContent.length > 0) {
        if (targetDropdownContent[0].style.display === "none" || targetDropdownContent[0].style.display === "") {

            targetDropdownContent[0].classList.add('add-animation');
            targetDropdownContent[0].style.display = "block";
            targetDropdownContent[0].style.opacity = "100%";
        }
        else {
            targetDropdownContent[0].style.display = "none";
            targetDropdownContent[0].style.opacity = "0%";
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

Webflow.push(function () {
    // unbind webflow form handling (keep this if you only want to affect specific forms)
    $(document).off('submit');

    /* Any form on the page */
    $('form').submit(function (e) {
        e.preventDefault();

        const $form = $(this); // The submitted form
        const $submit = $('[type=submit]', $form); // Submit button of form
        const buttonText = $submit.val(); // Original button text
        const buttonWaitingText = $submit.attr('data-wait'); // Waiting button text value
        var formMethodType = $form.attr('method'); // Form method (where it submits to)
        const formActionURL = $form.attr('action'); // Form action (GET/POST)
        const formRedirect = $form.attr('data-redirect'); // Form redirect location
        const formDataString = $form.serialize(); // Form data
        console.log(formDataString);


        const formDataObj = formDataString.split('&').reduce((acc, keyValue) => {
            const [key, value] = keyValue.split('=');
            acc[key] = decodeURIComponent(value); // Use decodeURIComponent to handle special characters, if any
            return acc;
        }, {});

        console.log(formDataObj);
        debugger;
        const collectionId = $form.attr('em-collectionId');
        const finalActionURL = formActionURL + '/' + collectionId;

        let outsetaJWT = getOutsetaKey();

        // Log headers before the request
        const headersData = {
            'Authorization': 'Bearer ' + outsetaJWT
        };
        console.log("Headers for the request:", headersData);
        console.log(JSON.stringify({
            name: formDataObj.name,
            description: formDataObj.description
        }));



        var finalData = JSON.stringify({
            "name": formDataObj.name,
            "description": formDataObj.description
        });

        // change the formMethodType if its delete
        if ($form.attr("id") === "wf-form-Delete-Collection") {
            formMethodType = "delete";
            finalData = {};
        }


        $.ajax(finalActionURL, {
            data: finalData,
            contentType: 'application/json',
            type: formMethodType,
            headers: headersData
        })
            .done((res) => {

                $form
                    .hide() // optional hiding of form
                    .siblings('.w-form-done').show() // Show success
                    .siblings('.w-form-fail').hide(); // Hide failure

                // If form redirect setting set, then use this and prevent any other actions
                if (formRedirect) {
                    setTimeout(function () {
                        console.log("timeout done");
                        window.location = formRedirect;
                        return;
                    }, 2000); //delay is in milliseconds 
                }
                // Call the reloadData function after a successful submission
                reloadData();
            })
            .fail((res) => {
                $form
                    .siblings('.w-form-done').hide() // Hide success
                    .siblings('.w-form-fail').show(); // show failure
            })
            .always(() => {
                // Reset text
                $submit.val(buttonText);
            });

    });
});


window.addEventListener("DOMContentLoaded", reloadData);

async function reloadData() {
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
        $("#table-wrapper").empty();
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


        const deleteMenu = clonedElement.find(".delete-coll-button");
        deleteMenu.on("click", openDeletePopupClickHandler);

        const editMenu = clonedElement.find(".edit-coll-button");
        editMenu.on("click", openEditPopupClickHandler);

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
        clonedElement.attr('em-collectionDescription', em_coll.description);

        clonedElement.find(".action-link").attr('em-collectionId', em_coll.id);
        clonedElement.find(".action-link").attr('em-collectionName', em_coll.name);

        // also append the description if it the edit button.
        clonedElement.find('.action-link.edit-coll-button').attr('em-collectionDescription', em_coll.description);

        // Show the cloned element (assuming it was hidden before)
        clonedElement.show();

    });

    // // remove loader and show movie grid
    setTimeout(() => {
        // loader.style.opacity = "0%";
        // loader.classList.toggle("hide");
        // movieGrid.style.opacity = "100%";
        document.body.style.overflow = "auto";
    }, 1500);
};