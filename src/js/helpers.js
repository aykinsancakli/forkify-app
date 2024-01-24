import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Combine get and send JSON
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // Create an error if to be handled in catch if something goes wrong
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // data => resolved value of the promise that the getJSON function returns
    return data;
  } catch (err) {
    // Rethrow the error => (returns a rejected promise to be handled in loadRecipe function)
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(`${url}`), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // Create an error if to be handled in catch if something goes wrong
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // data => resolved value of the promise that the getJSON function returns
    return data;
  } catch (err) {
    // Rethrow the error => (returns a rejected promise to be handled in loadRecipe function)
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // Create an error if to be handled in catch if something goes wrong
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // data => resolved value of the promise that the getJSON function returns
    return data;
  } catch (err) {
    // Rethrow the error => (returns a rejected promise to be handled in loadRecipe function)
    throw err;
  }
};
*/
