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

function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getOutsetaKey() {
    return sessionStorage.getItem("Outseta.nocode.accessToken");
}


// default check
const bearerKey = getOutsetaKey();
/*if (!bearerKey) {
    alert('User is not logged in');
}

// Use bearerKey here
console.log("Bearer Key inside function:", bearerKey);*/

var Webflow = Webflow || [];

Webflow.push(function () {

    $(document).off('submit');

    $(document).ready(function () {
        // Attach an event listener to the form submission
        $('#wf-form-onboarding').submit(function (event) {
            event.preventDefault();
            const $form = $(this);
            const $submit = $('[type=submit]', $form);
            const buttonText = $submit.val();
            const formMethodType = $form.attr('method');
            const formActionURL = $form.attr('action');
            const formRedirect = $form.attr('data-redirect');
            const formDataString = $form.serialize();
            console.log(formDataString);

            const formDataObj = formDataString.split('&').reduce((acc, keyValue) => {
                const [key, value] = keyValue.split('=');
                acc[key] = decodeURIComponent(value); // Use decodeURIComponent to handle special characters, if any
                return acc;
            }, {});


            const formId = $form.attr("id");
            if (posthog.isFeatureEnabled('enable-emEvents')) {
                posthog.capture('user_submitted_complete_setup', {
                    source: "ui",
                    form: formId,
                    formData: formDataObj
                });
            }

            let outsetaJWT = getOutsetaKey();
            if (!outsetaJWT) {
                let outsetaJWT = getOutsetaKey();
                if (!outsetaJWT) {
                    outsetaJWT = getParam('access_token');
                }
            }
            let userEmail = "";
            Outseta.on('accessToken.set', (jwt) => {
                userEmail = jwt.email;
            });
            let company = "";
            if (formDataObj.company) {
                company = formDataObj.company;
            }

            // Log headers before the request
            const headersData = {
                'Authorization': 'Bearer ' + outsetaJWT
            };

            const finalData = JSON.stringify({
                "firstName": formDataObj.firstName,
                "lastName": formDataObj.lastName,
                "company": company,
                "email": userEmail,
                "goal": formDataObj.goal !== 'Other' ? formDataObj.goal : formDataObj['input-goal'],
                "appInfo": formDataObj.appInfo !== 'Other' ? formDataObj.appInfo : formDataObj['input-appInfo'],
                "language": formDataObj.language !== 'Other' ? formDataObj.language : formDataObj['input-language'],
                "rawJson": {}
            });
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