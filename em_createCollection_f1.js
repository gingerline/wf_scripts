
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
/*if (!bearerKey) {
    alert('User is not logged in');
}*/


var Webflow = Webflow || [];

Webflow.push(function () {

    $(document).off('submit');

    /* Any form on the page */
    $('form').submit(function (e) {
        e.preventDefault();
        const $form = $(this);
        const $submit = $('[type=submit]', $form);
        const buttonText = $submit.val();
        const buttonWaitingText = $submit.attr('data-wait');
        const formMethodType = $form.attr('method');
        const formActionURL = $form.attr('action');
        const formRedirect = $form.attr('data-redirect');
        const formDataString = $form.serialize();

        const formDataObj = formDataString.split('&').reduce((acc, keyValue) => {
            const [key, value] = keyValue.split('=');
            acc[key] = decodeURIComponent(value); // Use decodeURIComponent to handle special characters, if any
            return acc;
        }, {});


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
