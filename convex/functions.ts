export async function postFB(url: string, body: object) {
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json", // Ensure the content type is JSON
    },
    body: JSON.stringify(body), // Convert the body to JSON string
  });
}

export async function getFB(url: string) {
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json", // Ensure the content type is JSON
    },
  });
}
