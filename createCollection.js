
const $selectModel = $('select[name="model"]');
const $inputDimensions = $('input[name="dim"]');

$selectModel.on('change', (e) => {
    const value = e.currentTarget.value;

    if (value === "OPEN-AI") {
        // Set the value of $inputDimensions based on the selected model
        $inputDimensions.val(1536);
    }
    else if (value === "HUGGINGFACE-MINI-LM-L6") {
        // Set the value of $inputDimension based on the selected model
        $inputDimensions.val(384);
    }
    else if (value === "CUSTOM") {
        // Set the value of $inputDimensions based on the selected model
        $inputDimensions.val('');
    }
});

$(document).ready(function () {
    const $inputDim = $('input[name="dim"]');
    // Set the initial value of $inputDimensions on page load
    $inputDim.val(1536);
});



function getOutsetaKey() {
    return sessionStorage.getItem("Outseta.nocode.accessToken");
}

function algoCode(name) {
    if (name === 'cosine') return 'cosine';
    if (name === 'dotproduct') return 'ip';
    if (name === 'euclidean') return 'l2';
    return 'cosine'; // default
}

// default check
const bearerKey = getOutsetaKey();
if (!bearerKey) {
    alert('User is not logged in');
}

// Use bearerKey here
console.log("Bearer Key inside function:", bearerKey);

var Webflow = Webflow || [];

Webflow.push(function () {
    // unbind webflow form handling (keep this if you only want to affect specific forms)
    $(document).off('submit');

    /* Any form on the page */
    $('form').submit(function (e) {
        e.preventDefault();
        debugger;
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
        const formId = $form.attr("id");

        if (posthog.isFeatureEnabled('enable-emEvents')) {
            posthog.capture('user_submitted_new_collection', {
                source: "ui",
                form: formId,
                formData: formDataObj
            });
        }

        let outsetaJWT = getOutsetaKey();

        // Log headers before the request
        const headersData = {
            'Authorization': 'Bearer ' + outsetaJWT
        };
        console.log("Headers for the request:", headersData);
        $.ajax(formActionURL, {
            data: JSON.stringify({
                "name": formDataObj.name,
                "description": formDataObj.description,
                "config": {
                    "dim": Number(formDataObj.dim),
                    "model": formDataObj.model,
                    "algo": algoCode(formDataObj.metric)
                }
            }),
            contentType: 'application/json',
            type: formMethodType,
            headers: headersData
        })
            .done((res) => {

                $form
                    //.hide() // optional hiding of form
                    .siblings('.w-form-done').show() // Show success
                    .siblings('.w-form-fail').hide(); // Hide failure

                if (posthog.isFeatureEnabled('enable-emEvents')) {
                    posthog.capture('user_created_new_collection', {
                        source: "ui",
                        form: formId,
                        formData: formDataObj
                    });
                }
                // If form redirect setting set, then use this and prevent any other actions
                if (formRedirect) {
                    setTimeout(function () {
                        console.log("timeout done");
                        window.location = formRedirect;
                        return;
                    }, 1000); //delay is in milliseconds 
                }
            })
            .fail((res) => {
                $form
                    .siblings('.w-form-done').hide() // Hide success
                    .siblings('.w-form-fail').show(); // show failure
                const errorMessageContainer = $form.siblings('.w-form-fail').find('#error-text');
                // Show the toast-box-b element and set its opacity to 1
                const toastBox = $form.siblings('.w-form-fail').find('.toast-box-b');
                toastBox.css({ opacity: 1, display: 'block' });

                // Check if the response message contains "You have exceeded your plan limits."
                if (res.responseJSON && res.responseJSON.message.includes("You have exceeded your plan limits.")) {
                    errorMessageContainer.text("You have exceeded your plan limits. Please upgrade to create new collections.");
                } else {
                    errorMessageContainer.text("Something went wrong");
                }


                if (posthog.isFeatureEnabled('enable-emEvents')) {
                    posthog.capture('user_form_error', {
                        source: "ui",
                        form: formId,
                        formData: formDataObj,
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
