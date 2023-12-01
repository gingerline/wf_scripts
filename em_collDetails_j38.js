// global constants
let BASE_URL = "https://apis.emno.io/collections/";

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

(function keyChangeDeleteAllVectorsInput() {
    const inputTexts = document.getElementsByClassName("delete-all-vectors-input");

    for (let inputEl of inputTexts) {
        inputEl.addEventListener("keyup", event => {

            //const activeFormElement = document.querySelector('#delete-popup[style="display: block; opacity: 1;"] #wf-form-Delete-Collection');
            const em_collectionId = event.target.getAttribute("em-collectionId");
            const selector = "#wf-form-Delete-All-Vectors[em-collectionId=\"" + em_collectionId + "\"]";
            const activeFormElement = document.querySelector(selector);

            if (activeFormElement) { // Only proceed if the activeFormElement exists.
                const submitButton = activeFormElement.querySelector(".popup-form-error-button");
                submitButton.disabled = true;
                submitButton.classList.add("disabled");
                const inputText = activeFormElement.querySelector("#delete-all-vectors-input");
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

(function keyChangeDeleteVectorInput() {
    const inputTexts = document.getElementsByClassName("delete-vector-input");

    for (let inputEl of inputTexts) {
        inputEl.addEventListener("keyup", event => {

            //const activeFormElement = document.querySelector('#delete-popup[style="display: block; opacity: 1;"] #wf-form-Delete-Collection');
            const em_vectorId = event.target.getAttribute("em-vectorId");
            const selector = "#wf-form-Delete-Vector[em-vectorId=\"" + em_vectorId + "\"]";
            const activeFormElement = document.querySelector(selector);

            if (activeFormElement) { // Only proceed if the activeFormElement exists.
                const submitButton = activeFormElement.querySelector(".popup-form-error-button");
                submitButton.disabled = true;
                submitButton.classList.add("disabled");
                const inputText = activeFormElement.querySelector("#delete-vector-input");
                var actualItemId = inputText.getAttribute("em-vectorId").trim();

                var inputVal = inputText.value.trim();
                if (inputVal === actualItemId) {
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
function openDeleteCollectionPopupClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    const em_collectionName = elem.getAttribute("em-collectionName");
    const em_collectionId = elem.getAttribute("em-collectionId");
    const deleteModal = document.getElementById("delete-popup");
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_delete_collection', {
            source: "ui"
        });
    }


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

// attaching listeners to delete collection buttons
function openDeleteAllVectorsPopupClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    const em_collectionName = elem.getAttribute("em-collectionName");
    const em_collectionId = elem.getAttribute("em-collectionId");
    const deleteModal = document.getElementById("delete-all-vectors-popup");
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_delete_all_vectors', {
            source: "ui"
        });
    }


    if (deleteModal) {

        deleteModal.classList.add('add-animation');
        deleteModal.style.display = "block";
        deleteModal.style.opacity = "100%";
    }

    const inputElement = deleteModal.querySelector("#delete-all-vectors-input");
    if (inputElement) {
        inputElement.setAttribute("collection-item", em_collectionName);
        inputElement.setAttribute("em-collectionId", em_collectionId);
    }

    // Find the text element with id "confirm-text" and replace its text content
    const confirmText = deleteModal.querySelector("#confirm-text");
    if (confirmText && em_collectionName) {
        confirmText.textContent = `Are you sure you want to delete all vectors for "${em_collectionName}"?`;
    }


    const form = deleteModal.querySelector("#wf-form-Delete-All-Vectors");


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

// attaching listeners to delete collection buttons
function openDeleteVectorPopupClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    const em_vectorId = elem.getAttribute("em-vectorId");
    const deleteModal = document.getElementById("delete-vector-popup");
    const em_collectionId = getParam('collectionId');
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_delete_vector', {
            source: "ui"
        });
    }

    if (deleteModal) {

        deleteModal.classList.add('add-animation');
        deleteModal.style.display = "block";
        deleteModal.style.opacity = "100%";
    }

    const inputElement = deleteModal.querySelector("#delete-vector-input");
    if (inputElement) {
        inputElement.setAttribute("em-vectorId", em_vectorId);
        inputElement.setAttribute("em-collectionId", em_collectionId);
    }

    // Find the text element with id "confirm-text" and replace its text content
    const confirmText = deleteModal.querySelector("#confirm-text");
    if (confirmText && em_vectorId) {
        confirmText.textContent = `Are you sure you want to delete "${em_vectorId}"?`;
    }


    const form = deleteModal.querySelector("#wf-form-Delete-Vector");


    if (form) {
        form.setAttribute("em-vectorId", em_vectorId);
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
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_edit_collection', {
            source: "ui"
        });
    }


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

// attaching listeners to edit collection buttons
function openAddVectorPopupClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    //const em_collectionId = elem.getAttribute("em-collectionId");
    const em_collectionId = getParam('collectionId');
    const addModal = document.getElementById("add-vector-popup");
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_add_vector', {
            source: "ui"
        });
    }


    const form = addModal.querySelector("#wf-form-Add-Vector");
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

    addModal.classList.add('add-animation');
    addModal.style.display = "block";
    addModal.style.opacity = "100%";

}

