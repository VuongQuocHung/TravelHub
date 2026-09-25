const sanitizeHtml = require("sanitize-html");

// Chỉ giữ những thẻ HTML cần thiết cho nội dung được nhập từ TinyMCE.
// Các thẻ script, thuộc tính onClick, URL javascript:... sẽ bị loại bỏ.
module.exports.sanitizeRichText = (value = "") => {
  return sanitizeHtml(String(value), {
    allowedTags: [
      "a", "blockquote", "br", "caption", "code", "div", "em",
      "figcaption", "figure", "h1", "h2", "h3", "h4", "h5", "h6",
      "hr", "img", "li", "ol", "p", "pre", "span", "strong",
      "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      // Ngăn trang được mở từ link mới có thể điều khiển lại trang hiện tại.
      a: sanitizeHtml.simpleTransform(
        "a",
        {
          rel: "noopener noreferrer"
        },
        true
      )
    }
  });
};

// Lịch trình tour được gửi lên dưới dạng một mảng các object.
// Chỉ trường description chứa HTML; các trường còn lại vẫn được giữ nguyên.
module.exports.sanitizeTourSchedules = (schedules = []) => {
  if (!Array.isArray(schedules)) {
    return [];
  }

  return schedules.map((schedule) => ({
    ...schedule,
    description: module.exports.sanitizeRichText(schedule?.description)
  }));
};
