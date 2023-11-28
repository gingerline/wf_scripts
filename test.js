<script>
    const $selectGoal = $('select[name="goal"]');
    const $selectProject = $('select[name="appInfo"]');
    const $selectLang = $('select[name="language"]');

    const $inputGoal = $('input[name="input-goal"]');
    const $inputProject = $('input[name="input-appInfo"]');
    const $inputLang = $('input[name="input-language"]');

$selectGoal.on('change', (e) => {
  const value = e.currentTarget.value;

    if(value==="Other"){
        $inputGoal
            .removeClass('hide');
  }
    else{
        $inputGoal
            .addClass('hide');
  }
});

$selectProject.on('change', (e) => {
  const value = e.currentTarget.value;

    if(value==="Other"){
        $inputProject
            .removeClass('hide');
  }
    else{
        $inputProject
            .addClass('hide');
  }
});

$selectLang.on('change', (e) => {
  const value = e.currentTarget.value;

    if(value==="Other"){
        $inputLang
            .removeClass('hide');
  }
    else{
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

    Webflow.push(function() {
        // unbind webflow form handling (keep this if you only want to affect specific forms)
        $(document).off('submit');

    $(document).ready(function () {
        // Attach an event listener to the form submission
        $('#wf-form-onboarding').submit(function (event) {
            // Prevent the default form submission
            event.preventDefault();
            debugger;
            var form = this; // Reference to the form element
            var $form = $(this); // jQuery object for the form
            const formRedirect = $form.attr('data-redirect'); // Form redirect 

            const formDataString = $form.serialize(); // Form data
            console.log(formDataString);

            const formDataObj = formDataString.split('&').reduce((acc, keyValue) => {
                const [key, value] = keyValue.split('=');
                acc[key] = decodeURIComponent(value); // Use decodeURIComponent to handle special characters, if any
                return acc;
            }, {});

            console.log(formDataObj);
            const formId = $form.attr("id");
            posthog.capture('user_submitted_complete_setup', {
                source: "ui",
                form: formId,
                formData: formDataObj
            });
            // Handle success and failure events
            // This code will execute after the form submission
            setTimeout(function () {
                // Simulate a successful response (for demonstration)
                var successResponse = true; // Change to false to simulate failure

                if (successResponse) {
                    console.log('Form submitted successfully');
                    $form
                        .hide() // optional hiding of form
                        .siblings('.w-form-done').show() // Show success
                        .siblings('.w-form-fail').hide(); // Hide failure

                    posthog.capture('user_completed_setup', {
                        source: "ui",
                        form: formId,
                        formData: formDataObj
                    });
                    // If form redirect setting set, then use this and prevent any other actions
                    if (formRedirect) {
                        setTimeout(function () {
                            console.log("timeout done");
                            window.location = formRedirect;
                            return;
                        }, 1000); // Delay is in milliseconds
                    }
                } else {
                    console.error('Form submission failed');
                    $form
                        .siblings('.w-form-done').hide() // Hide success
                        .siblings('.w-form-fail').show(); // Show failure
                }
                posthog.capture('user_form_error', {
                    source: "ui",
                    form: formId,
                    formData: formDataObj,
                    errResponse: res
                });
                // Reset text
                $form.find('input[type="submit"]').val(buttonText);
            }, 1000); // Delay is in milliseconds
        });
});
});

</script>