async function resetQueryFormClickHandler(event) {
    const queryForm = $("#wf-form-Query-Vector");
    queryForm.reset();
    // get vectors data
    let VECTOR_API_URL = API_URL + '/vectors/getAll??limit=10';
    const em_vectors = await fetchVectorsAndHandleResponse(VECTOR_API_URL);
    await reloadVectorData(em_vectors);
    $("#reset-button-div").style.display = "none";
}

// attaching listeners to edit collection buttons
function addClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_add_collection', {
            source: "ui"
        });
    }

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

function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


Webflow.push(function () {



    // unbind webflow form handling (keep this if you only want to affect specific forms)
    $(document).off('submit');

    /* Any form on the page */
    $('form').submit(function (e) {
        e.preventDefault();

        const $form = $(this); // The submitted form
        const $submit = $('[type=submit]', $form); // Submit button of form
        const buttonText = $submit.val(); // Original button text
        var formMethodType = $form.attr('method'); // Form method (where it submits to)
        const formActionURL = $form.attr('action'); // Form action (GET/POST)
        const formRedirect = $form.attr('data-redirect'); // Form redirect location
        const formDataString = $form.serialize(); // Form data


        const formDataObj = formDataString.split('&').reduce((acc, keyValue) => {
            const [key, value] = keyValue.split('=');
            acc[key] = decodeURIComponent(value); // Use decodeURIComponent to handle special characters, if any
            return acc;
        }, {});

        console.log(formDataObj);
        debugger;
        const collectionId = $form.attr('em-collectionId') || getParam('collectionId');
        const vectorId = $form.attr('em-vectorId');
        let finalActionURL = formActionURL + '/' + collectionId;

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

        const formId = $form.attr("id");
        // change the formMethodType if its delete
        if (formId === "wf-form-Delete-Collection") {
            formMethodType = "delete";
            finalData = {};
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_delete_collection', {
                    source: "ui",
                    form: formId,
                    formData: finalData
                });
            }
        } else if (formId === "wf-form-Delete-All-Vectors") {
            finalActionURL = finalActionURL + '/vectors/delete';
            finalData = JSON.stringify({ "ids": [], "deleteAll": true });
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_delete_all_vectors', {
                    source: "ui",
                    form: formId,
                    formData: finalData
                });
            }
        } else if (formId === "wf-form-Delete-Vector") {
            finalActionURL = finalActionURL + '/vectors/delete';
            finalData = JSON.stringify({ "ids": [vectorId], "deleteAll": false });
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_delete_vector', {
                    source: "ui",
                    form: formId,
                    formData: finalData
                });
            }
        } else if (formId === "wf-form-Add-Vector") {
            finalActionURL = finalActionURL + '/vectors/create/text';
            finalData = JSON.stringify([{
                "content": formDataObj.vectorText,
                "metadata": {
                    "source": "app"
                }
            }]);
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_add_vector', {
                    source: "ui",
                    form: formId,
                    formData: finalData
                });
            }
        } else if (formId === "wf-form-Query-Vector") {
            finalActionURL = finalActionURL + '/query/text';
            finalData = JSON.stringify({
                "content": [formDataObj.content],
                "topK": parseInt(formDataObj.topK)
            });
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_query_vector', {
                    source: "ui",
                    form: formId,
                    formData: finalData
                });
            }
        } else {
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_edit_collection', {
                    source: "ui",
                    form: formId,
                    formData: finalData
                });
            }
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

                if (formId === "wf-form-Add-Vector") {
                    const $doneMessage = $form.siblings('.w-form-done').find('#tiny-createdVector');
                    const count = res.length;

                    if (count === 1) {
                        $doneMessage.text(`1 vector is created for your text.`);
                    } else {
                        $doneMessage.text(`${count} vectors are created for your text.`);
                    }
                }
                else if (formId === "wf-form-Query-Vector") {
                    $form.siblings('.w-form-done').hide() // Hide success
                    $form.show(); // Show the form
                }

                // record posthog events
                if (formId === "wf-form-Delete-Collection") {
                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_deleted_collection', {
                            source: "ui",
                            form: formId,
                            formData: finalData
                        });
                    }
                } else if (formId === "wf-form-Delete-All-Vectors") {
                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_deleted_all_vectors', {
                            source: "ui",
                            form: formId,
                            formData: finalData
                        });
                    }
                } else if (formId === "wf-form-Delete-Vector") {
                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_deleted_vector', {
                            source: "ui",
                            form: formId,
                            formData: finalData
                        });
                    }
                } else if (formId === "wf-form-Add-Vector") {
                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_added_vector', {
                            source: "ui",
                            form: formId,
                            formData: finalData
                        });
                    }
                } else {
                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_edited_collection', {
                            source: "ui",
                            form: formId,
                            formData: finalData
                        });
                    }
                }
                // If form redirect setting set, then use this and prevent any other actions
                if (formRedirect) {
                    setTimeout(function () {
                        console.log("timeout done");
                        window.location = formRedirect;
                        return;
                    }, 2000); //delay is in milliseconds 
                }
                // Call the reloadData function after a successful submission
                if (formId === "wf-form-Query-Vector" && res[0]) {
                    $("#reset-button-div").style.display = "block";
                    reloadVectorData(res[0]);
                } else {
                    $("#reset-button-div").style.display = "none";
                    reloadAllData();
                }

            })
            .fail((res) => {
                $form
                    .siblings('.w-form-done').hide() // Hide success
                    .siblings('.w-form-fail').show(); // show failure
                if (posthog.isFeatureEnabled('enable-emEvents')) {
                    posthog.capture('user_form_error', {
                        source: "ui",
                        form: formId,
                        formData: finalData,
                        errResponse: res
                    });
                }
            })
            .always(() => {
                // Reset text
                $submit.val(buttonText);
            });

    });
});

