
const Webflow = Webflow || [];

// Get references to both divs
const contentTableDiv = $("#content-mid-table"); // for hiding and showing the div with collections table
const contentSectionDiv = $("#content-mid-starter");// for hiding and showing the div with 0 items in collections table


// default check
const bearerKey = getOutsetaKey();
if (!bearerKey) {
    console.log('User is not logged in');
}
// Use bearerKey here
//console.log("Bearer Key inside function:", bearerKey);

// Check if the contentTableDiv has a child element with class "w-dyn-empty"
if (contentTableDiv.find(".w-dyn-empty").length > 0) {
    // If it has the class, show the contentSectionDiv div and hide the contentTableDiv
    contentTableDiv.hide();
    contentSectionDiv.show();
} else {
    // If it doesn't have the class, show the contentTableDiv and hide the contentSectionDiv div
    contentTableDiv.show();
    contentSectionDiv.hide();
}


/****Utility functions starts****/
function getOutsetaKey() {
    return sessionStorage.getItem("Outseta.nocode.accessToken");
}


function getNextSiblingWithClass(element, className) {
    while (element = element.nextSibling) {
        if (element.nodeType === 1 && element.classList.contains(className)) {
            return element;
        }
    }
    return null;
}
/****Utility functions ends****/

/*** functions invoked on page load */
// attaching listeners to all delete collection buttons
(function clickDeleteCollectionButton() {
    const appButtons = document.getElementsByClassName("delete-coll-button");
    for (let appButton of appButtons) {
        // const appButton = document.getElementById("App-Button1");
        appButton.addEventListener("click", event => {
            const em_collectionId = event.target.getAttribute("em-collectionId");
            const selector = "#wf-form-Delete-Collection[em-collectionId=\"" + em_collectionId + "\"]";
            const form = document.querySelector(selector);
            if (form.style.display === "none" || form.style.display === "") {
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

        });
    }

})();

// attaching listeners to all edit collection buttons
(function clickEditCollectionButton() {
    const appButtons = document.getElementsByClassName("edit-coll-button");
    for (let appButton of appButtons) {
        // const appButton = document.getElementById("App-Button1");
        appButton.addEventListener("click", event => {

            const em_collectionId = event.target.getAttribute("em-collectionId");
            const selector = "#wf-form-Edit-Collection[em-collectionId=\"" + em_collectionId + "\"]";
            const form = document.querySelector(selector);
            if (form.style.display === "none") {
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

        });
    }

})();

// attaching listeners to all modal input boxes for delete collection
(function keyChangeDeleteCollectionInput() {
    const inputTexts = document.getElementsByClassName("delete-collection-input");

    for (let inputEl of inputTexts) {
        inputEl.addEventListener("keyup", event => {

            const activeFormElement = document.querySelector('#delete-popup[style="display: block; opacity: 1;"] #wf-form-Delete-Collection');
            /*const em_collectionId = event.target.getAttribute("em-collectionId");
            const selector = "#wf-form-Delete-Collection[em-collectionId=\"" + em_collectionId + "\"]";
            const activeFormElement = document.querySelector(selector);*/

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
/**** */



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
        const formMethodType = $form.attr('method'); // Form method (where it submits to)
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


        $.ajax(finalActionURL, {
            data: JSON.stringify({
                "name": formDataObj.name,
                "description": formDataObj.description
            }),
            contentType: 'application/json',
            type: formMethodType,
            headers: headersData
        })
            .done((res) => {

                $form
                    .css("display", "none") // optional hiding of form
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



