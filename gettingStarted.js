
const $selectGoal = $('select[name="goal"]');
const $selectProject = $('select[name="appInfo"]');
const $selectLang = $('select[name="language"]');

const $inputGoal = $('input[name="input-goal"]');
const $inputProject = $('input[name="input-appInfo"]');
const $inputLang = $('input[name="input-language"]');

$selectGoal.on('change', (e) => {
    const value = e.currentTarget.value;

    if (value === "Other") {
        $inputGoal
            .removeClass('hide');
    }
    else {
        $inputGoal
            .addClass('hide');
    }
});

$selectProject.on('change', (e) => {
    const value = e.currentTarget.value;

    if (value === "Other") {
        $inputProject
            .removeClass('hide');
    }
    else {
        $inputProject
            .addClass('hide');
    }
});

$selectLang.on('change', (e) => {
    const value = e.currentTarget.value;

    if (value === "Other") {
        $inputLang
            .removeClass('hide');
    }
    else {
        $inputLang
            .addClass('hide');
    }
});

function getOutsetaKey() {
    return sessionStorage.getItem("Outseta.nocode.accessToken");
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

    $(document).ready(function () {
        // Attach an event listener to the form submission
        $('#wf-form-onboarding').submit(function (event) {
            // Prevent the default form submission
            event.preventDefault();
            debugger;
            const $form = $(this); // The submitted form
            const $submit = $('[type=submit]', $form); // Submit button of form
            const buttonText = $submit.val(); // Original button text
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
                posthog.capture('user_submitted_complete_setup', {
                    source: "ui",
                    form: formId,
                    formData: formDataObj
                });
            }

            let outsetaJWT = getOutsetaKey();
            let userEmail = "";
            Outseta.on('accessToken.set', (jwt) => {
                userEmail = jwt.email;
            });

            // Log headers before the request
            const headersData = {
                'Authorization': 'Bearer ' + outsetaJWT
            };
            console.log("Headers for the request:", headersData);
            const finalData = JSON.stringify({
                "firstName": formDataObj.firstName,
                "lastName": formDataObj.lastName,
                "email": userEmail,
                "company": formDataObj.company,
                "goal": formDataObj.goal !== 'Other' ? formDataObj.goal : formDataObj['input-goal'],
                "appInfo": formDataObj.appInfo !== 'Other' ? formDataObj.appInfo : formDataObj['input-appInfo'],
                "language": formDataObj.language !== 'Other' ? formDataObj.language : formDataObj['input-language'],
                "rawJson": {}
            });
            console.log(finalData);
            // Handle success and failure events
            $.ajax(formActionURL, {
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

                    if (posthog.isFeatureEnabled('enable-emEvents')) {
                        posthog.capture('user_completed_setup', {
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
});