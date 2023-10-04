const { modernStyles, classicStyles } = require("../templates/styles");

exports.customizeHtmlStyles = (html, template) => {
  let modifiedHtml = html;
  // Apply the appropriate styles based on the template value
  if (template === "Classic") {
    modifiedHtml = modifiedHtml.replace("<style>", `<style>${classicStyles}`);
  } else if (template === "Modern") {
    modifiedHtml = modifiedHtml.replace("<style>", `<style>${modernStyles}`);
  }

  return modifiedHtml;
};

// Function to generate an index page from headings
exports.generateIndexHtml = (html) => {
  const headings = html.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi);

  if (!headings || headings.length === 0) {
    return { modifiedHtml: html, indexHtml: "" };
  }

  const indexHtml = `
    <div class="book-index" style="page-break-after: always; text-align: center;">
      <h1>Table of Contents</h1>
      <ul style="list-style-type: none; padding: 0;">
        ${headings
          .map((heading, index) => {
            const headingText = heading.replace(/<[^>]*>/g, "");
            return `<li><a href="#heading${index + 1}">${headingText}</a></li>`;
          })
          .join("\n")}
      </ul>
    </div>
  `;

  const modifiedHtml = headings.reduce((modified, heading, index) => {
    return modified.replace(
      heading,
      `<a name="heading${index + 1}"></a>${heading}`
    );
  }, html);

  return { modifiedHtml, indexHtml };
};
