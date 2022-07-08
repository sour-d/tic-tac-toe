const onSubmitForm = () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);
  const body = new URLSearchParams(formData).toString();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/register');
  xhr.send(body);
  xhr.onload = () => registrationResponseHandler(xhr.response);
};

const registrationResponseHandler = (rawRes) => {
  const res = JSON.parse(rawRes);
  if (res.registered) {
    document.getElementsByTagName('body')[0].append('Registered');
  }
};