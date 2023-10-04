const classicStyles = `
/* Classic Template Styles */
body {
  font-family: "Times New Roman", serif;
  font-size: 18px;
  line-height: 1.5;
  margin: 2rem 1rem; /* Add margins to the entire document */
  background-color: white; /* Set background color */
}
h1, h2, h3 {
  font-size: 24px;
  line-height: 1.2;
  margin-bottom: 15px; /* Add spacing between headings */
  border-bottom: 1px solid #333; /* Add a horizontal line under headings */
  color: #333; /* Set heading text color */
  background-color: #fff; /* Set heading background color */
  padding: 10px; /* Add padding around headings */
}
p {
  padding: 10px;
  margin-bottom: 20px; /* Add spacing between paragraphs */
  background-color: #fff; /* Set paragraph background color */
  border: 1px solid #ccc; /* Add a border around paragraphs */
}
.author-section {
  font-style: italic;
  text-align: right;
  margin-top: 20px; /* Add spacing above author section */
  color: #888; /* Set author section text color */
}
`;

const modernStyles = `
    /* Modern Template Styles */
    body {
      font-family: "Arial", sans-serif;
      font-size: 20px;
      line-height: 1.6;
      margin: 2rem 1rem; /* Add margins to the entire document */
      background-color: white; /* Set background color */
    }
    h1, h2, h3 {
      font-size: 26px;
      line-height: 1.4;
      margin-bottom: 20px; /* Add spacing between headings */
      border-bottom: 2px solid #0077b6; /* Add a colored horizontal line under headings */
      color: #0077b6; /* Set heading text color */
      background-color: #fff; /* Set heading background color */
      padding: 15px; /* Add padding around headings */
      border-radius: 5px; /* Add rounded corners to headings */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Add shadow to headings */
    }
    p {
      padding: 15px;
      margin-bottom: 25px; /* Add spacing between paragraphs */
      background-color: #fff; /* Set paragraph background color */
      border: 1px solid #ddd; /* Add a border around paragraphs */
      border-radius: 3px; /* Add rounded corners to paragraphs */
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Add shadow to paragraphs */
    }
    .author-section {
      font-weight: bold;
      text-align: right;
      margin-top: 30px; /* Add spacing above author section */
      color: #555; /* Set author section text color */
    }
    .book-index {
      page-break-before: always; /* Start a new page for the book index */
      font-size: 20px;
      font-weight: bold;
      margin-top: 40px; /* Add spacing above the book index */
    }
  `;

const classicEpubStyles = `
body {
  font-family: "Arial", sans-serif;
  font-size: 20px;
  line-height: 1.6;
  margin: 20px;
  background-color: #f7f7f7;
}
h1, h2, h3 {
  font-size: 26px;
  line-height: 1.4;
  margin-bottom: 20px;
  color: #0077b6;
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
p {
  padding: 15px;
  margin-bottom: 25px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
`;

const modernEpubStyles = `
body {
  font-family: "Times New Roman", serif;
  font-size: 18px;
  line-height: 1.5;
  margin: 30px;
  background-color: #f0f0f0;
}
h1, h2, h3 {
  font-size: 24px;
  line-height: 1.2;
  margin-bottom: 15px;
  color: #333;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
}
p {
  padding: 10px;
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
}
`;

module.exports = {
  modernStyles,
  classicStyles,
  classicEpubStyles,
  modernEpubStyles,
};
