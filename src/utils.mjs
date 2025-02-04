/**
 * This is to create DOM elementss safely:
 * @link https://mollify.noroff.dev/content/feu1/javascript-1/module-4/create-html?nav=
 *
 */
export function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  return parsedDocument.body.firstChild;
}

export function clearNode(el) {
  el.innerHTML = "";
}
