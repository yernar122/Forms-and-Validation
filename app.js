'use strict';

document.querySelectorAll('form[data-demo]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('[data-status]');
    if (status) status.textContent = 'Form submitted successfully.';
  });
});

function applyFeedback(control, shouldShow) {
  control.classList.remove('is-valid', 'is-invalid');
  if (shouldShow) control.classList.add(control.checkValidity() ? 'is-valid' : 'is-invalid');
}

function setupBootstrapValidation(form) {
  const fields = Array.from(form.querySelectorAll('input.form-control, select.form-select, textarea.form-control'));
  const password = form.querySelector('[name="password"]');
  const confirm = form.querySelector('[name="confirmPassword"]');
  let attempted = false;

  function updatePasswordMatch() {
    if (password && confirm) {
      confirm.setCustomValidity(confirm.value && confirm.value !== password.value ? 'Passwords must match.' : '');
    }
  }

  function updateField(field) {
    updatePasswordMatch();
    applyFeedback(field, attempted || field.dataset.touched === 'true');
    if (password && confirm && field === password && confirm.dataset.touched === 'true') {
      applyFeedback(confirm, true);
    }
  }

  fields.forEach((field) => {
    field.addEventListener('blur', () => { field.dataset.touched = 'true'; updateField(field); });
    field.addEventListener('input', () => updateField(field));
    field.addEventListener('change', () => updateField(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    attempted = true;
    updatePasswordMatch();
    fields.forEach((field) => applyFeedback(field, true));
    const requiredRadio = form.querySelector('input[type="radio"][required]');
    if (requiredRadio) {
      const group = requiredRadio.closest('fieldset');
      if (group) group.classList.toggle('radio-invalid', !requiredRadio.checkValidity());
    }
    const status = form.querySelector('[data-status]');
    if (status) {
      const ok = form.checkValidity();
      status.textContent = ok ? 'Success!' : 'Please fix the highlighted fields.';
      status.classList.toggle('text-success', ok);
      status.classList.toggle('text-danger', !ok);
    }
  });

  form.addEventListener('reset', () => {
    attempted = false;
    fields.forEach((field) => { field.classList.remove('is-valid','is-invalid'); delete field.dataset.touched; });
    if (confirm) confirm.setCustomValidity('');
    form.querySelectorAll('fieldset.radio-invalid').forEach(fieldset => fieldset.classList.remove('radio-invalid'));
    const status = form.querySelector('[data-status]');
    if (status) { status.textContent = ''; status.classList.remove('text-success','text-danger'); }
  });
}

document.querySelectorAll('form[data-bootstrap-validation]').forEach(setupBootstrapValidation);

document.querySelectorAll('form[data-bootstrap-validation] input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const group = radio.closest('fieldset');
    if (group) group.classList.remove('radio-invalid');
  });
});