async function fetchDataAndHandleResponse(URL) {
    try {
        let response = await fetch(URL, {
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
        errorDetected();
    }
}

async function fetchVectorsAndHandleResponse(URL) {
    try {
        let response = await fetch(URL, {
            method: 'POST',
            headers: {
                ...headersData,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "includeVectorValues": false })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        errorDetected();
    }
}

function duplicateVectorCard() {
    // Clone the element and all its children using jQuery
    const clonedElement = $('#vector-wrapper').clone(true);
    clonedElement.attr('id', 'new-vector-wrapper');
    // Append the cloned element to the same parent as the original using jQuery
    clonedElement.appendTo('#table-wrapper');


    const deleteVectorMenu = clonedElement.find(".delete-vector-button");
    deleteVectorMenu.on("click", openDeleteVectorPopupClickHandler);

    const dropdownTrigger = clonedElement.find(".dropdown-trigger");
    dropdownTrigger.on("click", openDropdownClickHandler);

    return clonedElement;
}

async function reloadVectorData(em_vectors) {
    const noVectors = document.getElementById("no-vectors");
    const tableWrapper = document.getElementById("table-wrapper");

    // Check if the contentTableDiv has a child element with class "w-dyn-empty"
    if (em_vectors && em_vectors.length > 0) {

        $("#table-wrapper").empty();

        // iterate through data results
        // create img element for each data item
        // add class to each image (class exists in Webflow)
        // append each item to movie grid
        em_vectors.forEach((em_vec) => {
            const clonedElement = duplicateVectorCard();

            clonedElement.find("#vector-id").text(em_vec.id);
            clonedElement.find("#vector-content").text(em_vec.content);

            if (em_vec.metadata) {
                var metadataString = JSON.stringify(em_vec.metadata, null, 2);
                var truncatedMetadataString = metadataString.length > 250 ? metadataString.slice(0, 250) + "..." : metadataString;
                clonedElement.find("#vector-metadata").text(truncatedMetadataString);
            } else {
                clonedElement.find("#vector-metadata").hide();
            }

            if (em_vec.distance) {
                clonedElement.find("#vector-distance").text(em_vec.distance);
            } else {
                clonedElement.find("#vector-distance").hide();
                clonedElement.find("#vector-distance-block").hide();
                clonedElement.find("#vector-distance-block-prev").hide();
            }

            clonedElement.attr('em-vectorId', em_vec.id);
            clonedElement.find(".action-link").attr('em-vectorId', em_vec.id);

            // also append the description if it the edit button.
            //clonedElement.find('.action-link.edit-coll-button').attr('em-collectionDescription', em_coll.description);

            // Show the cloned element (assuming it was hidden before)
            clonedElement.show();

        });
        // hide the no vectors content and show the table
        noVectors.style.display = "none";
        tableWrapper.style.display = "block";
    } else {
        // show the no vectors content and show the table
        noVectors.style.display = "block";
        tableWrapper.style.display = "none";
    }

}

window.addEventListener("DOMContentLoaded", reloadAllData);

async function reloadAllData() {

    const contentTableDiv = document.getElementById("content-mid-table");
    const contentSectionDiv = document.getElementById("content-mid-starter");
    const spinner = document.getElementById("spinners");


    contentTableDiv.style.display = "none";
    contentSectionDiv.style.display = "none";
    spinner.style.display = "flex";

    // initial styles
    // movieGrid.style.opacity = "0%";
    document.body.style.overflow = "hidden";


    debugger;
    // functions


    function errorDetected() {
        // document.getElementById("load-icon").style.display = "none";
        // document.getElementById("error-msg").style.display = "block";
        // Check if the contentTableDiv has a child element with class "w-dyn-empty"

        // If it has the class, show the contentSectionDiv div and hide the contentTableDiv
        contentTableDiv.style.display = "none";
        contentSectionDiv.style.display = "none";
        spinner.style.display = "none";

    }

    // get collection data
    const collectionId = getParam('collectionId');
    let API_URL = BASE_URL + collectionId;
    const em_coll = await fetchDataAndHandleResponse(API_URL);

    // stop executing code if error fetching data
    if (!em_coll) {
        errorDetected();
        return;
    }

    // populate collection card
    if (em_coll) {
        const emCollCard = $('#collection-wrapper');

        // Update collection attributes
        emCollCard.find("#coll-name").text(em_coll.name);
        emCollCard.find("#coll-description").text(em_coll.description);
        emCollCard.find("#coll-dimension").text(em_coll.config.dim);
        emCollCard.find("#coll-id").text(em_coll.id);
        emCollCard.find("#coll-model").text(em_coll.config.model);

        // update the collection card custom attributes
        emCollCard.attr('em-collectionId', em_coll.id);
        emCollCard.attr('em-collectionName', em_coll.name);
        emCollCard.attr('em-collectionDescription', em_coll.description);


        emCollCard.find(".action-link").attr('em-collectionId', em_coll.id);
        emCollCard.find(".action-link").attr('em-collectionName', em_coll.name);

        // also append the description if it the edit button.
        emCollCard.find('.action-link.edit-coll-button').attr('em-collectionDescription', em_coll.description);


        // connect the dropdownHandlers
        const deleteCollectionMenu = emCollCard.find(".delete-coll-button");
        // Remove any existing click event listeners before attaching a new one
        deleteCollectionMenu.off("click", openDeleteCollectionPopupClickHandler);
        // Attach the click event listener
        deleteCollectionMenu.on("click", openDeleteCollectionPopupClickHandler);

        const editCollectionMenu = emCollCard.find(".edit-coll-button");
        // Remove any existing click event listeners before attaching a new one
        editCollectionMenu.off("click", openEditPopupClickHandler);
        // Attach the click event listener
        editCollectionMenu.on("click", openEditPopupClickHandler);

        // connect the dropdownHandlers
        const deleteAllVectorsMenu = emCollCard.find(".delete-all-vectors-button");
        // Remove any existing click event listeners before attaching a new one
        deleteAllVectorsMenu.off("click", openDeleteAllVectorsPopupClickHandler);
        // Attach the click event listener
        deleteAllVectorsMenu.on("click", openDeleteAllVectorsPopupClickHandler);

        const dropdownTrigger = emCollCard.find(".dropdown-collection-trigger");
        // Remove any existing click event listeners before attaching a new one
        dropdownTrigger.off("click", openDropdownClickHandler);
        // Attach the click event listener
        dropdownTrigger.on("click", openDropdownClickHandler);


        // hide and show the elements
        contentSectionDiv.style.display = "block";
        contentTableDiv.style.display = "block";
        spinner.style.display = "none";
    } else {
        // If it doesn't have the class, show the contentTableDiv and hide the contentSectionDiv div
        contentTableDiv.style.display = "none";
        contentSectionDiv.style.display = "none";
        spinner.style.display = "none";
    }

    // get vectors data
    let VECTOR_API_URL = API_URL + '/vectors/getAll??limit=10';
    const em_vectors = await fetchVectorsAndHandleResponse(VECTOR_API_URL);
    await reloadVectorData(em_vectors);


    $(".add-vector-btn").off("click", openAddVectorPopupClickHandler);// Remove any existing click event listeners before attaching a new one
    $(".add-vector-btn").on("click", openAddVectorPopupClickHandler);// Attach the click event listener

    $("#reset-button-div").off("click", resetQueryFormClickHandler);
    $("#reset-button-div").on("click", resetQueryFormClickHandler);
    // // remove loader and show movie grid
    setTimeout(() => {
        // loader.style.opacity = "0%";
        // loader.classList.toggle("hide");
        // movieGrid.style.opacity = "100%";
        document.body.style.overflow = "auto";
    }, 1500);
};