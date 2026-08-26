const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  let parser;

  try {
    const buffer = fs.readFileSync(filePath);

    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    return result.text;
  } catch (error) {
    console.error("PDF parsing failed:", error.message);
    throw error;
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};

module.exports = extractTextFromPDF;
