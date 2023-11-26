// attaching listeners to all modal input boxes for delete key
(function keyChangeDeleteKeyInput() {
    const inputTexts = document.getElementsByClassName("delete-key-input");

    for (let inputEl of inputTexts) {
        inputEl.addEventListener("keyup", event => {

            const em_keyId = event.target.getAttribute("em-keyId");
            const selector = "#wf-form-Delete-Key[em-keyId=\"" + em_keyId + "\"]";
            const activeFormElement = document.querySelector(selector);

            if (activeFormElement) { // Only proceed if the activeFormElement exists.
                const submitButton = activeFormElement.querySelector(".popup-form-error-button");
                submitButton.disabled = true;
                submitButton.classList.add("disabled");
                const inputText = activeFormElement.querySelector("#delete-key-input");
                var actualItemName = inputText.getAttribute("em-keyName").trim();

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
// attaching listeners to delete key buttons
function openDeletePopupClickHandler(event) {
    // Set the initial state for all sibling elements
    //const targetElem = event.target;
    let elem = event.target.closest(".action-link-table");
    const em_keyName = elem.getAttribute("em-keyName");
    const em_keyId = elem.getAttribute("em-keyId");
    const deleteModal = document.getElementById("delete-popup");
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_delete_intgKey', {
            source: "ui"
        });
    }
    if (deleteModal) {

        deleteModal.classList.add('add-animation');
        deleteModal.style.display = "block";
        deleteModal.style.opacity = "100%";
    }

    const inputElement = deleteModal.querySelector("#delete-key-input");
    if (inputElement) {
        inputElement.setAttribute("em-keyName", em_keyName);
        inputElement.setAttribute("em-keyId", em_keyId);
    }

    // Find the text element with id "confirm-text" and replace its text content
    const confirmText = deleteModal.querySelector("#confirm-text");
    if (confirmText && em_keyName) {
        confirmText.textContent = `Are you sure you want to delete "${em_keyName}"?`;
    }


    const form = deleteModal.querySelector("#wf-form-Delete-Key");

    if (form) {
        form.setAttribute("em-keyId", em_keyId);
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
    //openDropdownClickHandler(event);

}


// attaching listeners to edit key buttons
function openAddPopupClickHandler(event) {
    // Set the initial state for all sibling elements
    const elem = event.target;
    const addModal = document.getElementById("add-popup");

    const form = addModal.querySelector("#wf-form-Add-Key");
    if (posthog.isFeatureEnabled('enable-emEvents')) {
        posthog.capture('user_clicked_new_intgKey', {
            source: "ui"
        });
    }
    if (form) {
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

    // finally close the dropdown menu
    // openDropdownClickHandler(event);

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
        const keyId = $form.attr('em-keyId');
        let finalActionURL = formActionURL;

        let outsetaJWT = getOutsetaKey();

        // Log headers before the request
        const headersData = {
            'Authorization': 'Bearer ' + outsetaJWT
        };
        console.log("Headers for the request:", headersData);
        console.log(JSON.stringify({
            name: "OpenAI-Key",
            token: formDataObj.value
        }));

        var finalData = JSON.stringify({
            "name": "OpenAI-Key",
            "token": formDataObj.value,
            "type": "INTEGRATION",
            "system": "OPEN-AI"
        });

        const formId = $form.attr("id");
        // change the formMethodType if its delete
        if (formId === "wf-form-Delete-Key") {
            finalActionURL = formActionURL;
            //formMethodType = "delete";
            finalData = JSON.stringify({
                "id": parseInt(keyId)
            });
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_delete_intgKey', {
                    source: "ui",
                    form: formId,
                    formData: finalData
                });
            }
        } else {
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_new_intgKey', {
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
                if (formId === "wf-form-Delete-emKey") {
                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_deleted_intgKey', {
                            source: "ui",
                            form: formId,
                            formData: finalData
                        });
                    }
                } else {
                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_created_new_intgKey', {
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
                reloadData();
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


window.addEventListener("DOMContentLoaded", reloadData);

async function reloadData() {
    // dom elements
    const contentTableDiv = document.getElementById("content-mid-table");
    const contentSectionDiv = document.getElementById("content-mid-starter");
    const spinner = document.getElementById("spinners");

    contentTableDiv.style.display = "none";
    contentSectionDiv.style.display = "none";
    spinner.style.display = "flex";

    // initial styles
    // movieGrid.style.opacity = "0%";
    document.body.style.overflow = "hidden";

    // global constants
    const API_URL = "https://apis.emno.io/tokens";
    debugger;
    // functions
    async function fetchDataAndHandleResponse() {
        try {
            let response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    ...headersData,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'INTEGRATION'
                })
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

    function errorDetected() {
        // document.getElementById("load-icon").style.display = "none";
        // document.getElementById("error-msg").style.display = "block";
        // Check if the contentTableDiv has a child element with class "w-dyn-empty"

        // If it has the class, show the contentSectionDiv div and hide the contentTableDiv
        contentTableDiv.style.display = "none";
        contentSectionDiv.style.display = "none";
        spinner.style.display = "flex";

    }

    // get data
    const em_keys = await fetchDataAndHandleResponse();

    // stop executing code if error fetching data
    if (!em_keys) {
        errorDetected();
        return;
    }

    function duplicateKeyRow() {
        // Clone the element and all its children using jQuery
        const clonedElement = $('#key-wrapper').clone(true);
        clonedElement.attr('id', 'new-key-wrapper');
        // Append the cloned element to the same parent as the original using jQuery
        clonedElement.appendTo('#table-wrapper');


        const deleteButton = clonedElement.find(".delete-key-button");
        deleteButton.on("click", openDeletePopupClickHandler);

        //const addButton = clonedElement.find(".add-key-button");
        //addButton.on("click", openAddPopupClickHandler);

        return clonedElement;
    }

    // Check if the contentTableDiv has a child element with class "w-dyn-empty"
    if (em_keys && em_keys.length > 0) {
        // If it has the class, show the contentSectionDiv div and hide the contentTableDiv
        contentTableDiv.style.display = "block";
        contentSectionDiv.style.display = "none";
        spinner.style.display = "none";
        $("#table-wrapper").empty();


        // iterate through data results
        // create img element for each data item
        // add class to each image (class exists in Webflow)
        // append each item to movie grid
        em_keys.forEach((em_key) => {
            const clonedElement = duplicateKeyRow();

            // Update the div with ID "coll-name" within the cloned element
            clonedElement.find("#key-name").text(em_key.name);

            // Update the div with ID "coll-description" within the cloned element
            clonedElement.find("#key-value").text(em_key.token);

            clonedElement.attr('em-keyId', em_key.id);

            clonedElement.find(".action-link-table").attr('em-keyId', em_key.id);
            clonedElement.find(".action-link-table").attr('em-keyName', em_key.name);

            // Show the cloned element (assuming it was hidden before)
            //clonedElement.show();
            clonedElement.removeClass("key-wrapper");

        });
    } else {
        // If it doesn't have the class, show the contentTableDiv and hide the contentSectionDiv div
        contentTableDiv.style.display = "none";
        contentSectionDiv.style.display = "block";
        spinner.style.display = "none";
    }



    // attaching listeners to add key buttons
    $(".add-key-button").on("click", openAddPopupClickHandler);


    // // remove loader and show movie grid
    setTimeout(() => {
        // loader.style.opacity = "0%";
        // loader.classList.toggle("hide");
        // movieGrid.style.opacity = "100%";
        document.body.style.overflow = "auto";
    }, 1500);
};