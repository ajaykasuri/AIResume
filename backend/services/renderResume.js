const React = require("react");
const ReactDOMServer = require("react-dom/server");

const ClassicTemplateWord =
  require("../../shared/ClassicTemplate").default;

const ModernTemplate =
  require("../../shared/ModernTemplate").default;

  const ElegantTemplate =
    require("../../shared/ElegantTemplate").default;

    const ExecutiveTemplate =
        require("../../shared/ExecutiveTemplate").default;


const templates = {
  classic: ClassicTemplateWord,
  modern: ModernTemplate,
    elegant: ElegantTemplate,
    executive: ExecutiveTemplate,
};

module.exports = function renderResume(template_id, data) {
  const Template = TEMPLATE_MAP[template_id];

  if (!Template) {
    throw new Error("Invalid template ID");
  }

  const element = React.createElement(Template, { data });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        ${ReactDOMServer.renderToStaticMarkup(element)}
      </body>
    </html>
  `;
};
